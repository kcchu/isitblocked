/**
 * @fileoverview gRPC-Web generated client stub for isitblocked.observer
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.isitblocked = {};
proto.isitblocked.observer = require('./observer_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.isitblocked.observer.ObserverServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.isitblocked.observer.ObserverServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.isitblocked.observer.CreateJobRequest,
 *   !proto.isitblocked.observer.CreateJobResponse>}
 */
const methodDescriptor_ObserverService_CreateJob = new grpc.web.MethodDescriptor(
  '/isitblocked.observer.ObserverService/CreateJob',
  grpc.web.MethodType.UNARY,
  proto.isitblocked.observer.CreateJobRequest,
  proto.isitblocked.observer.CreateJobResponse,
  /**
   * @param {!proto.isitblocked.observer.CreateJobRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.CreateJobResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.isitblocked.observer.CreateJobRequest,
 *   !proto.isitblocked.observer.CreateJobResponse>}
 */
const methodInfo_ObserverService_CreateJob = new grpc.web.AbstractClientBase.MethodInfo(
  proto.isitblocked.observer.CreateJobResponse,
  /**
   * @param {!proto.isitblocked.observer.CreateJobRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.CreateJobResponse.deserializeBinary
);


/**
 * @param {!proto.isitblocked.observer.CreateJobRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.isitblocked.observer.CreateJobResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.isitblocked.observer.CreateJobResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.isitblocked.observer.ObserverServiceClient.prototype.createJob =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/CreateJob',
      request,
      metadata || {},
      methodDescriptor_ObserverService_CreateJob,
      callback);
};


/**
 * @param {!proto.isitblocked.observer.CreateJobRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.isitblocked.observer.CreateJobResponse>}
 *     Promise that resolves to the response
 */
proto.isitblocked.observer.ObserverServicePromiseClient.prototype.createJob =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/CreateJob',
      request,
      metadata || {},
      methodDescriptor_ObserverService_CreateJob);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.isitblocked.observer.ListJobsRequest,
 *   !proto.isitblocked.observer.ListJobsResponse>}
 */
const methodDescriptor_ObserverService_ListJobs = new grpc.web.MethodDescriptor(
  '/isitblocked.observer.ObserverService/ListJobs',
  grpc.web.MethodType.UNARY,
  proto.isitblocked.observer.ListJobsRequest,
  proto.isitblocked.observer.ListJobsResponse,
  /**
   * @param {!proto.isitblocked.observer.ListJobsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.ListJobsResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.isitblocked.observer.ListJobsRequest,
 *   !proto.isitblocked.observer.ListJobsResponse>}
 */
const methodInfo_ObserverService_ListJobs = new grpc.web.AbstractClientBase.MethodInfo(
  proto.isitblocked.observer.ListJobsResponse,
  /**
   * @param {!proto.isitblocked.observer.ListJobsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.ListJobsResponse.deserializeBinary
);


/**
 * @param {!proto.isitblocked.observer.ListJobsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.isitblocked.observer.ListJobsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.isitblocked.observer.ListJobsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.isitblocked.observer.ObserverServiceClient.prototype.listJobs =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/ListJobs',
      request,
      metadata || {},
      methodDescriptor_ObserverService_ListJobs,
      callback);
};


/**
 * @param {!proto.isitblocked.observer.ListJobsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.isitblocked.observer.ListJobsResponse>}
 *     Promise that resolves to the response
 */
proto.isitblocked.observer.ObserverServicePromiseClient.prototype.listJobs =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/ListJobs',
      request,
      metadata || {},
      methodDescriptor_ObserverService_ListJobs);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.isitblocked.observer.GetJobRequest,
 *   !proto.isitblocked.observer.Job>}
 */
const methodDescriptor_ObserverService_GetJob = new grpc.web.MethodDescriptor(
  '/isitblocked.observer.ObserverService/GetJob',
  grpc.web.MethodType.UNARY,
  proto.isitblocked.observer.GetJobRequest,
  proto.isitblocked.observer.Job,
  /**
   * @param {!proto.isitblocked.observer.GetJobRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.Job.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.isitblocked.observer.GetJobRequest,
 *   !proto.isitblocked.observer.Job>}
 */
const methodInfo_ObserverService_GetJob = new grpc.web.AbstractClientBase.MethodInfo(
  proto.isitblocked.observer.Job,
  /**
   * @param {!proto.isitblocked.observer.GetJobRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.Job.deserializeBinary
);


/**
 * @param {!proto.isitblocked.observer.GetJobRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.isitblocked.observer.Job)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.isitblocked.observer.Job>|undefined}
 *     The XHR Node Readable Stream
 */
proto.isitblocked.observer.ObserverServiceClient.prototype.getJob =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/GetJob',
      request,
      metadata || {},
      methodDescriptor_ObserverService_GetJob,
      callback);
};


/**
 * @param {!proto.isitblocked.observer.GetJobRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.isitblocked.observer.Job>}
 *     Promise that resolves to the response
 */
proto.isitblocked.observer.ObserverServicePromiseClient.prototype.getJob =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/GetJob',
      request,
      metadata || {},
      methodDescriptor_ObserverService_GetJob);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.isitblocked.observer.ListProbesRequest,
 *   !proto.isitblocked.observer.ListProbesResponse>}
 */
const methodDescriptor_ObserverService_ListProbes = new grpc.web.MethodDescriptor(
  '/isitblocked.observer.ObserverService/ListProbes',
  grpc.web.MethodType.UNARY,
  proto.isitblocked.observer.ListProbesRequest,
  proto.isitblocked.observer.ListProbesResponse,
  /**
   * @param {!proto.isitblocked.observer.ListProbesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.ListProbesResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.isitblocked.observer.ListProbesRequest,
 *   !proto.isitblocked.observer.ListProbesResponse>}
 */
const methodInfo_ObserverService_ListProbes = new grpc.web.AbstractClientBase.MethodInfo(
  proto.isitblocked.observer.ListProbesResponse,
  /**
   * @param {!proto.isitblocked.observer.ListProbesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.isitblocked.observer.ListProbesResponse.deserializeBinary
);


/**
 * @param {!proto.isitblocked.observer.ListProbesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.isitblocked.observer.ListProbesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.isitblocked.observer.ListProbesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.isitblocked.observer.ObserverServiceClient.prototype.listProbes =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/ListProbes',
      request,
      metadata || {},
      methodDescriptor_ObserverService_ListProbes,
      callback);
};


/**
 * @param {!proto.isitblocked.observer.ListProbesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.isitblocked.observer.ListProbesResponse>}
 *     Promise that resolves to the response
 */
proto.isitblocked.observer.ObserverServicePromiseClient.prototype.listProbes =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/isitblocked.observer.ObserverService/ListProbes',
      request,
      metadata || {},
      methodDescriptor_ObserverService_ListProbes);
};


module.exports = proto.isitblocked.observer;

