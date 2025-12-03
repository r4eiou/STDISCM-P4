import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { getOfferings, enroll } from './enroll-service.js';

const packageDef = protoLoader.loadSync('proto/enroll.proto');
const grpcObj = grpc.loadPackageDefinition(packageDef);
const enrollPackage = grpcObj.enroll;

const server = new grpc.Server();
server.addService(enrollPackage.EnrollService.service, {
  GetOfferings: getOfferings,
  Enroll: enroll
});

server.bindAsync(
  '0.0.0.0:5003',
  grpc.ServerCredentials.createInsecure(),
  () => console.log('gRPC Enroll Service running on port 5003')
);
