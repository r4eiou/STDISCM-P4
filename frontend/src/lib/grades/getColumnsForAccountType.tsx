import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Grade } from "@/data/sampleData";

// Define StudentGrade interface
export interface StudentGrade extends Grade {
  studentName: string;
  studentLastName: string;
  studentEmail: string;
  courseTitle: string;
}

export const getColumnsForAccountType = (
  accountType: string
): ColumnDef<StudentGrade>[] => {
  const baseColumns: ColumnDef<StudentGrade>[] = [
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "course_code",
      header: "Course Code",
    },
    {
      accessorKey: "courseTitle",
      header: "Course Title",
    },
    {
      accessorKey: "section",
      header: "Section",
    },
    {
      accessorKey: "grade",
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
        const grade = row.getValue("grade") as number | null;
        return (
          <div className="font-medium">
            {grade !== null ? grade.toFixed(1) : "N/A"}
          </div>
        );
      },
    },
  ];

  // Faculty sees student information
  if (accountType === "faculty") {
    return [
      {
        accessorKey: "student_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Student ID
              <ArrowUpDown />
            </Button>
          );
        },
      },
      {
        accessorKey: "studentName",
        header: "Student Name",
      },
      ...baseColumns,
    ];
  }

  // Students only see their own grades (no student ID/name column needed)
  return baseColumns;
};
