export type Role = 'AGENT' | 'CHEF_AGENCE' | 'OPERATIONS' | 'DG' | 'DSI';

export type LoanStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'VALIDATED_BY_MANAGER' 
  | 'VALIDATED_BY_OPERATIONS' 
  | 'APPROVED' 
  | 'REJECTED';

export interface Agency {
  id: string;
  name: string;
  servicePoints: string[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  agencyId: string;
  servicePoint?: string;
}

export interface LoanRequest {
  id: string;
  requestNumber: string;
  agentId: string;
  agentName: string;
  agencyId: string;
  servicePoint?: string;
  status: LoanStatus;
  
  // Client info
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  
  // Loan details
  amount: number;
  duration: number; // in months
  purpose: string;
  
  // Documents
  documents: {
    identityCard?: string;
    proofOfAddress?: string;
    incomeStatement?: string;
    bankStatement?: string;
  };
  
  // Signature
  signature?: string;
  
  // Workflow
  history: LoanHistoryEntry[];
  
  createdAt: string;
  updatedAt: string;
}

export interface LoanHistoryEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  comment?: string;
  timestamp: string;
}

export interface Cheque {
  id: string;
  chequeNumber: string;
  clientName: string;
  amount: number;
  date: string;
  agencyId: string;
  servicePoint?: string;
  status: 'ACTIVE' | 'CASHED' | 'BOUNCED' | 'CANCELLED';
  scannedDocument?: string;
}

export interface ActiveCredit {
  id: string;
  loanRequestId: string;
  requestNumber: string;
  clientName: string;
  clientPhone: string;
  agentId: string;
  agentName: string;
  agencyId: string;
  servicePoint?: string;
  
  // Loan details
  totalAmount: number;
  duration: number; // in months
  interestRate: number;
  monthlyPayment: number;
  
  // Repayment tracking
  amountPaid: number;
  amountRemaining: number;
  paymentsCompleted: number;
  paymentsRemaining: number;
  
  // Dates
  startDate: string;
  nextPaymentDate: string;
  endDate: string;
  
  // Status
  status: 'CURRENT' | 'LATE' | 'DEFAULTED' | 'COMPLETED';
  daysOverdue: number;
  
  // Payment history
  payments: Payment[];
  
  // Contract
  contractPdfUrl?: string;
}

export interface Payment {
  id: string;
  creditId: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  recordedBy: string;
}

export interface Savings {
  id: string;
  accountNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  agencyId: string;
  servicePoint?: string;
  
  // Savings details
  type: 'MONTHLY' | 'PROJECT' | 'VOLUNTARY';
  totalSaved: number;
  currentBalance: number;
  targetAmount?: number;
  
  // Dates
  openedDate: string;
  lastDepositDate?: string;
  maturityDate?: string;
  
  // Status
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  
  // Deposits history
  deposits: Deposit[];
  
  // Withdrawal history
  withdrawals: Withdrawal[];
}

export interface Deposit {
  id: string;
  savingsId: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  recordedBy: string;
}

export interface Withdrawal {
  id: string;
  savingsId: string;
  amount: number;
  date: string;
  reason: string;
  approvedBy: string;
  recordedBy: string;
}

export type AccountType = 'INDIVIDUAL' | 'JOINT' | 'BUSINESS';
export type AccountStatus = 'PENDING' | 'VALIDATED_BY_MANAGER' | 'VALIDATED_BY_OPERATIONS' | 'APPROVED' | 'REJECTED' | 'ACTIVE';

export interface Account {
  id: string;
  accountNumber: string;
  agentId: string;
  agentName: string;
  agencyId: string;
  servicePoint?: string;
  status: AccountStatus;
  
  // Account type
  accountType: AccountType;
  
  // Primary client info
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientBirthDate: string;
  clientIdNumber: string;
  clientProfession: string;
  
  // Joint account second holder (if applicable)
  secondHolderName?: string;
  secondHolderPhone?: string;
  secondHolderEmail?: string;
  secondHolderIdNumber?: string;
  
  // Business info (if applicable)
  businessName?: string;
  businessRegistration?: string;
  
  // Documents
  documents: {
    identityCard?: string;
    proofOfAddress?: string;
    photo?: string;
    secondHolderIdentity?: string;
    businessRegistration?: string;
  };
  
  // Initial deposit
  initialDeposit: number;
  
  // Signature
  signature?: string;
  secondHolderSignature?: string;
  
  // Workflow
  history: AccountHistoryEntry[];
  
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface AccountHistoryEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  comment?: string;
  timestamp: string;
}
