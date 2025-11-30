import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";

interface Course {
  courseCode: string;
  title: string;
  description: string;
}

export default function ViewCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/view-courses")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        setCourses(data);
      })
      .catch((err) => console.error(err));
  }, []);

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
          variant="view"
        />
      ))}
    </>
  );
}