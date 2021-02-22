package probe

import (
	"context"
	"encoding/json"
	"os"
	"strconv"

	"github.com/apex/log"
	"github.com/ooni/probe-engine/model"
	"github.com/pkg/errors"

	"github.com/kcchu/isitblocked/internal/nexus"
)

// Submitter submits measurements
type Submitter interface {
	Submit(jobID string, meas *model.Measurement) error
}

// CliSubmitter prints measurements to stdout or a file
type CliSubmitter struct {
	Out string
}

// Submit submits a measurement.
func (s *CliSubmitter) Submit(jobID string, meas *model.Measurement) error {
	data, err := json.Marshal(meas)
	if err != nil {
		return errors.Wrap(err, "cannot serialize measurement")
	}
	var out *os.File
	if s.Out == "" || s.Out == "-" {
		out = os.Stdout
	} else {
		out, err = os.OpenFile(s.Out, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0755)
		if err != nil {
			return errors.Wrap(err, "cannot open output file")
		}
		log.Infof("writing result to %s", s.Out)
	}
	defer out.Close()
	_, err = out.Write(data)
	return errors.Wrap(err, "cannot write measurement output")
}

type nexusSubmitter struct {
	client nexus.NexusServiceClient
	token  string
}

func (s *nexusSubmitter) Submit(jobID string, meas *model.Measurement) error {
	log.Infof("submitting job #%v", jobID)
	data, err := json.Marshal(meas)
	if err != nil {
		return errors.Wrap(err, "cannot serialize measurement")
	}

	jobIDInt, err := strconv.ParseInt(jobID, 10, 64)
	if err != nil {
		return errors.Wrap(err, "invalid job ID")
	}

	req := &nexus.SubmitRequest{
		Token:       s.token,
		JobId:       jobIDInt,
		Measurement: string(data),
	}

	_, err = s.client.Submit(context.Background(), req)
	if err != nil {
		return errors.Wrap(err, "failed to submit measurement")
	}

	return nil
}
