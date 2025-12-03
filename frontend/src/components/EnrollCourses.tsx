import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";

interface Offering {
  courseId: number;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const res = await fetch("http://localhost:4000/enroll-courses");
        const data = await res.json();
        setOfferings(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load offerings");
      }
    };

    fetchOfferings();
  }, []);

  const handleEnroll = async (courseCode: string, section: string) => {
    try {
      const res = await fetch("http://localhost:4000/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: "1", courseCode, section }) // replace studentId dynamically
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setOfferings((prev) =>
          prev.map((o) =>
            o.courseCode === courseCode && o.sectionNumber === section
              ? { ...o, remainingSlots: o.remainingSlots - 1 }
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

  return (
    <>
      <span className="text-2xl m-4 font-bold">Enroll Courses</span>
      {offerings.map((o) => (
        <CourseCard
          key={`${o.courseCode}-${o.sectionNumber}`}
          courseId={o.courseId}
          courseName={o.courseName}
          remSlots={o.remainingSlots}
          maxSlots={o.maxSlots}
          desc={o.description}
          instructor={o.instructor}
          section={o.sectionNumber}
          time={o.time} // sample only, if enroll input offerings.time, if view leave as null
          variant="enroll"
        />
      ))}
    </>
  );
}