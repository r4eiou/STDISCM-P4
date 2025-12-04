import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { getGrade } from './view_grade-service.js';
import { getStudentsByFaculty, uploadGrade } from './encode_grade-service.js';

// Load view_grade proto
const viewGradePackageDef = protoLoader.loadSync('proto/view_grade.proto');
const viewGradeGrpcObj = grpc.loadPackageDefinition(viewGradePackageDef);
const viewGradePackage = viewGradeGrpcObj.view_grade;

// Load encode_grade proto
const encodeGradePackageDef = protoLoader.loadSync('proto/encode_grade.proto');
const encodeGradeGrpcObj = grpc.loadPackageDefinition(encodeGradePackageDef);
const encodeGradePackage = encodeGradeGrpcObj.encode_grade;

const server = new grpc.Server();

// Add both services
server.addService(viewGradePackage.ViewGradeService.service, { 
  GetGrade: getGrade 
});

server.addService(encodeGradePackage.EncodeGradeService.service, { 
  GetStudentsByFaculty: getStudentsByFaculty,
  UploadGrade: uploadGrade
});

server.bindAsync(
  '0.0.0.0:5004',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('gRPC Grade Services (View + Encode) running on port 5004');
  }
);