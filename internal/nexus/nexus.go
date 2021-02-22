//go:generate protoc -I../../api --gogofast_out=plugins=grpc,paths=source_relative:. nexus.proto

package nexus

import (
	"context"
	"net"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/go-playground/validator"
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_logrus "github.com/grpc-ecosystem/go-grpc-middleware/logging/logrus"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/kcchu/isitblocked/internal/model"
)

var db *pg.DB
var validate *validator.Validate
var logger = log.WithFields(log.Fields{"app": "nexus"})

func initConfig() {
	viper.SetDefault("nexus_listen", "0.0.0.0:9001")

	viper.BindEnv("database_url")
	viper.AutomaticEnv()
}

// Start starts a nexus service.
func Start() {
	initConfig()

	db = model.InitDB()
	validate = validator.New()

	listenString := viper.GetString("nexus_listen")
	lis, err := net.Listen("tcp", listenString)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	opts := []grpc.ServerOption{
		grpc.StreamInterceptor(grpc_middleware.ChainStreamServer(
			grpc_logrus.StreamServerInterceptor(logger),
		)),
		grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
			grpc_logrus.UnaryServerInterceptor(logger),
		)),
	}
	grpcServer := grpc.NewServer(opts...)
	RegisterNexusServiceServer(grpcServer, &server{})
	log.Infof("nexus is listening on %v", listenString)
	grpcServer.Serve(lis)
}

type server struct {
}

func (s *server) Register(ctx context.Context, in *RegisterRequest) (*RegisterResponse, error) {
	if in.Token == "" {
		return nil, status.Error(codes.Unauthenticated, "invalid token")
	}

	register := false
	probe, err := getProbeByToken(in.Token)
	if err != nil {
		if err == pg.ErrNoRows {
			register = true
		} else {
			log.Errorf("sql error: %v", err)
			return nil, status.Error(codes.Unknown, "sql error")
		}
	}

	if register {
		probe = &model.Probe{
			Name:                in.NetworkName,
			IP:                  in.Ip,
			ASN:                 in.Asn,
			NetworkName:         in.NetworkName,
			CountryCode:         in.CountryCode,
			ResolverIP:          in.ResolverIp,
			ResolverASN:         in.ResolverAsn,
			ResolverNetworkName: in.ResolverNetworkName,
			SoftwareName:        in.SoftwareName,
			SoftwareVersion:     in.SoftwareVersion,
			Token:               in.Token,
			LastContact:         time.Now().UTC(),
			Active:              false,
		}
		err = validate.Struct(probe)
		if err != nil {
			log.Errorf("validation error: %v", err)
			return nil, status.Error(codes.Unknown, "validation error")
		}
		_, err := db.Model(probe).Insert()
		if err != nil {
			log.Errorf("sql error: %v", err)
			return nil, status.Error(codes.Unknown, "sql error")
		}
	} else {
		probe.IP = in.Ip
		probe.ASN = in.Asn
		probe.NetworkName = in.NetworkName
		probe.CountryCode = in.CountryCode
		probe.ResolverIP = in.ResolverIp
		probe.ResolverNetworkName = in.ResolverNetworkName
		probe.SoftwareName = in.SoftwareName
		probe.SoftwareVersion = in.SoftwareVersion
		probe.LastContact = time.Now().UTC()
		_, err := db.Model(probe).WherePK().Update()
		if err != nil {
			log.Errorf("sql error: %v", err)
			return nil, status.Error(codes.Unknown, "sql error")
		}
	}

	return &RegisterResponse{
		Id: probe.ID,
	}, nil
}

func (s *server) Watch(ctx context.Context, in *WatchRequest) (*WatchResponse, error) {
	timestamp := time.Now().UnixNano()
	probe, err := getProbeByToken(in.Token)
	if err != nil {
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}
	if !probe.Active {
		return nil, status.Error(codes.Unauthenticated, "inactive probe")
	}
	probe.LastContact = time.Now().UTC()
	_, err = db.Model(probe).Column("last_contact").WherePK().Update()
	if err != nil {
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}

	jobs := []model.Job{}
	err = db.Model(&jobs).
		Where("created_at > ?", time.Unix(0, in.After).UTC()).
		Order("created_at ASC").
		Select()
	if err != nil {
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}

	jobsPb := make([]*Job, len(jobs))
	for i, job := range jobs {
		createdAt := job.CreatedAt.UnixNano()
		jobsPb[i] = &Job{
			Id:        job.ID,
			Website:   job.Website,
			CreatedAt: createdAt,
		}
		if createdAt > timestamp {
			timestamp = createdAt
		}
	}

	return &WatchResponse{
		Time: timestamp,
		Jobs: jobsPb,
	}, nil
}

func (s *server) Submit(ctx context.Context, in *SubmitRequest) (*SubmitResponse, error) {
	probe, err := getProbeByToken(in.Token)
	if err != nil {
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}
	if !probe.Active {
		return nil, status.Error(codes.Unauthenticated, "inactive probe")
	}

	measurement := gjson.Parse(in.Measurement)
	result := &model.Result{
		JobID:          in.JobId,
		ProbeID:        probe.ID,
		DNSConsistency: measurement.Get("test_keys.dns_consistency").String(),
		Accessible:     measurement.Get("test_keys.accessible").Bool(),
		Blocking:       measurement.Get("test_keys.blocking").String(),
		RawData:        in.Measurement,
	}
	_, err = db.Model(result).Insert()
	if err != nil {
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}
	return &SubmitResponse{}, nil
}

func getProbeByToken(token string) (*model.Probe, error) {
	probe := &model.Probe{}
	err := db.Model(probe).
		Where("token = ?", token).
		Select()
	return probe, err
}
