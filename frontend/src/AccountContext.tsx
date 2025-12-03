import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type AccountType = "student" | "faculty" | null;

interface AccountContextType {
  accountType: AccountType;
  accountId: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  setAccountData: (data: {
    type: AccountType;
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  }) => void;
  clearAccount: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);
const STORAGE_KEY = "accountData";

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountData, setAccountDataState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          type: null,
          id: null,
          firstName: null,
          lastName: null,
          email: null,
        };
      }
    }
    return {
      type: null,
      id: null,
      firstName: null,
      lastName: null,
      email: null,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accountData));
  }, [accountData]);

  const setAccountData = (data: {
    type: AccountType;
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  }) => {
    setAccountDataState(data);
  };

  const clearAccount = () => {
    setAccountDataState({
      type: null,
      id: null,
      firstName: null,
      lastName: null,
      email: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("accountData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setAccountData(parsed);
      } catch (err) {
        console.error("Failed to parse accountData from localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (accountType && accountId) {
      localStorage.setItem(
        "accountData",
        JSON.stringify({ type: accountType, id: accountId, firstName, lastName, email })
      );
    } else {
      localStorage.removeItem("accountData");
    }
  }, [accountType, accountId, firstName, lastName, email]);

  return (
    <AccountContext.Provider
      value={{
        accountType: accountData.type,
        accountId: accountData.id,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        setAccountData,
        clearAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
