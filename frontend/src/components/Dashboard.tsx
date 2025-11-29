import Container from "./Container";

import { useState } from "react";
import { useAccount } from "@/AccountContext";
import { useEffect } from "react";
import ViewCourses from "./ViewCourses";
import FeatureCard from "./FeatureCard";
import EnrollCourses from "./EnrollCourses";
import ViewGrades from "./ViewGrades";
import UploadGrades from "./UploadGrades";

export default function Dashboard() {
  const { firstName, accountType } = useAccount();
  const [back, setBack] = useState<boolean>(false);

  type FeatureType =
    | "viewCourses"
    | "viewGrades"
    | "uploadGrades"
    | "enrollCourses"
    | null;

  const [selectedFeature, setSelectedFeature] = useState<FeatureType>(null);

  const handleClickFeature = (selectedFeature: FeatureType) => {
    setSelectedFeature(selectedFeature);
    setBack(true);
  };

  useEffect(() => {
    if (!selectedFeature) {
      setBack(false);
    }
  }, [selectedFeature]);

  console.log({ accountType, selectedFeature });

  return (
    <>
      <Container
        withGoBack={back}
        onGoBack={selectedFeature ? () => setSelectedFeature(null) : undefined}
      >
        {!selectedFeature && (
          <div className="bg-muted text-foreground w-4/5 h-fit flex p-8 rounded-xl flex-start flex-col gap-4 overflow-hidden">
            <span className="text-2xl">
              Welcome back,
              <span className="font-extrabold"> {firstName}</span>.
            </span>
            <span>Please choose an action below.</span>
            <div className="mt-10 flex w-full h-full gap-6 justify-around items-stretch">
              <FeatureCard
                cardText="View Courses"
                imageUrl="/images/dom-fou-YRMWVcdyhmI-unsplash.jpg"
                onClick={() => handleClickFeature("viewCourses")}
              />
              {accountType === "student" && (
                <>
                  <FeatureCard
                    cardText="View Grades"
                    imageUrl="/images/christian-medina-tBr9CPIArGQ-unsplash.jpg"
                    onClick={() => handleClickFeature("viewGrades")}
                  ></FeatureCard>
                  <FeatureCard
                    cardText="Enroll Courses"
                    imageUrl="/images/kvalifik-5Q07sS54D0Q-unsplash.jpg"
                    onClick={() => handleClickFeature("enrollCourses")}
                  ></FeatureCard>
                </>
              )}
              {accountType === "faculty" && (
                <>
                  <FeatureCard
                    cardText="Upload Grades"
                    imageUrl="/images/priscilla-du-preez-OEdkPaxYMXU-unsplash.jpg"
                    onClick={() => handleClickFeature("uploadGrades")}
                  ></FeatureCard>
                </>
              )}
            </div>
          </div>
        )}

        {selectedFeature === "viewCourses" && <ViewCourses />}
        {selectedFeature === "enrollCourses" && <EnrollCourses />}
        {selectedFeature === "viewGrades" && <ViewGrades />}
        {selectedFeature === "uploadGrades" && <UploadGrades />}
      </Container>
    </>
  );
}
