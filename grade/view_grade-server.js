import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { getGrade } from './view_grade-service.js';

const packageDef = protoLoader.loadSync('proto/view_grade.proto');
const grpcObj = grpc.loadPackageDefinition(packageDef);
const coursePackage = grpcObj.view_grade;

const server = new grpc.Server();
server.addService(coursePackage.ViewGradeService.service, { GetGrade: getGrade });

server.bindAsync(
  '0.0.0.0:5004',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('gRPC ViewCourses Service running on port 5004');
  }
);