import { useEffect, useState } from "react";
import { useAccount } from "@/AccountContext";
import CourseCard from "./CourseCard";

interface Offering {
  // courseId: number;
  courseCode: string;
  courseName: string;
  sectionNumber: string;
  title: string;
  description: string;
  time: string;
  remainingSlots: number;
  maxSlots: number;
  instructor: string;
}

export default function EnrollCourses() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { accountId } = useAccount();

  useEffect(() => {
    let isMounted = true;
    
    const fetchOfferings = async () => {
      try {
        const res = await fetch("http://localhost:4000/enroll-courses");
        if (!res.ok) throw new Error("Service unavailable");
        const data = await res.json();

        if (isMounted) {
          setOfferings(data);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load offerings");

        if (isMounted) {
          setError("Service unavailable. Retrying...");
          setLoading(false);
        }
        // Retry after 5 seconds
        setTimeout(fetchOfferings, 5000);
      }
    };

    fetchOfferings();
  }, []);

  useEffect(() => {
    if (!accountId) return;

    const fetchEnrollments = async () => {
      try {
        const res = await fetch(`http://localhost:4000/student-enrollments/${accountId}`);
        const data = await res.json();

        setEnrollments(data.map((e: any) => `${e.course_code}-${e.section}`));
      } catch (err) {
        console.error(err);
      }
    };

    fetchEnrollments();
  }, [accountId]);


  const handleEnroll = async (courseCode: string, section: string) => {
    try {
      const res = await fetch("http://localhost:4000/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          studentId: accountId, 
          courseCode, 
          section 
        }),
      });
      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setEnrollments(prev => {
          if (!prev.includes(`${courseCode}-${section}`)) {
            return [...prev, `${courseCode}-${section}`];
          }
          return prev;
        });


        setOfferings(prev =>
          prev.map(o =>
            o.courseCode === courseCode && o.sectionNumber === section
              ? { ...o, remainingSlots: o.remainingSlots - 1, enrolled: true }
              : o
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Enrollment failed");
    }
  };

  if (error) return <div className="text-red-600">{error}</div>;
  if (loading) return <div className="text-gray-600 m-2">Loading courses...</div>;

  return (
    <>
      <span className="text-2xl m-4 font-bold">Enroll Courses</span>
      {offerings.map((o) => {
        const isEnrolled = enrollments.includes(`${o.courseCode}-${o.sectionNumber}`);

        return (
          <CourseCard
            key={`${o.courseCode}-${o.sectionNumber}`}
            courseId={o.courseCode}
            courseName={o.courseName}
            remSlots={o.maxSlots - o.remainingSlots}
            maxSlots={o.maxSlots}
            desc={o.description}
            instructor={o.instructor}
            section={o.sectionNumber}
            time={o.time}
            variant="enroll"
            enrolled={isEnrolled}
            onEnroll={handleEnroll}
          />
        );
      })}
    </>
  );
}