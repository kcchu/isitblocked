package model

import (
	"time"
)

// Probe represents a reigstered probe.
type Probe struct {
	ID                  int64
	Name                string `validate:"required"`
	IP                  string `validate:"required,ip"`
	ASN                 string `validate:"required"`
	NetworkName         string `validate:"required"`
	CountryCode         string `validate:"required"`
	ResolverIP          string `validate:"required,ip"`
	ResolverASN         string `validate:"required"`
	ResolverNetworkName string `validate:"required"`
	SoftwareName        string `validate:"required"`
	SoftwareVersion     string `validate:"required"`
	Token               string `validate:"required"`
	Active              bool   `pg:",use_zero"`
	LastContact         time.Time
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

// Job represents a connectivty test job.
type Job struct {
	ID        int64
	Website   string `validate:"required,url"`
	Domain    string `validate:"required,hostname|ip"`
	Hidden    bool
	CreatedAt time.Time
	UpdatedAt time.Time
}

// Result represents the result of a connectivity test performed by a probe.
type Result struct {
	ID             int64
	JobID          int64
	ProbeID        int64
	Hidden         bool
	DNSConsistency string
	Accessible     bool
	Blocking       string
	RawData        string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
