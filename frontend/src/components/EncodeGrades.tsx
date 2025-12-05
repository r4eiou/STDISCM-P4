import { useEffect, useState } from "react";
import GradesTable from "./GradesTable.tsx";
import { getColumnsForAccountType } from "../lib/grades/getColumnsForAccountType.tsx";
import { useMemo } from "react";
import { useAccount } from "@/AccountContext.tsx";
import { type StudentGrade } from "../lib/grades/getColumnsForAccountType.tsx";
// import { toast } from "sonner";
import { toast } from "react-toastify";
import { fetchWithTimeout } from "@/lib/utils.ts";

export default function EncodeGrades() {
  const [loading, setLoading] = useState(false);
  const { accountType, accountId } = useAccount();
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [gradesData, setGradesData] = useState<StudentGrade[]>([]);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!accountId || accountType !== 'faculty') return;

    let isMounted = true;

    const fetchGradesData = async () => {
      try {
        const response = await fetchWithTimeout(`${BASE_URL}/encode-grades/${accountId}`);

        if (!response.ok) {
          throw new Error("Encode Grades service is currently unavailable");
        }

        const result = await response.json();

        const enhancedGrades: StudentGrade[] = result.map((item: any) => ({
          student_id: item.studentId,
          studentName: item.studentName,
          studentEmail: item.studentEmail,
          courseCode: item.courseCode,
          courseTitle: item.courseTitle,
          section: item.section,
          grade: item.currentGrade,
          status: item.status
        }));

        if (isMounted) {
          setGradesData(enhancedGrades);
          setError(null);
          toast.success("Grades loaded successfully");
          setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching grades:", error);
        if (isMounted) {
          setError("Service unavailable. Retrying...");
          setLoading(false);
        }
        // Retry after 5 seconds
        setTimeout(fetchGradesData, 5000);
      }
    };

    fetchGradesData();

    return () => {
      isMounted = false; // cleanup flag
    };
  }, [accountId, accountType, BASE_URL]);

  const handleSubmitGrade = async (
    studentId: number,
    courseCode: string,
    grade: string
  ) => {
    console.log('=== handleSubmitGrade called ===');
    console.log('studentId:', studentId);
    console.log('courseCode:', courseCode);
    console.log('grade:', grade);
    console.log('accountId:', accountId);
    console.log('All grades data:', gradesData); // ADD THIS to see the structure

    try {
      // Find the section for this enrollment
      // CHANGED: Search using both courseCode and course_code
      const enrollment = gradesData.find(
        item => item.student_id === studentId && 
              (item.courseCode === courseCode)
      );

      console.log('Enrollment found:', enrollment);

      if (!enrollment) {
        toast.error("Enrollment not found");
        return;
      }

      const payload = {
        studentId,
        courseCode,
        section: enrollment.section,
        grade: parseFloat(grade),
        facultyId: accountId
      };

      console.log('Sending payload:', payload);

      const response = await fetch(`${BASE_URL}/upload-grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok && result.success) {
        // Use 'completed' for graded courses
        let newStatus = 'ongoing';
        const gradeNum = parseFloat(grade);
        if (gradeNum >= 1.0 && gradeNum <= 5.0) {
          newStatus = 'completed';
        }

        // Update local state - check both courseCode and course_code
        setGradesData((prev) =>
          prev.map((item) =>
            item.student_id === studentId && 
            (item.courseCode === courseCode) && 
            item.section === enrollment.section
              ? { 
                  ...item, 
                  grade: parseFloat(grade),
                  status: newStatus
                }
              : item
          )
        );

        // Clear selection
        setGrades((prev) => {
          const newGrades = { ...prev };
          delete newGrades[`${studentId}-${courseCode}-${enrollment.section}`];
          return newGrades;
        });

        // toast.success("Grade uploaded successfully", {
        //   description: `Grade ${grade} recorded. Status: ${newStatus}`,
        // });
        toast.success(`Grade ${grade} recorded. Status: ${newStatus}`);
      } else {
        console.error('Upload failed:', result);
        toast.error(result.message || "Failed to upload grade");
      }
    } catch (error) {
      console.error('Error uploading grade:', error);
      toast.error("Encode Grades service is unavailable");
    }
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

  // display error message
  if (loading) {
    return (
      <div className="text-gray-600 m-2">Loading grades data...</div>
    );
  }
  if (error) return <div className="text-red-600 m-2">{error}</div>;

  if (gradesData.length === 0 && !loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <span className="text-2xl font-bold">Encode Grades</span>
        <span className="text-muted-foreground">No students enrolled in your courses yet.</span>
      </div>
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