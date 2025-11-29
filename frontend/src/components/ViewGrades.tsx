import { useEffect, useState } from "react";
import GradesTable from "./GradesTable.tsx";
import { getColumnsForAccountType } from "../lib/grades/getColumnsForAccountType.tsx";
import { useMemo } from "react";
import { useAccount } from "@/AccountContext.tsx";
import { generateAllData } from "@/data/sampleData";
import { type StudentGrade } from "../lib/grades/getColumnsForAccountType.tsx";

export default function ViewGrades() {
  const [loading, setLoading] = useState(false);
  const { accountType, accountId } = useAccount();

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
    // Generate all sample data
    const { students, grades, courses } = generateAllData();

    // Filter grades based on account type
    const filteredGrades = (() => {
      if (accountType === "student" && accountId) {
        // Students see only their own grades
        const filteredStudentGrades = grades.filter(
          (grade) => grade.student_id === accountId
        );
        return filteredStudentGrades;
      } else if (accountType === "faculty" && accountId) {
        // Faculty see all grades for their courses
        return grades.filter((grade) => grade.faculty_id === accountId);
      }
      return grades;
    })();

    // Enhance grades with student and course info
    const enhancedGrades: StudentGrade[] = filteredGrades.map((grade) => {
      const student = students.find((s) => s.student_id === grade.student_id);
      const course = courses.find((c) => c.course_code === grade.course_code);

      return {
        ...grade,
        studentName: `${student?.firstname} ${student?.lastname}`,
        studentLastName: student?.lastname || "",
        studentEmail: student?.email || "",
        courseTitle: course?.title || "",
      };
    });

    return enhancedGrades;
  }, [accountType, accountId]);

  const columns = getColumnsForAccountType(accountType || "student");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <>
      <span className="text-2xl m-2 font-bold">View Grades</span>
      <div className="container mx-auto">
        <GradesTable columns={columns} data={gradesData} variant="view" />
      </div>
    </>
  );
}
