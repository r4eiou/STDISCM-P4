import React, {
  createContext,
  useContext,
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
  setAccountType: (type: AccountType) => void;
  setAccountId: (id: number | null) => void;
  setFirstName: (name: string | null) => void;
  setLastName: (name: string | null) => void;
  setEmail: (email: string | null) => void;

  setAccountData: (data: {
    type: AccountType;
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  }) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const setAccountData = (data: {
    type: AccountType;
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  }) => {
    setAccountType(data.type);
    setAccountId(data.id);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
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
        accountType,
        setAccountType,
        accountId,
        setAccountId,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        setAccountData,
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