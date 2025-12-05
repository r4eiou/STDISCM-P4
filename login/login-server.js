import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { login } from './login-service.js';

const packageDef = protoLoader.loadSync("proto/login.proto");
const grpcObj = grpc.loadPackageDefinition(packageDef);
const loginPackage = grpcObj.login;

const server = new grpc.Server();
server.addService(loginPackage.LoginService.service, { Login: login });
server.bindAsync(
  "login_server:5001",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC Login Service running on port 5001");
  }
);