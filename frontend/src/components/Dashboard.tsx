import Container from "./Container";

import { useState } from "react";

import FeatureCard from "./FeatureCard";

export default function Dashboard({
  accountType,
}: {
  accountType: "student" | "faculty";
}) {
  const [selectedFeature, setSelectedFeature] = useState<
    | "viewCourses"
    | "viewGrades"
    | "uploadGrades"
    | "viewGrades"
    | "enrollCourses"
    | null
  >(null);

  return (
    <>
      <Container withGoBack={true}>
        <span className="font-bold text-base">
          {/* sample text for debugging only */}
          You are logged in as a {accountType}. You selected {selectedFeature}
        </span>

        {!selectedFeature && (
          <div className="bg-muted text-foreground w-4/5 h-fit flex p-8 rounded-xl flex-start flex-col gap-4 overflow-hidden">
            <span className="text-2xl">
              Welcome back,
              <span className="font-extrabold"> Account Name</span>.
            </span>
            <span>Please choose an action below.</span>
            <div className="mt-10 flex w-full h-full gap-6 justify-around items-stretch">
              <FeatureCard
                cardText="View Courses"
                imageUrl="/images/dom-fou-YRMWVcdyhmI-unsplash.jpg"
                onClick={() => setSelectedFeature("viewCourses")}
              ></FeatureCard>
              {accountType === "student" && (
                <>
                  <FeatureCard
                    cardText="View Grades"
                    imageUrl="/images/christian-medina-tBr9CPIArGQ-unsplash.jpg"
                    onClick={() => setSelectedFeature("viewGrades")}
                  ></FeatureCard>
                  <FeatureCard
                    cardText="Enroll Courses"
                    imageUrl="/images/kvalifik-5Q07sS54D0Q-unsplash.jpg"
                    onClick={() => setSelectedFeature("enrollCourses")}
                  ></FeatureCard>
                </>
              )}
              {accountType === "faculty" && (
                <>
                  <FeatureCard
                    cardText="Upload Grades"
                    imageUrl="/images/priscilla-du-preez-OEdkPaxYMXU-unsplash.jpg"
                    onClick={() => setSelectedFeature("uploadGrades")}
                  ></FeatureCard>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
