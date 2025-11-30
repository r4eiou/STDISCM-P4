import { useEffect, useState } from "react";
import GradesTable from "./GradesTable.tsx";
import { getColumnsForAccountType } from "../lib/grades/getColumnsForAccountType.tsx";
import { useMemo } from "react";
import { useAccount } from "@/AccountContext.tsx";
import { generateAllData } from "@/data/sampleData";
import { type StudentGrade } from "../lib/grades/getColumnsForAccountType.tsx";
import { toast } from "sonner";

export default function UploadGrades() {
  const [loading, setLoading] = useState(false);
  const { accountType, accountId } = useAccount();
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [gradesData, setGradesData] = useState<StudentGrade[]>([]);

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

  useEffect(() => {
    const { students, grades, courses } = generateAllData();

    const filteredGrades = (() => {
      if (accountType === "student" && accountId) {
        return grades.filter((grade) => grade.student_id === accountId);
      } else if (accountType === "faculty" && accountId) {
        return grades.filter((grade) => grade.faculty_id === accountId);
      }
      return grades;
    })();

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

    setGradesData(enhancedGrades);
  }, [accountType, accountId]);

  const handleSubmitGrade = (
    studentId: number,
    courseCode: string,
    grade: string
  ) => {
    setGradesData((prev) =>
      prev.map((item) =>
        item.student_id === studentId && item.course_code === courseCode
          ? { ...item, grade: parseFloat(grade) }
          : item
      )
    );

    // Clear previous selection
    setGrades((prev) => {
      const newGrades = { ...prev };
      delete newGrades[`${studentId}-${courseCode}`];
      return newGrades;
    });

    toast("Grade updated successfully", {
      description: `Grade ${grade} has been recorded for student ${studentId} in ${courseCode}.`,
      duration: 3000,
    });

    // API call here
  };

  const columns = useMemo(
    () =>
      getColumnsForAccountType(
        accountType,
        grades,
        setGrades,
        handleSubmitGrade
      ),
    [accountType, grades]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <>
      <span className="text-2xl m-2 font-bold">Encode Grades</span>
      <div className="container mx-auto">
        <GradesTable columns={columns} data={gradesData} variant="encode" />
      </div>
    </>
  );
}
