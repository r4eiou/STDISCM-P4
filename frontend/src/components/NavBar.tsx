import { Button } from "@/components/ui/button";
import { useAccount } from "@/AccountContext";
import { useEffect } from "react";
import { ModeToggle } from "./ModeToggle";

export default function NavBar() {
  const { accountType, setAccountData } = useAccount();

  useEffect(() => {
    // console.log("accountType changed to:", accountType);
  }, [accountType]);

  const handleLogout = () => {
    // console.log("Before logout:", accountType);
    setAccountData({
      type: null,
      id: null,
      firstName: null,
      lastName: null,
      email: null,
    });
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full px-8 py-2 drop-shadow ${
        !accountType ? "bg-secondary" : "bg-primary"
      }`}
    >
      <div className="w-full flex items-center justify-between">
        <span className="text-xl font-extrabold ">Shiz University</span>
        {!accountType && <ModeToggle />}
        {accountType && (
          <div className="flex justify-items">
            <ModeToggle />
            <Button variant={"ghost"} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
