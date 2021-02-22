import * as grpcWeb from 'grpc-web';

import * as observer_pb from './observer_pb';


export class ObserverServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createJob(
    request: observer_pb.CreateJobRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: observer_pb.CreateJobResponse) => void
  ): grpcWeb.ClientReadableStream<observer_pb.CreateJobResponse>;

  listJobs(
    request: observer_pb.ListJobsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: observer_pb.ListJobsResponse) => void
  ): grpcWeb.ClientReadableStream<observer_pb.ListJobsResponse>;

  getJob(
    request: observer_pb.GetJobRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: observer_pb.Job) => void
  ): grpcWeb.ClientReadableStream<observer_pb.Job>;

  listProbes(
    request: observer_pb.ListProbesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: observer_pb.ListProbesResponse) => void
  ): grpcWeb.ClientReadableStream<observer_pb.ListProbesResponse>;

}

export class ObserverServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createJob(
    request: observer_pb.CreateJobRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<observer_pb.CreateJobResponse>;

  listJobs(
    request: observer_pb.ListJobsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<observer_pb.ListJobsResponse>;

  getJob(
    request: observer_pb.GetJobRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<observer_pb.Job>;

  listProbes(
    request: observer_pb.ListProbesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<observer_pb.ListProbesResponse>;

}

