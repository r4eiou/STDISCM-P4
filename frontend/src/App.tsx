import "./App.css";
import AccountForm from "./components/AccountForm";
import Dashboard from "./components/Dashboard";

import { useAccount } from "@/AccountContext";

function App() {
  const { setAccountData, firstName, lastName, accountType, setAccountType } =
    useAccount();

  return (
    <section className=" w-full flex flex-row items-center justify-center h-full">
      {!accountType && (
        <>
          <section className="relative flex flex-col items-center justify-center w-3/5  h-full">
            <div className="absolute inset-0 bg-[url(/images/pexels-polina-zimmerman-3747505.jpg)] bg-cover bg-center brightness-60 -z-10" />

            <span className="font-bold text-5xl text-white drop-shadow-lg">
              Welcome to Shiz University!
            </span>
          </section>
          <section className="flex flex-col items-center justify-center w-2/5 bg-primary h-full">
            <AccountForm />
          </section>
        </>
      )}
      {accountType && <Dashboard />}
    </section>
  );
}

export default App;
