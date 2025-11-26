import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import AccountForm from "./components/AccountForm";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const [accountType, setAccountType] = useState<"student" | "faculty" | null>(
    null
  );
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar accountType={accountType} setAccountType={setAccountType} />
      <section className=" w-full flex flex-row items-center justify-center h-full justify-around">
        {!accountType && (
          <>
            <section className="relative flex flex-col items-center justify-center w-3/5  h-full">
              <div className="absolute inset-0 bg-[url(/public/images/pexels-polina-zimmerman-3747505.jpg)] bg-cover bg-center brightness-60 -z-10" />

              <span className="font-bold text-5xl text-white drop-shadow-lg">
                Welcome to Shiz University!
              </span>
            </section>
            <section className="flex flex-col items-center justify-center w-2/5 bg-primary h-full">
              <AccountForm setAccountType={setAccountType} />
            </section>
          </>
        )}
        {accountType && (
          <section>
            <span className="font-bold text-3xl">
              You are logged in as a {accountType}.
            </span>
          </section>
        )}
      </section>
    </ThemeProvider>
  );
}

export default App;
