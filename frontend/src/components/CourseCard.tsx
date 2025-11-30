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
  courseId: number;
  courseName: string;
  remSlots: number;
  maxSlots: number;
  desc: string;
  instructor: string;
  section: number;
  time: string;
  variant: "view" | "enroll";
}

export default function CourseCard({
  courseId,
  courseName,
  remSlots,
  maxSlots,
  desc,
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
        <CardAction className="text-sm ">
          {variant === "view" &&
            (!(remSlots === maxSlots) ? (
              <Badge variant="default">
                {remSlots} / {maxSlots}
              </Badge>
            ) : (
              <Badge variant="secondary">FULL</Badge>
            ))}

          {variant === "enroll" &&
            (!(remSlots === maxSlots) ? (
              <>
                <div className="flex gap-2">
                  <Badge variant="default">
                    {remSlots} / {maxSlots}
                  </Badge>
                  <Button className="hover:scale-110 ease-in-out transition-transform">
                    Enroll
                  </Button>
                </div>
              </>
            ) : (
              <Badge variant="secondary">FULL</Badge>
            ))}
        </CardAction>
      </CardHeader>
      <CardContent className="text-start">
        <p>{desc}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CardDescription>Instructor: {instructor}</CardDescription>
      </CardFooter>
      <CardFooter className="flex justify-between">
        <CardDescription>Section: {section}</CardDescription>
        <CardDescription>Time: {time}</CardDescription>
      </CardFooter>
    </Card>
  );
}
