import { Button } from "./ui/button";

export default function Container({
  children,
  withGoBack = true,
}: {
  children?: React.ReactNode;
  withGoBack?: boolean;
}) {
  return (
    <div className="w-full h-full flex flex-col mt-10">
      <div className="w-full h-full flex flex-col items-start">
        {withGoBack && (
          <Button variant="link" className="mb-4">
            Go Back
          </Button>
        )}

        <section className="mt-4 w-full h-full flex flex-col items-center ">
          {children}
        </section>
      </div>
    </div>
  );
}
