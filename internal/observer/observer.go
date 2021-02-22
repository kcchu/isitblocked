//go:generate protoc -I../../api --gogofast_out=plugins=grpc,paths=source_relative:. observer.proto

package observer

import (
	"context"
	"net"
	"net/url"
	"strings"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/go-playground/validator/v10"
	"github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_logrus "github.com/grpc-ecosystem/go-grpc-middleware/logging/logrus"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/kcchu/isitblocked/internal/model"
)

var db *pg.DB
var validate *validator.Validate
var logger = log.WithFields(log.Fields{"app": "observer"})

func initConfig() {
	viper.SetDefault("observer_listen", "localhost:9443")

	viper.BindEnv("database_url")
	viper.AutomaticEnv()
}

// Start starts a observer service.
func Start() {
	initConfig()

	db = model.InitDB()
	validate = validator.New()

	listenString := viper.GetString("observer_listen")
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
	RegisterObserverServiceServer(grpcServer, &server{})
	log.Infof("observer is listening on %v", listenString)
	grpcServer.Serve(lis)
}

type server struct {
}

func (s *server) CreateJob(ctx context.Context, in *CreateJobRequest) (*CreateJobResponse, error) {
	if in.Input == "" {
		return nil, status.Error(codes.InvalidArgument, "input is required")
	}
	input, err := url.Parse(in.Input)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "input is not a valid URL")
	}
	var domain string
	if strings.Contains(input.Host, ":") {
		domain, _, err = net.SplitHostPort(input.Host)
		if err != nil {
			return nil, status.Error(codes.InvalidArgument, "input is not a valid URL")
		}
	} else {
		domain = input.Host
	}

	shouldCreate := in.ForceCreate
	job := &model.Job{}
	err = db.Model(job).
		Where("website = ?", input.String()).
		Where("created_at > NOW() - INTERVAL '1 DAY'").
		Order("created_at DESC").
		Limit(1).
		Select()
	if err != nil {
		if err == pg.ErrNoRows {
			shouldCreate = true
		} else {
			log.Errorf("sql error: %v", err)
			return nil, status.Error(codes.Unknown, "sql error")
		}
	}

	if shouldCreate {
		job = &model.Job{
			Website: input.String(),
			Domain:  domain,
		}
		err = validate.Struct(job)
		if err != nil {
			log.Errorf("validation error: %v", err)
			return nil, status.Error(codes.Unknown, "validation error")
		}

		_, err = db.Model(job).Insert()
		if err != nil {
			return nil, status.Error(codes.Unknown, "error adding job")
		}
	}

	return &CreateJobResponse{
		JobId:   job.ID,
		Created: shouldCreate,
	}, nil
}

func (s *server) ListJobs(ctx context.Context, in *ListJobsRequest) (*ListJobsResponse, error) {
	return &ListJobsResponse{}, nil
}

func (s *server) GetJob(ctx context.Context, in *GetJobRequest) (*Job, error) {
	job := model.Job{
		ID: in.Id,
	}
	err := db.Model(&job).WherePK().Select()
	if err != nil {
		if err == pg.ErrNoRows {
			return nil, status.Error(codes.NotFound, "object not found")
		}
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}

	results := []model.Result{}
	err = db.Model(&results).Where("job_id = ?", job.ID).Where("hidden = false").Select()
	if err != nil {
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}

	resultsPb := make([]*Result, len(results))
	for i, result := range results {
		resultsPb[i] = &Result{
			Id:             result.ID,
			JobId:          result.JobID,
			ProbeId:        result.ProbeID,
			DnsConsistency: result.DNSConsistency,
			Accessible:     result.Accessible,
			Hidden:         result.Hidden,
			Blocking:       result.Blocking,
			RawData:        result.RawData,
			UpdatedAt:      result.UpdatedAt.Format(time.RFC3339),
			CreatedAt:      result.CreatedAt.Format(time.RFC3339),
		}
	}

	resp := &Job{
		Id:        job.ID,
		Website:   job.Website,
		Domain:    job.Domain,
		Hidden:    job.Hidden,
		Results:   resultsPb,
		UpdatedAt: job.UpdatedAt.Format(time.RFC3339),
		CreatedAt: job.CreatedAt.Format(time.RFC3339),
	}

	return resp, nil
}

func (s *server) ListProbes(ctx context.Context, in *ListProbesRequest) (*ListProbesResponse, error) {
	probes := []model.Probe{}
	err := db.Model(&probes).Where("active = true").Select()
	if err != nil {
		log.Errorf("sql error: %v", err)
		return nil, status.Error(codes.Unknown, "sql error")
	}

	probesPb := make([]*Probe, len(probes))
	for i, probe := range probes {
		probesPb[i] = &Probe{
			Id:                  probe.ID,
			Asn:                 probe.ASN,
			NetworkName:         probe.NetworkName,
			Cc:                  probe.CountryCode,
			ResolverIp:          probe.ResolverIP,
			ResolverNetworkName: probe.ResolverNetworkName,
			ResolverAsn:         probe.ResolverASN,
			SoftwareName:        probe.SoftwareName,
			SoftwareVersion:     probe.SoftwareVersion,
			LastContact:         probe.LastContact.Format(time.RFC3339),
			UpdatedAt:           probe.UpdatedAt.Format(time.RFC3339),
			CreatedAt:           probe.CreatedAt.Format(time.RFC3339),
		}
	}

	resp := &ListProbesResponse{
		Probes: probesPb,
	}
	return resp, nil
}
