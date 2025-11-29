import type { Student, StudentCourse } from "./grades/gradesColumns";

export function generateStudents(count: number): Student[] {
  const firstNames = [
    "Alice",
    "Bob",
    "Carol",
    "David",
    "Emma",
    "Frank",
    "Grace",
    "Henry",
    "Iris",
    "Jack",
  ];
  const lastNames = [
    "Anderson",
    "Brown",
    "Chen",
    "Davis",
    "Evans",
    "Fisher",
    "Garcia",
    "Harris",
    "Ivanov",
    "Jones",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[Math.floor(i / firstNames.length) % lastNames.length],
    email: `student${i + 1}@university.edu`,
    password: "hashed_password",
  }));
}

export function enrollStudentsInSection(
  sectionId: number,
  courseId: number,
  studentIds: number[]
): StudentCourse[] {
  const possibleGrades = [0.0, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];

  return studentIds.map((studentId) => ({
    courseId,
    sectionId,
    studentId,
    gradeNum:
      Math.random() > 0.2
        ? possibleGrades[Math.floor(Math.random() * possibleGrades.length)]
        : null,
  }));
}
