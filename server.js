// central API Gateway server.js that connects frontend to gRPC services

import express from 'express';
import cors from 'cors';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// LOGIN gRPC client
const packageDef = protoLoader.loadSync("./login/proto/login.proto");
const grpcObj = grpc.loadPackageDefinition(packageDef);
const LoginClient = grpcObj.login.LoginService;

const client = new LoginClient(
  "localhost:5001", 
  grpc.credentials.createInsecure()
);

// login endpoint
app.post('/login', (req, res) => {
  const { email, password, accountType } = req.body;

  client.Login({ email, password, accountType }, (err, response) => {
    if (err) return res.status(500).json({ error: "gRPC error" });

    if (response.error)
      return res.status(401).json({ error: response.error });

    return res.json({
      token: response.token,
      user: {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        accountType: response.accountType
      }
    });
  });
});

// VIEW COURSES gRPC client
const coursesPackageDef = protoLoader.loadSync("./courses/proto/view_course.proto");
const coursesGrpcObj = grpc.loadPackageDefinition(coursesPackageDef);
const ViewCoursesClient = coursesGrpcObj.view_courses.ViewCoursesService;

const viewCoursesClient = new ViewCoursesClient(
  "localhost:5002",
  grpc.credentials.createInsecure()
);

// View courses endpoint
app.get('/view-courses', (req, res) => {
  viewCoursesClient.GetCourses({}, (err, response) => {
    if (err) return res.status(500).json({ error: 'gRPC error' });
    return res.json(response.courses); // only send array of courses
  });
});

// Start API Gateway
app.listen(4000, () => console.log("API Gateway running on port 4000"));