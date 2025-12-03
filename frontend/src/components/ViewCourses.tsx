import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";

interface Course {
  courseCode: string;
  title: string;
  description: string;
}

export default function ViewCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:4000/view-courses");
        if (!res.ok) throw new Error("Service unavailable");
        const data: Course[] = await res.json();
        if (isMounted) {
          setCourses(data);
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
        setTimeout(fetchCourses, 5000);
      }
    };

    fetchCourses();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  // Display error message
  if (loading) return <div className="text-gray-600 m-2">Loading courses...</div>;
  if (error) return <div className="text-red-600 m-2">{error}</div>;

  return (
    <>
      <span className="text-2xl m-4 font-bold">View Courses</span>
      {courses.map((course) => (
        <CourseCard
          key={course.courseCode}
          courseId={course.courseCode} // or just use a number if you want
          courseName={course.title}
          remSlots={0} // placeholder if not using offerings
          maxSlots={0} // placeholder
          desc={course.description}
          instructor="" // placeholder if not fetching faculty
          section={0} // placeholder if not fetching section
          time=""
          variant="view"
        />
      ))}
    </>
  );
}