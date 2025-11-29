import { useEffect, useState } from "react";
import GradesTable from "./GradesTable.tsx";
import { columns, type StudentGrade } from "../lib/grades/gradesColumns";
import {
  generateStudents,
  enrollStudentsInSection,
} from "../lib/generateSampleData.ts";
import { useMemo } from "react";

export default function ViewGrades() {
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   async function fetchData() {
  //     setLoading(true);
  //     const response = await fetch('/api/grades');
  //     const result = await response.json();
  //     setData(result);
  //     setLoading(false);
  //   }
  //   fetchData();
  // }, []);

  const gradesData = useMemo(() => {
    // Generate students
    const students = generateStudents(50);

    // Create enrollments
    const enrollments = [
      ...enrollStudentsInSection(
        1,
        101,
        students.slice(0, 10).map((s) => s.id)
      ),
      ...enrollStudentsInSection(
        2,
        101,
        students.slice(10, 20).map((s) => s.id)
      ),
      ...enrollStudentsInSection(
        3,
        102,
        students.slice(20, 30).map((s) => s.id)
      ),
    ];
    // Join student data with enrollments
    const enhancedGrades: StudentGrade[] = enrollments.map((enrollment) => {
      const student = students.find((s) => s.id === enrollment.studentId);
      return {
        ...enrollment,
        studentName: student?.firstName + " " + student?.lastName,
        studentLastName: student?.lastName,
        studentEmail: student?.email,
      };
    });

    return enhancedGrades;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <>
      <span className="text-2xl m-2 font-bold">View Grades</span>
      <div className="container mx-auto">
        <GradesTable columns={columns} data={gradesData} />
      </div>
    </>
  );
}
