import { useEffect, useState } from "react";
import { useAccount } from "@/AccountContext";
import CourseCard from "./CourseCard";

import { toast } from "react-toastify";

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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function EnrollCourses() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { accountId } = useAccount();

  useEffect(() => {
    if (!accountId) return;
    let isMounted = true;

    const fetchAll = async () => {
      try {
        // Fetch offerings
        const offeringsRes = await fetch(`${BASE_URL}/enroll-courses`);
        if (!offeringsRes.ok) throw new Error("Offerings service unavailable");
        const offeringsData = await offeringsRes.json();

        // Fetch current enrollments
        const enrollRes = await fetch(`${BASE_URL}/student-enrollments/${accountId}`);
        if (!enrollRes.ok) throw new Error("Enrollments service unavailable");
        const enrollData = await enrollRes.json();

        if (isMounted) {
          setOfferings(offeringsData);
          setEnrollments(enrollData.map((e: any) => `${e.course_code}-${e.section}`));
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Service unavailable. Retrying...");
        setTimeout(fetchAll, 5000); // retry both
      }
    };

    fetchAll();

    return () => { isMounted = false; };
  }, [accountId]);


  const handleEnroll = async (courseCode: string, section: string) => {
    try {
      const res = await fetch(`${BASE_URL}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          studentId: accountId, 
          courseCode, 
          section 
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Enrollment successful!");
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
      } else {
        toast.error(data.message || "Enrollment failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Enrollment failed: system down");
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