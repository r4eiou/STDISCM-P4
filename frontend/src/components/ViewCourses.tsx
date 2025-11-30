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
        time="MH 730-9" // sample only, if enroll input offerings.time, if view leave as null
        variant="view"
      />
    );
  });
  return (
    <>
      <span className="text-2xl m-4 font-bold">View Courses</span>
      {courseCards}
    </>
  );
}
