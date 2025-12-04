import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Grade {
  student_id: number;
  studentName?: string;
  faculty_id: number;
  courseCode: string;
  section: string;
  grade: number | null;
  status: string;
}

export interface StudentGrade extends Grade {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
}

export const getColumnsForAccountType = (
  accountType: string | null,
  grades: Record<string, string>,
  setGrades: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void,
  onSubmitGrade?: (studentId: number, courseCode: string, grade: string) => void
): ColumnDef<StudentGrade>[] => {
  const baseColumns: ColumnDef<StudentGrade>[] = [
    {
      accessorKey: "courseCode",
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
  ];

  if (accountType === "student") {
    return [
      ...baseColumns,
      {
        accessorKey: "grade",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Grade
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          const grade = row.getValue("grade") as number | null | undefined;
          return (
            <div className="font-medium">
              {grade !== null && grade !== undefined && grade !== 0 
                ? grade.toFixed(1) 
                : "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ];
  }

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
      ...baseColumns,
      {
        accessorKey: "grade",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Grade
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
  const grade = row.getValue("grade") as number | null | undefined;
  const studentId = row.getValue("student_id") as number;
  const courseCode = row.original.course_code; // CHANGED: use row.original instead
  const section = row.original.section;        // CHANGED: use row.original instead
  const status = row.getValue("status") as string;
  const rowKey = `${studentId}-${courseCode}-${section}`;
  const selectedGrade = grades?.[rowKey] || "";

  // Show input if status is 'ongoing' AND (grade is null, undefined, or 0)
  const showInput = status === 'ongoing' && (grade === null || grade === undefined || grade === 0);

  console.log('Cell render:', { studentId, courseCode, section, grade, status }); // Debug log

  return (
    <div className="font-medium">
      {!showInput ? (
        // Display grade if already graded
        <span className="text-lg">
          {grade !== null && grade !== undefined && grade !== 0 
            ? grade.toFixed(1) 
            : 'N/A'}
        </span>
      ) : (
        // Show input for ongoing courses
        <div className="flex w-full max-w-sm items-center gap-2">
          <Select
            value={selectedGrade}
            onValueChange={(value) => {
              console.log('Grade selected:', value, 'for student:', studentId, 'course:', courseCode, 'section:', section);
              setGrades((prev) => ({
                ...prev,
                [rowKey]: value,
              }));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Grades</SelectLabel>
                <SelectItem value="1.0">1.0</SelectItem>
                <SelectItem value="1.5">1.5</SelectItem>
                <SelectItem value="2.0">2.0</SelectItem>
                <SelectItem value="2.5">2.5</SelectItem>
                <SelectItem value="3.0">3.0</SelectItem>
                <SelectItem value="3.5">3.5</SelectItem>
                <SelectItem value="4.0">4.0</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant={selectedGrade ? "default" : "outline"}
            size="icon"
            aria-label="Submit grade"
            disabled={!selectedGrade}
            onClick={() => {
              console.log('Submit button clicked:', { studentId, courseCode, section, selectedGrade });
              if (selectedGrade && onSubmitGrade && courseCode) {
                onSubmitGrade(studentId, courseCode, selectedGrade);
              }
            }}
          >
            <Check />
          </Button>
        </div>
      )}
    </div>
  );
},
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusColors: Record<string, string> = {
            ongoing: "text-yellow-500",
            passed: "text-green-500",
            failed: "text-red-500",
            completed: "text-blue-500",
          };
          return (
            <span className={`font-medium ${statusColors[status] || ""}`}>
              {status}
            </span>
          );
        },
      },
    ];
  }

  // Default fallback
  return baseColumns;
};