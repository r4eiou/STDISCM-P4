import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { getStudentsByFaculty, uploadGrade } from './encode_grade-service.js';

// Load encode_grade proto
const encodeGradePackageDef = protoLoader.loadSync('proto/encode_grade.proto');
const encodeGradeGrpcObj = grpc.loadPackageDefinition(encodeGradePackageDef);
const encodeGradePackage = encodeGradeGrpcObj.encode_grade;

const server = new grpc.Server();

server.addService(encodeGradePackage.EncodeGradeService.service, { 
  GetStudentsByFaculty: getStudentsByFaculty,
  UploadGrade: uploadGrade
});

server.bindAsync(
  '0.0.0.0:5005',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('gRPC Grade Faculty Service (Encode) running on port 5004');
  }
);