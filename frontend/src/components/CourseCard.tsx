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

interface CourseCardProps {
  courseId: number;
  courseName: string;
  remSlots: number;
  maxSlots: number;
  desc: string;
  instructor: string;
  section: number;
}

export default function CourseCard({
  courseId,
  courseName,
  remSlots,
  maxSlots,
  desc,
  instructor,
  section,
}: CourseCardProps) {
  return (
    <Card className="w-1/2 m-3">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-2xl">
          {courseId} | {courseName}
        </CardTitle>
        <CardAction className="text-sm ">
          {!(remSlots === maxSlots) ? (
            <Badge variant="default">
              {remSlots} / {maxSlots}
            </Badge>
          ) : (
            <Badge variant="secondary">FULL</Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="text-start">
        <p>{desc}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CardDescription>Instructor: {instructor}</CardDescription>
        <CardDescription>Section: {section}</CardDescription>
      </CardFooter>
    </Card>
  );
}
