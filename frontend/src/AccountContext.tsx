import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AccountType = "student" | "faculty" | null;

interface AccountContextType {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>(null);

  return (
    <AccountContext.Provider value={{ accountType, setAccountType }}>
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
