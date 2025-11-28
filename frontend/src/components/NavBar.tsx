import { Button } from "@/components/ui/button";
import { useAccount } from "@/AccountContext";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { accountType, setAccountType } = useAccount();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAccountType(null);
    navigate("/");
  };

  return (
    <nav className="w-full px-8 py-2 bg-secondary border-b border-slate-900">
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
