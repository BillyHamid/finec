import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, LoanRequest, Cheque, ActiveCredit, Savings, Account } from './types';
import { MOCK_USERS, MOCK_LOAN_REQUESTS, MOCK_CHEQUES, MOCK_ACTIVE_CREDITS, MOCK_SAVINGS, MOCK_ACCOUNTS, AGENCIES } from './data';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loanRequests: LoanRequest[];
  cheques: Cheque[];
  activeCredits: ActiveCredit[];
  savings: Savings[];
  accounts: Account[];
  updateLoanRequest: (id: string, updates: Partial<LoanRequest>) => void;
  createLoanRequest: (request: Omit<LoanRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => void;
  createAccount: (account: Omit<Account, 'id' | 'accountNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  users: User[];
  createUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(MOCK_LOAN_REQUESTS);
  const [cheques, setCheques] = useState<Cheque[]>(MOCK_CHEQUES);
  const [activeCredits, setActiveCredits] = useState<ActiveCredit[]>(MOCK_ACTIVE_CREDITS);
  const [savings, setSavings] = useState<Savings[]>(MOCK_SAVINGS);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateLoanRequest = (id: string, updates: Partial<LoanRequest>) => {
    setLoanRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, ...updates, updatedAt: new Date().toISOString() }
          : req
      )
    );
  };

  const createLoanRequest = (request: Omit<LoanRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: LoanRequest = {
      ...request,
      id: `loan${Date.now()}`,
      requestNumber: `CR-2025-${String(loanRequests.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLoanRequests(prev => [...prev, newRequest]);
  };

  const createUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `user${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const createAccount = (account: Omit<Account, 'id' | 'accountNumber' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...account,
      id: `acc${Date.now()}`,
      accountNumber: `FINEC-2025-${String(accounts.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => 
      prev.map(acc => 
        acc.id === id 
          ? { ...acc, ...updates, updatedAt: new Date().toISOString() }
          : acc
      )
    );
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      loanRequests,
      cheques,
      activeCredits,
      savings,
      accounts,
      updateLoanRequest,
      createLoanRequest,
      createAccount,
      updateAccount,
      users,
      createUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
