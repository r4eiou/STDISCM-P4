import { Button } from "@/components/ui/button";

export default function NavBar({
  accountType,
  setAccountType,
}: {
  accountType: "student" | "faculty" | null;
  setAccountType: (value: "student" | "faculty" | null) => void;
}) {
  return (
    <nav className="w-full px-8 py-2 bg-secondary border-b border-gray-200">
      <div className="w-full flex items-center justify-between">
        <span className="text-xl font-extrabold cursor-pointer hover:underline hover:text-primary">
          Shiz University
        </span>
        {accountType && (
          <Button variant={"ghost"} onClick={() => setAccountType(null)}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
