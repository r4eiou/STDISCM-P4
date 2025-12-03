import { useEffect, useState } from "react";
import GradesTable from "./GradesTable.tsx";
import { getColumnsForAccountType } from "../lib/grades/getColumnsForAccountType.tsx";
import { useAccount } from "@/AccountContext.tsx";
import { type Grade } from "../lib/grades/getColumnsForAccountType.tsx";

export default function ViewGrades() {
  const [gradesData, setGradesData] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accountType, accountId } = useAccount();

  useEffect(() => {
    let isMounted = true;

    const fetchGrades = async () => {
      setLoading(true);
      try {
        // Call your backend endpoint
        const res = await fetch(`http://localhost:4000/view-grades/${accountId}`);
        if (!res.ok) throw new Error("Service unavailable");
        const data: Grade[] = await res.json();

        if (isMounted) {
          setGradesData(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        if (isMounted) {
          setError("Service unavailable. Retrying...");
          setLoading(false);
        }
        // Retry after 5 seconds
        setTimeout(fetchGrades, 5000);
      }
    };

    fetchGrades();

    return () => {
      isMounted = false;
    };
  }, [accountId, accountType]);

  const handleSubmitGrade = (
    studentId: number,
    courseCode: string,
    grade: string
  ) => {
    console.log("Submitting grade:", { studentId, courseCode, grade });
    // Handle grade submission here
  };

  const columns = getColumnsForAccountType(accountType, {}, () => {}, handleSubmitGrade);

  if (loading) return <div className="text-gray-600 m-2">Loading courses...</div>;
  if (error) return <div className="text-red-600 m-2">{error}</div>;

  return (
    <>
      <span className="text-2xl m-2 font-bold">View Grades</span>
      <div className="container mx-auto">
        <GradesTable columns={columns} data={gradesData} variant="view" />
      </div>
    </>
  );
}