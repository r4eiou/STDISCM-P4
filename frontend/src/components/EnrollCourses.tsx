import CourseCard from "./CourseCard";
import courseData from "../lib/courseData.ts";

export default function EnrollCourses() {
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
        variant="enroll"
      />
    );
  });
  return (
    <>
      <span className="text-2xl m-4 font-bold">Enroll Courses</span>
      {courseCards}
    </>
  );
}
