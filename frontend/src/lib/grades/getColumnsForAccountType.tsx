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
  faculty_id: number;
  course_code: string;
  section: string;
  grade: number | null;
  status: string;
}

export const getColumnsForAccountType = (
  accountType: string | null,
  grades: Record<string, string>,
  setGrades: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void,
  onSubmitGrade?: (studentId: number, courseCode: string, grade: string) => void
): ColumnDef<Grade>[] => {
  const baseColumns: ColumnDef<Grade>[] = [
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
          const grade = row.getValue("grade") as number | null;
          return (
            <div className="font-medium">
              {grade !== null ? grade.toFixed(1) : "N/A"}
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
          const grade = row.getValue("grade") as number | null;
          const studentId = row.getValue("student_id") as number;
          const courseCode = row.getValue("course_code") as string;
          const rowKey = `${studentId}-${courseCode ?? ""}`;
          const selectedGrade = grades?.[rowKey] || "";

          return (
            <div className="font-medium">
              {grade !== null ? (
                grade.toFixed(1)
              ) : (
                <div className="flex w-full max-w-sm items-center gap-2">
                  <Select
                    value={selectedGrade}
                    onValueChange={(value) => {
                      setGrades((prev) => ({
                        ...prev,
                        [rowKey]: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="N/A" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Grades</SelectLabel>
                        <SelectItem value="0.0">0.0</SelectItem>
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
                    aria-label="Submit"
                    className={selectedGrade ? "bg-primary" : ""}
                    onClick={() => {
                      if (selectedGrade && onSubmitGrade) {
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
      },
    ];
  }

  // Students only see their own grades (no student ID/name column needed)
  return baseColumns;
};
