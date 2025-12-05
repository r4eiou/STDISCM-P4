// central API Gateway server.js that connects frontend to gRPC services

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://172.20.0.10:5173"],
  credentials: true
}));
app.use(express.json());

// LOGIN gRPC client
const packageDef = protoLoader.loadSync("./proto/login.proto");
const grpcObj = grpc.loadPackageDefinition(packageDef);
const LoginClient = grpcObj.login.LoginService;

const client = new LoginClient(
  "172.20.0.2:5001", 
  grpc.credentials.createInsecure()
);

// login endpoint
app.post('/login', (req, res) => {
  const { email, password, accountType } = req.body;

  client.Login({ email, password, accountType }, (err, response) => {
    if (err) {
      console.log("Login server down!");
      return res.status(500).json({ error: 'Login server down' });
    } else {
      console.log("Login server up!");
    }

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
const coursesPackageDef = protoLoader.loadSync("./proto/view_course.proto");
const coursesGrpcObj = grpc.loadPackageDefinition(coursesPackageDef);
const ViewCoursesClient = coursesGrpcObj.view_courses.ViewCoursesService;

const viewCoursesClient = new ViewCoursesClient(
  "172.20.0.3:5002", 
  grpc.credentials.createInsecure()
);

// View courses endpoint
app.get('/view-courses', (req, res) => {
  viewCoursesClient.GetCourses({}, (err, response) => {
    if (err) {
      console.log("View Courses server down!");
      return res.status(500).json({ error: 'View Courses server down!' });
    } 
    return res.json(response.courses); // only send array of courses
  });
});

// ENROLL gRPC client
const enrollPackageDef = protoLoader.loadSync('./proto/enroll.proto');
const enrollGrpcObj = grpc.loadPackageDefinition(enrollPackageDef);
const EnrollClient = enrollGrpcObj.enroll.EnrollService;

const enrollClient = new EnrollClient(
  "172.20.0.4:5003", 
  grpc.credentials.createInsecure()
);

// Get offerings endpoint
app.get('/enroll-courses', (req, res) => {
  enrollClient.GetOfferings({}, (err, response) => {
    if (err) {
      console.log("Enroll courses server down!", err);
      return res.status(500).json({ error: 'Enroll courses server down' });
    } 
    return res.json(response.offerings);
  });
});

// Get current student enrollments
app.get('/student-enrollments/:accountId', async (req, res) => {
  const { accountId } = req.params;
  // console.log('Fetching enrollments for accountId:', accountId);

  try {
    const { data: student, error: studentError } = await supabase
      .from('student')
      .select('student_id')
      .eq('account_id', accountId)
      .single();

    if (studentError || !student) {
      console.error('Student lookup error:', studentError);
      return res.status(404).json({ error: 'Student not found' });
    }

    // console.log('Mapped student_id:', student.student_id);

    const { data, error } = await supabase
      .from('enrollments')
      .select('course_code, section')
      .eq('student_id', student.student_id);

    if (error) {
      console.error('Enrollments fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch enrollments' });
    }

    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enroll endpoint
app.post('/enroll', (req, res) => {
  const { studentId, courseCode, section } = req.body;

  enrollClient.Enroll({ studentId, courseCode, section }, (err, response) => {
    if (err) return res.status(500).json({ error: 'gRPC error' });
    return res.json(response);
  });
});

// VIEW GRADES gRPC client
const gradesPackageDef = protoLoader.loadSync("./proto/view_grade.proto");
const gradesGrpcObj = grpc.loadPackageDefinition(gradesPackageDef);
const ViewGradesClient = gradesGrpcObj.view_grade.ViewGradeService;

const viewGradesClient = new ViewGradesClient(
  "172.20.0.5:5004",
  grpc.credentials.createInsecure()
);

// View grades endpoint
app.get('/view-grades/:accountId', (req, res) => {
  const { accountId } = req.params;

  viewGradesClient.GetGrade({ accountId }, (err, response) => {
    if (err) {
      console.log("View Grades server down!");
      return res.status(500).json({ error: 'View Grades server down!' });
    }
    res.json(response.grades);
  });
});


// ENCODE GRADES gRPC client
const encodeGradePackageDef = protoLoader.loadSync("./proto/encode_grade.proto");
const encodeGradeGrpcObj = grpc.loadPackageDefinition(encodeGradePackageDef);
const EncodeGradeClient = encodeGradeGrpcObj.encode_grade.EncodeGradeService;

const encodeGradeClient = new EncodeGradeClient(
  "172.20.0.6:5005",
  grpc.credentials.createInsecure()
);

// Get students for faculty endpoint
app.get('/encode-grades/:facultyId', (req, res) => {
  const { facultyId } = req.params;
  
  console.log('Fetching encode grades for facultyId:', facultyId);

  encodeGradeClient.GetStudentsByFaculty({ facultyId }, (err, response) => {
    if (err) {
      console.error("Encode Grades gRPC Error:", err);
      return res.status(500).json({ error: 'Encode Grades server down!' });
    }
    
    console.log('Encode grades response:', response);
    res.json(response.students);
  });
});

// Upload grade endpoint
app.post('/upload-grade', (req, res) => {
  const { studentId, courseCode, section, grade, facultyId } = req.body;

  encodeGradeClient.UploadGrade(
    { studentId, courseCode, section, grade, facultyId },
    (err, response) => {
      if (err) {
        console.log("Upload grade failed!");
        return res.status(500).json({ error: 'Failed to upload grade' });
      }
      res.json(response);
    }
  );
});


// ADD other feature gRPC clients and endpoints here

// Start API Gateway
app.listen(4000, "0.0.0.0", () => 
  console.log("API Gateway running on 172.20.0.8:4000")
);