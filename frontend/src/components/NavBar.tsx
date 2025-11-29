import { Button } from "@/components/ui/button";
import { useAccount } from "@/AccountContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NavBar() {
  const { accountType, setAccountData } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("accountType changed to:", accountType);
  }, [accountType]);

  const handleLogout = () => {
    console.log("Before logout:", accountType);
    setAccountData({
      type: null,
      id: null,
      firstName: null,
      lastName: null,
    });
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-8 py-2 bg-secondary border-b border-slate-900">
      <div className="w-full flex items-center justify-between">
        <span className="text-xl font-extrabold ">Shiz University</span>
        {accountType && (
          <Button variant={"ghost"} onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
