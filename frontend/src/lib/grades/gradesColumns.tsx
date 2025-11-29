import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export type Section = {
  id: number;
  courseId: number;
  facultyId: number;
  maxSlots: number;
  remSlots: number;
};

export type StudentCourse = {
  courseId: number;
  sectionId: number;
  studentId: number;
  gradeNum: number | null;
};

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type Course = {
  id: number;
  title: string;
  desc: string;
  facultyId: string;
};

export type Faculty = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export type StudentGrade = StudentCourse & {
  studentFirstName?: string;
  studentLastName?: string;
  studentEmail?: string;
  courseTitle?: string;
};

export const columns: ColumnDef<StudentGrade>[] = [
  {
    accessorKey: "studentId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student ID
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const studentId = row.getValue("studentId") as number | null;
      return (
        <div className="font-medium">
          {studentId !== null ? studentId : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "courseId",
    header: "Course ID",
  },
  {
    accessorKey: "sectionId",
    header: "Section",
  },
  {
    accessorKey: "gradeNum",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grade
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const grade = row.getValue("gradeNum") as number | null;
      return (
        <div className="font-medium">
          {grade !== null ? grade.toFixed(1) : "N/A"}
        </div>
      );
    },
  },
];
