package probe

import (
	"context"
	"io/ioutil"
	"os"
	"path"
	"strconv"
	"time"

	"github.com/apex/log"
	"github.com/spf13/viper"
	"google.golang.org/grpc"

	"github.com/kcchu/isitblocked/internal/nexus"
	"github.com/kcchu/isitblocked/internal/utils"
)

func initConfig() {
	viper.SetDefault("nexus_address", "nexus:9001")
	viper.SetDefault("num_workers", 5)
	viper.SetDefault("backlog_size", 10)
	viper.SetDefault("watch_interval", "5s")
	viper.AutomaticEnv()
}

var clientToken string
var probe *Probe
var client nexus.NexusServiceClient
var jobQueue chan *nexus.Job

// Start starts a observer service.
func Start() {
	initConfig()
	initCredentials()
	startWorkers()

	var opts []grpc.DialOption
	// TODO: implement mTLS
	opts = append(opts, grpc.WithInsecure())

	nexusAddress := viper.GetString("nexus_address")
	conn, err := grpc.Dial(nexusAddress, opts...)
	if err != nil {
		log.Fatalf("fail to dial nexus: %v", err)
	}
	defer conn.Close()
	client = nexus.NewNexusServiceClient(conn)

	var config Config
	err = viper.Unmarshal(&config)
	if err != nil {
		log.Fatalf("fail to load configuration: %v", err)
	}
	config.Submitter = &nexusSubmitter{
		client: client,
		token:  clientToken,
	}

	probe, err = New(config)
	if err != nil {
		log.Fatalf("fail to initialize probe: %v", err)
	}

	register()
	runLoop()
}

func initCredentials() {
	homeDir := gethomedir("")
	dataDir := path.Join(homeDir, "."+softwareName)
	keyFile := path.Join(dataDir, "client.key")
	err := os.MkdirAll(dataDir, 0700)
	if err != nil {
		log.Fatalf("cannot create assets directory: %v", err)
	}
	keyData, err := ioutil.ReadFile(keyFile)
	if os.IsNotExist(err) {
		clientToken = utils.RandomToken()
		log.Infof("client token: %v", clientToken)
		err = ioutil.WriteFile(keyFile, []byte(clientToken), 600)
		if err != nil {
			log.Fatalf("cannot write new token: %v", err)
		}
	} else {
		clientToken = string(keyData)
	}
}

func startWorkers() {
	numWorkers := viper.GetInt("num_workers")
	backlogSize := viper.GetInt("backlog_size")
	log.Infof("Starting %v workers", numWorkers)
	jobQueue = make(chan *nexus.Job, backlogSize)
	for i := 0; i < numWorkers; i++ {
		go worker()
	}
}

func register() {
	sess := probe.Sess
	req := &nexus.RegisterRequest{
		Token:               clientToken,
		Ip:                  sess.ProbeIP(),
		Asn:                 sess.ProbeASNString(),
		NetworkName:         sess.ProbeNetworkName(),
		CountryCode:         sess.ProbeCC(),
		ResolverIp:          sess.ResolverIP(),
		ResolverAsn:         sess.ResolverASNString(),
		ResolverNetworkName: sess.ResolverNetworkName(),
		SoftwareName:        sess.SoftwareName(),
		SoftwareVersion:     sess.SoftwareVersion(),
	}

	resp, err := client.Register(context.Background(), req)
	if err != nil {
		log.Fatalf("failed to register probe: %v", err)
	}
	log.Infof("registered #%v", resp.Id)
}

func runLoop() {
	now := time.Now().UnixNano()
	for {
		req := &nexus.WatchRequest{
			Token: clientToken,
			After: now,
		}
		resp, err := client.Watch(context.Background(), req)
		if err != nil {
			log.Errorf("failed to receive jobs: %v", err)
		} else {
			dispatch(resp.Jobs)
			now = resp.Time
		}

		time.Sleep(viper.GetDuration("watch_interval"))
	}
}

func dispatch(jobs []*nexus.Job) {
	for _, job := range jobs {
		jobQueue <- job
	}
}

// queueJob puts job into channel. If channel buffer is full, return false.
func queueJob(job int, jobChan chan<- int) bool {
	select {
	case jobChan <- job:
		return true
	default:
		return false
	}
}

func worker() {
	for job := range jobQueue {
		log.Infof("received job #%v (%v)", job.Id, job.Website)
		probe.Measure(strconv.FormatInt(job.Id, 10), "web_connectivity", []string{job.Website})
	}
}
