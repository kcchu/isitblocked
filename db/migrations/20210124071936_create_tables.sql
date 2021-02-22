-- migrate:up

CREATE TABLE probes (
    id SERIAL,
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    asn TEXT NOT NULL,
    network_name TEXT NOT NULL,
    country_code CHAR(2) NOT NULL,
    resolver_ip TEXT NOT NULL,
    resolver_asn TEXT NOT NULL,
    resolver_network_name TEXT NOT NULL,
    software_name TEXT NOT NULL,
    software_version TEXT NOT NULL,
    token CHAR(36) NULL NULL,
    active boolean NOT NULL,
    last_contact timestamp NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    UNIQUE (token)
);
SELECT manage_updated_at('probes');

CREATE TABLE jobs (
    id SERIAL,
    website TEXT NOT NULL,
    domain TEXT NOT NULL,
    hidden boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);
CREATE INDEX jobs_domain_idx ON jobs (domain);
SELECT manage_updated_at('jobs');

CREATE TABLE results (
    id SERIAL,
    job_id integer NOT NULL,
    probe_id integer NOT NULL,
    hidden boolean NOT NULL DEFAULT false,
    dns_consistency text,
    accessible boolean,
    blocking text,
    raw_data text,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);
SELECT manage_updated_at('results');

-- migrate:down

DROP TABLE IF EXISTS probes;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS results;
