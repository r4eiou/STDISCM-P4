export interface Student {
  student_id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  program: string;
}

export interface Faculty {
  faculty_id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface Course {
  course_code: string;
  title: string;
  description: string;
}

export interface FacultyCourse {
  faculty_id: number;
  course_code: string;
  section: string;
  time: string;
  slots: number;
  remaining: number;
}

export interface Enrollment {
  student_id: number;
  faculty_id: number;
  course_code: string;
  section: string;
}

export interface Grade {
  student_id: number;
  faculty_id: number;
  course_code: string;
  section: string;
  grade: number;
}

// Sample data generators
export const generateStudents = (): Student[] => {
  const programs = [
    "Computer Science",
    "Information Technology",
    "Data Science",
  ];

  const firstNames = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Linda",
    "William",
    "Barbara",
    "David",
    "Elizabeth",
    "Richard",
    "Susan",
    "Joseph",
    "Jessica",
    "Thomas",
    "Sarah",
    "Charles",
    "Karen",
    "Christopher",
    "Nancy",
    "Daniel",
    "Lisa",
    "Matthew",
    "Betty",
    "Anthony",
    "Margaret",
    "Mark",
    "Sandra",
    "Donald",
    "Ashley",
    "Steven",
    "Kimberly",
    "Paul",
    "Emily",
    "Andrew",
    "Donna",
    "Joshua",
    "Michelle",
    "Kenneth",
    "Carol",
    "Kevin",
    "Amanda",
    "Brian",
    "Dorothy",
    "George",
    "Melissa",
    "Edward",
    "Deborah",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
  ];

  const students: Student[] = [];

  for (let i = 1; i <= 50; i++) {
    const firstName = firstNames[i - 1] || firstNames[i % firstNames.length];
    const lastName = lastNames[i - 1] || lastNames[i % lastNames.length];

    students.push({
      student_id: i,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@shiz.edu`,
      password: "password123",
      firstname: firstName,
      lastname: lastName,
      program: programs[Math.floor(Math.random() * programs.length)],
    });
  }

  return students;
};

export const generateFaculty = (): Faculty[] => {
  return [
    {
      faculty_id: 101,
      email: "faculty101@shiz.edu",
      password: "password123",
      firstname: "John",
      lastname: "Professor",
    },
    {
      faculty_id: 102,
      email: "faculty102@shiz.edu",
      password: "password123",
      firstname: "Jane",
      lastname: "Teacher",
    },
    {
      faculty_id: 103,
      email: "faculty103@shiz.edu",
      password: "password123",
      firstname: "Bob",
      lastname: "Instructor",
    },
  ];
};

export const generateCourses = (): Course[] => {
  return [
    {
      course_code: "CS101",
      title: "Introduction to Programming",
      description: "Basic programming concepts and problem-solving",
    },
    {
      course_code: "CS201",
      title: "Data Structures",
      description: "Fundamental data structures and algorithms",
    },
    {
      course_code: "CS301",
      title: "Database Systems",
      description: "Database design and SQL",
    },
    {
      course_code: "IT101",
      title: "Web Development",
      description: "HTML, CSS, and JavaScript fundamentals",
    },
  ];
};

export const generateFacultyCourses = (): FacultyCourse[] => {
  return [
    // Faculty 101 teaches 2 sections of CS101 and 1 section of CS201
    {
      faculty_id: 101,
      course_code: "CS101",
      section: "S13",
      time: "MWF 9:00-10:00",
      slots: 30,
      remaining: 20,
    },
    {
      faculty_id: 101,
      course_code: "CS101",
      section: "S14",
      time: "TTH 10:00-11:30",
      slots: 30,
      remaining: 15,
    },
    {
      faculty_id: 101,
      course_code: "CS201",
      section: "S14",
      time: "MWF 1:00-2:00",
      slots: 25,
      remaining: 25,
    },

    // Faculty 102 teaches 2 different courses (CS201 and IT101)
    {
      faculty_id: 102,
      course_code: "CS201",
      section: "S13",
      time: "MWF 11:00-12:00",
      slots: 25,
      remaining: 10,
    },
    {
      faculty_id: 102,
      course_code: "IT101",
      section: "S13",
      time: "TTH 1:00-2:30",
      slots: 35,
      remaining: 25,
    },

    // Faculty 103 teaches CS301 and IT101
    {
      faculty_id: 103,
      course_code: "CS301",
      section: "S13",
      time: "MWF 2:00-3:00",
      slots: 20,
      remaining: 5,
    },
    {
      faculty_id: 103,
      course_code: "IT101",
      section: "S14",
      time: "TTH 3:00-4:30",
      slots: 30,
      remaining: 15,
    },
  ];
};

export const generateEnrollments = (students: Student[]): Enrollment[] => {
  const enrollments: Enrollment[] = [];

  // First 10 students in CS101 Section A (Faculty 101)
  for (let i = 0; i < 10; i++) {
    enrollments.push({
      student_id: students[i].student_id,
      faculty_id: 101,
      course_code: "CS101",
      section: "S13",
    });
  }

  // Enroll 15 students in CS101 Section B (Faculty 101)
  for (let i = 10; i < 25; i++) {
    enrollments.push({
      student_id: students[i].student_id,
      faculty_id: 101,
      course_code: "CS101",
      section: "S14",
    });
  }

  // Enroll students 15-30 in CS201 Section A (Faculty 102)
  // Note: students 15-24 are ALSO in CS101-B (multiple courses, different sections)
  for (let i = 15; i < 30; i++) {
    enrollments.push({
      student_id: students[i].student_id,
      faculty_id: 102,
      course_code: "CS201",
      section: "S13",
    });
  }

  // Enroll students 5-15 in IT101 Section A (Faculty 102)
  // Students Taking IT101 + CS101 (multiple courses)
  for (let i = 5; i < 15; i++) {
    enrollments.push({
      student_id: students[i].student_id,
      faculty_id: 102,
      course_code: "IT101",
      section: "S13",
    });
  }

  // Enroll students 30-45 in CS301 Section A (Faculty 103)
  for (let i = 30; i < 45; i++) {
    enrollments.push({
      student_id: students[i].student_id,
      faculty_id: 103,
      course_code: "CS301",
      section: "S13",
    });
  }

  // Some students taking 3-4 courses
  // Students 0-5 also enroll in CS201 and CS301
  for (let i = 0; i < 5; i++) {
    enrollments.push({
      student_id: students[i].student_id,
      faculty_id: 102,
      course_code: "CS201",
      section: "S13",
    });
    enrollments.push({
      student_id: students[i].student_id,
      faculty_id: 103,
      course_code: "CS301",
      section: "S13",
    });
  }

  return enrollments;
};

export const generateGrades = (enrollments: Enrollment[]): Grade[] => {
  return enrollments.map((enrollment) => ({
    ...enrollment,
    grade: Math.floor(Math.random() * 41) + 60, // Random grade 60-100
  }));
};

export const generateAllData = () => {
  const students = generateStudents();
  const faculty = generateFaculty();
  const courses = generateCourses();
  const facultyCourses = generateFacultyCourses();
  const enrollments = generateEnrollments(students);
  const grades = generateGrades(enrollments);

  return {
    students,
    faculty,
    courses,
    facultyCourses,
    enrollments,
    grades,
  };
};
