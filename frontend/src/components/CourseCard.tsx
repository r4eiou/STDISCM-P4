import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "./ui/button";

interface CourseCardProps {
  courseId: string | number;
  courseName: string;
  desc: string;
  remSlots?: number;
  maxSlots?: number;
  instructor?: string;
  section?: string | number;
  time: string;
  variant: "view" | "enroll";
}

export default function CourseCard({
  courseId,
  courseName,
  desc,
  remSlots,
  maxSlots,
  instructor,
  section,
  time,
  variant,
}: CourseCardProps) {
  return (
    <Card className="w-1/2 m-3">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-2xl">
          {courseId} | {courseName}
        </CardTitle>

        {/* Only show badge/enroll button if variant is "enroll" */}
        {variant === "enroll" && (
          <CardAction className="text-sm">
            {remSlots !== undefined && maxSlots !== undefined ? (
              remSlots < maxSlots ? (
                <div className="flex gap-2">
                  <Badge variant="default">
                    {remSlots} / {maxSlots}
                  </Badge>
                  <Button className="hover:scale-110 ease-in-out transition-transform">
                    Enroll
                  </Button>
                </div>
              ) : (
                <Badge variant="secondary">FULL</Badge>
              )
            ) : null}
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="text-start">
        <p>{desc}</p>
      </CardContent>

      {/* Only show footer if variant is "enroll" and info exists */}
      {variant === "enroll" && (instructor || section) && (
        <>
          <CardFooter className="flex justify-between">
            <CardDescription>Instructor: {instructor}</CardDescription>
          </CardFooter>
          <CardFooter className="flex justify-between">
            <CardDescription>Section: {section}</CardDescription>
            <CardDescription>Time: {time}</CardDescription>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
