package probe

import (
	"context"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"runtime"

	"github.com/apex/log"
	engine "github.com/ooni/probe-engine"
	"github.com/ooni/probe-engine/model"
	"github.com/ooni/probe-engine/netx/selfcensor"
	"github.com/pkg/errors"
)

// Config contains the options to create a Probe.
type Config struct {
	Annotations      map[string]string
	ExtraOptions     []string
	HomeDir          string
	ProbeServicesURL string
	Proxy            string
	ReportFile       string
	SelfCensorSpec   string
	TorArgs          []string
	TorBinary        string
	Tunnel           string
	Submitter        Submitter
}

const (
	softwareName    = "isitblocked"
	softwareVersion = "0.1.0"
)

// Probe represents a process that receives and executes censorship measurement jobs from Nexus.
type Probe struct {
	Sess      *engine.Session
	Submitter Submitter
	Config    Config
}

// New creates a new Probe with the given config.
func New(config Config) (*Probe, error) {
	err := selfcensor.MaybeEnable(config.SelfCensorSpec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot parse SelfCensorSpec")
	}

	homeDir := gethomedir(config.HomeDir)
	if homeDir == "" {
		return nil, errors.New("home directory is undefined")
	}
	dataDir := path.Join(homeDir, "."+softwareName)
	assetsDir := path.Join(dataDir, "assets")
	err = os.MkdirAll(assetsDir, 0700)
	if err != nil {
		return nil, errors.Wrap(err, "cannot create assets directory")
	}
	log.Debugf("isitblocked state directory: %s", dataDir)
	log.Info("isitblocked home directory: $HOME/.isitblocked")

	var proxyURL *url.URL
	if config.Proxy != "" {
		proxyURL, err = url.Parse(config.Proxy)
		if err != nil {
			return nil, errors.Wrap(err, "cannot parse URL")
		}
	}

	kvstore2dir := filepath.Join(dataDir, "kvstore2")
	kvstore, err := engine.NewFileSystemKVStore(kvstore2dir)
	if err != nil {
		return nil, errors.Wrap(err, "cannot create kvstore2 directory")
	}

	sessConfig := engine.SessionConfig{
		AssetsDir:       assetsDir,
		KVStore:         kvstore,
		Logger:          log.Log,
		ProxyURL:        proxyURL,
		SoftwareName:    softwareName,
		SoftwareVersion: softwareVersion,
		TorArgs:         config.TorArgs,
		TorBinary:       config.TorBinary,
	}
	if config.ProbeServicesURL != "" {
		sessConfig.AvailableProbeServices = []model.Service{{
			Address: config.ProbeServicesURL,
			Type:    "https",
		}}
	}

	sess, err := engine.NewSession(sessConfig)
	if err != nil {
		return nil, errors.Wrap(err, "cannot create measurement session")
	}

	log.Debugf("isitblocked temporary directory: %s", sess.TempDir())

	err = sess.MaybeStartTunnel(context.Background(), config.Tunnel)
	if err != nil {
		return nil, errors.Wrap(err, "cannot start session tunnel")
	}

	log.Info("Looking up OONI backends; please be patient...")
	err = sess.MaybeLookupBackends()
	if err != nil {
		return nil, errors.Wrap(err, "cannot lookup OONI backends")
	}
	log.Info("Looking up your location; please be patient...")
	err = sess.MaybeLookupLocation()
	if err != nil {
		return nil, errors.Wrap(err, "cannot lookup your location")
	}
	log.Debugf("- IP: %s", sess.ProbeIP())
	log.Infof("- country: %s", sess.ProbeCC())
	log.Infof("- network: %s (%s)", sess.ProbeNetworkName(), sess.ProbeASNString())
	log.Infof("- resolver's IP: %s", sess.ResolverIP())
	log.Infof("- resolver's network: %s (%s)", sess.ResolverNetworkName(),
		sess.ResolverASNString())

	var submitter Submitter
	if config.Submitter != nil {
		submitter = config.Submitter
	} else {
		submitter = &CliSubmitter{}
	}

	return &Probe{
		Config:    config,
		Sess:      sess,
		Submitter: submitter,
	}, nil
}

// Close closes the Probe and clean up resources.
func (p *Probe) Close() {
	p.Sess.Close()
	log.Infof("whole session: recv %v KiB, sent %v KiB",
		p.Sess.KibiBytesReceived(),
		p.Sess.KibiBytesSent(),
	)
}

// Measure executes an experiment with specified experiment name and inputs.
func (p *Probe) Measure(jobID, experimentName string, inputStrings []string) error {
	ctx := context.Background()

	builder, err := p.Sess.NewExperimentBuilder(experimentName)
	if err != nil {
		return errors.Wrap(err, "cannot create experiment builder")
	}

	inputLoader := engine.NewInputLoader(engine.InputLoaderConfig{
		StaticInputs: inputStrings,
		InputPolicy:  builder.InputPolicy(),
		Session:      p.Sess,
	})
	inputs, err := inputLoader.Load(ctx)
	if err != nil {
		return errors.Wrap(err, "cannot load inputs")
	}

	experiment := builder.NewExperiment()
	defer func() {
		log.Infof("experiment: recv %v KiB, sent %v KiB",
			experiment.KibiBytesReceived(),
			experiment.KibiBytesSent(),
		)
	}()

	for _, url := range inputs {
		input := url.URL
		meas, err := experiment.MeasureWithContext(ctx, input)
		if err != nil {
			return err
		}
		meas.AddAnnotations(p.Config.Annotations)
		meas.AddAnnotation("job_id", jobID)
		meas.Options = p.Config.ExtraOptions
		err = p.Submitter.Submit(jobID, meas)
		if err != nil {
			return err
		}
	}
	return nil
}

// See https://gist.github.com/miguelmota/f30a04a6d64bd52d7ab59ea8d95e54da
func gethomedir(optionsHome string) string {
	if optionsHome != "" {
		return optionsHome
	}
	if runtime.GOOS == "windows" {
		home := os.Getenv("HOMEDRIVE") + os.Getenv("HOMEPATH")
		if home == "" {
			home = os.Getenv("USERPROFILE")
		}
		return home
	}
	if runtime.GOOS == "linux" {
		home := os.Getenv("XDG_CONFIG_HOME")
		if home != "" {
			return home
		}
		// fallthrough
	}
	return os.Getenv("HOME")
}
