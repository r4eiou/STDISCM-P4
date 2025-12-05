import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { getCourses } from './view_courses-service.js';

const packageDef = protoLoader.loadSync('proto/view_course.proto');
const grpcObj = grpc.loadPackageDefinition(packageDef);
const coursePackage = grpcObj.view_courses;

const server = new grpc.Server();
server.addService(coursePackage.ViewCoursesService.service, { GetCourses: getCourses });

server.bindAsync(
  'courses_server:5002',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('gRPC ViewCourses Service running on port 5002');
  }
);