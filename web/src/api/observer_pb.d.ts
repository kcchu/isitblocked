import * as jspb from 'google-protobuf'



export class CreateJobRequest extends jspb.Message {
  getInput(): string;
  setInput(value: string): CreateJobRequest;

  getForceCreate(): boolean;
  setForceCreate(value: boolean): CreateJobRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateJobRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateJobRequest): CreateJobRequest.AsObject;
  static serializeBinaryToWriter(message: CreateJobRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateJobRequest;
  static deserializeBinaryFromReader(message: CreateJobRequest, reader: jspb.BinaryReader): CreateJobRequest;
}

export namespace CreateJobRequest {
  export type AsObject = {
    input: string,
    forceCreate: boolean,
  }
}

export class CreateJobResponse extends jspb.Message {
  getCreated(): boolean;
  setCreated(value: boolean): CreateJobResponse;

  getJobId(): number;
  setJobId(value: number): CreateJobResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateJobResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateJobResponse): CreateJobResponse.AsObject;
  static serializeBinaryToWriter(message: CreateJobResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateJobResponse;
  static deserializeBinaryFromReader(message: CreateJobResponse, reader: jspb.BinaryReader): CreateJobResponse;
}

export namespace CreateJobResponse {
  export type AsObject = {
    created: boolean,
    jobId: number,
  }
}

export class ListJobsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListJobsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListJobsRequest): ListJobsRequest.AsObject;
  static serializeBinaryToWriter(message: ListJobsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListJobsRequest;
  static deserializeBinaryFromReader(message: ListJobsRequest, reader: jspb.BinaryReader): ListJobsRequest;
}

export namespace ListJobsRequest {
  export type AsObject = {
  }
}

export class ListJobsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListJobsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListJobsResponse): ListJobsResponse.AsObject;
  static serializeBinaryToWriter(message: ListJobsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListJobsResponse;
  static deserializeBinaryFromReader(message: ListJobsResponse, reader: jspb.BinaryReader): ListJobsResponse;
}

export namespace ListJobsResponse {
  export type AsObject = {
  }
}

export class GetJobRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetJobRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetJobRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetJobRequest): GetJobRequest.AsObject;
  static serializeBinaryToWriter(message: GetJobRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetJobRequest;
  static deserializeBinaryFromReader(message: GetJobRequest, reader: jspb.BinaryReader): GetJobRequest;
}

export namespace GetJobRequest {
  export type AsObject = {
    id: number,
  }
}

export class ListProbesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListProbesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListProbesRequest): ListProbesRequest.AsObject;
  static serializeBinaryToWriter(message: ListProbesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListProbesRequest;
  static deserializeBinaryFromReader(message: ListProbesRequest, reader: jspb.BinaryReader): ListProbesRequest;
}

export namespace ListProbesRequest {
  export type AsObject = {
  }
}

export class ListProbesResponse extends jspb.Message {
  getProbesList(): Array<Probe>;
  setProbesList(value: Array<Probe>): ListProbesResponse;
  clearProbesList(): ListProbesResponse;
  addProbes(value?: Probe, index?: number): Probe;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListProbesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListProbesResponse): ListProbesResponse.AsObject;
  static serializeBinaryToWriter(message: ListProbesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListProbesResponse;
  static deserializeBinaryFromReader(message: ListProbesResponse, reader: jspb.BinaryReader): ListProbesResponse;
}

export namespace ListProbesResponse {
  export type AsObject = {
    probesList: Array<Probe.AsObject>,
  }
}

export class Job extends jspb.Message {
  getId(): number;
  setId(value: number): Job;

  getWebsite(): string;
  setWebsite(value: string): Job;

  getDomain(): string;
  setDomain(value: string): Job;

  getHidden(): boolean;
  setHidden(value: boolean): Job;

  getResultsList(): Array<Result>;
  setResultsList(value: Array<Result>): Job;
  clearResultsList(): Job;
  addResults(value?: Result, index?: number): Result;

  getCreatedAt(): string;
  setCreatedAt(value: string): Job;

  getUpdatedAt(): string;
  setUpdatedAt(value: string): Job;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Job.AsObject;
  static toObject(includeInstance: boolean, msg: Job): Job.AsObject;
  static serializeBinaryToWriter(message: Job, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Job;
  static deserializeBinaryFromReader(message: Job, reader: jspb.BinaryReader): Job;
}

export namespace Job {
  export type AsObject = {
    id: number,
    website: string,
    domain: string,
    hidden: boolean,
    resultsList: Array<Result.AsObject>,
    createdAt: string,
    updatedAt: string,
  }
}

export class Result extends jspb.Message {
  getId(): number;
  setId(value: number): Result;

  getJobId(): number;
  setJobId(value: number): Result;

  getProbeId(): number;
  setProbeId(value: number): Result;

  getHidden(): boolean;
  setHidden(value: boolean): Result;

  getDnsConsistency(): string;
  setDnsConsistency(value: string): Result;

  getAccessible(): boolean;
  setAccessible(value: boolean): Result;

  getBlocking(): string;
  setBlocking(value: string): Result;

  getRawData(): string;
  setRawData(value: string): Result;

  getCreatedAt(): string;
  setCreatedAt(value: string): Result;

  getUpdatedAt(): string;
  setUpdatedAt(value: string): Result;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Result.AsObject;
  static toObject(includeInstance: boolean, msg: Result): Result.AsObject;
  static serializeBinaryToWriter(message: Result, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Result;
  static deserializeBinaryFromReader(message: Result, reader: jspb.BinaryReader): Result;
}

export namespace Result {
  export type AsObject = {
    id: number,
    jobId: number,
    probeId: number,
    hidden: boolean,
    dnsConsistency: string,
    accessible: boolean,
    blocking: string,
    rawData: string,
    createdAt: string,
    updatedAt: string,
  }
}

export class Probe extends jspb.Message {
  getId(): number;
  setId(value: number): Probe;

  getName(): string;
  setName(value: string): Probe;

  getAsn(): string;
  setAsn(value: string): Probe;

  getNetworkName(): string;
  setNetworkName(value: string): Probe;

  getCc(): string;
  setCc(value: string): Probe;

  getResolverIp(): string;
  setResolverIp(value: string): Probe;

  getResolverAsn(): string;
  setResolverAsn(value: string): Probe;

  getResolverNetworkName(): string;
  setResolverNetworkName(value: string): Probe;

  getSoftwareName(): string;
  setSoftwareName(value: string): Probe;

  getSoftwareVersion(): string;
  setSoftwareVersion(value: string): Probe;

  getLastContact(): string;
  setLastContact(value: string): Probe;

  getCreatedAt(): string;
  setCreatedAt(value: string): Probe;

  getUpdatedAt(): string;
  setUpdatedAt(value: string): Probe;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Probe.AsObject;
  static toObject(includeInstance: boolean, msg: Probe): Probe.AsObject;
  static serializeBinaryToWriter(message: Probe, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Probe;
  static deserializeBinaryFromReader(message: Probe, reader: jspb.BinaryReader): Probe;
}

export namespace Probe {
  export type AsObject = {
    id: number,
    name: string,
    asn: string,
    networkName: string,
    cc: string,
    resolverIp: string,
    resolverAsn: string,
    resolverNetworkName: string,
    softwareName: string,
    softwareVersion: string,
    lastContact: string,
    createdAt: string,
    updatedAt: string,
  }
}

