import CourseCard from "./CourseCard";
import courseData from "../lib/courseData.ts";

export default function ViewCourses() {
  const courseCards = courseData.map((course) => {
    return (
      <CourseCard
        courseId={course.courseId}
        courseName={course.courseName}
        remSlots={course.remainingSlots}
        maxSlots={course.maxSlots}
        desc={course.description}
        instructor={course.instructor}
        section={course.sectionNumber}
      />
    );
  });
  return <>{courseCards}</>;
}
