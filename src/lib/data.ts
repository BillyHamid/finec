import { Agency, User, LoanRequest, Cheque, ActiveCredit, Payment, Savings, Deposit, Withdrawal, Account, AccountHistoryEntry } from './types';

export const AGENCIES: Agency[] = [
  {
    id: 'OUA',
    name: 'OUAGADOUGOU',
    servicePoints: ['Bonheur-Ville', 'Kilouin', 'Saba', 'Boulmigou', 'Siège', 'Léo']
  },
  {
    id: 'BOBO',
    name: 'BOBO-DIOULASSO',
    servicePoints: ['Sikassocira', 'Yegueri', 'Orodara']
  },
  {
    id: 'BANFORA',
    name: 'BANFORA',
    servicePoints: []
  }
];

export const MOCK_USERS: User[] = [
  // Agents OUAGADOUGOU
  {
    id: 'agent1',
    email: 'agent.bonheur@finec.bf',
    password: 'demo123',
    firstName: 'Pierre',
    lastName: 'Ouedraogo',
    role: 'AGENT',
    agencyId: 'OUA',
    servicePoint: 'Bonheur-Ville'
  },
  {
    id: 'agent2',
    email: 'agent.kilouin@finec.bf',
    password: 'demo123',
    firstName: 'Marie',
    lastName: 'Kabore',
    role: 'AGENT',
    agencyId: 'OUA',
    servicePoint: 'Kilouin'
  },
  {
    id: 'agent3',
    email: 'agent.saba@finec.bf',
    password: 'demo123',
    firstName: 'Joseph',
    lastName: 'Traore',
    role: 'AGENT',
    agencyId: 'OUA',
    servicePoint: 'Saba'
  },
  
  // Agents BOBO-DIOULASSO
  {
    id: 'agent4',
    email: 'agent.sikasso@finec.bf',
    password: 'demo123',
    firstName: 'Paul',
    lastName: 'Coulibaly',
    role: 'AGENT',
    agencyId: 'BOBO',
    servicePoint: 'Sikassocira'
  },
  {
    id: 'agent5',
    email: 'agent.yegueri@finec.bf',
    password: 'demo123',
    firstName: 'Therese',
    lastName: 'Sana',
    role: 'AGENT',
    agencyId: 'BOBO',
    servicePoint: 'Yegueri'
  },
  
  // Agent BANFORA
  {
    id: 'agent6',
    email: 'agent.banfora@finec.bf',
    password: 'demo123',
    firstName: 'Jean',
    lastName: 'Sawadogo',
    role: 'AGENT',
    agencyId: 'BANFORA'
  },
  
  // Chefs d'agence
  {
    id: 'chef1',
    email: 'chef.ouaga@finec.bf',
    password: 'demo123',
    firstName: 'Honoré',
    lastName: 'Zongo',
    role: 'CHEF_AGENCE',
    agencyId: 'OUA'
  },
  {
    id: 'chef2',
    email: 'chef.bobo@finec.bf',
    password: 'demo123',
    firstName: 'Anne',
    lastName: 'Diallo',
    role: 'CHEF_AGENCE',
    agencyId: 'BOBO'
  },
  {
    id: 'chef3',
    email: 'chef.banfora@finec.bf',
    password: 'demo123',
    firstName: 'Michel',
    lastName: 'Konate',
    role: 'CHEF_AGENCE',
    agencyId: 'BANFORA'
  },
  
  // Service Opérations
  {
    id: 'ops1',
    email: 'operations@finec.bf',
    password: 'demo123',
    firstName: 'Marie',
    lastName: 'Compaore',
    role: 'OPERATIONS',
    agencyId: 'OUA' // Siège
  },
  
  // Direction Générale
  {
    id: 'dg1',
    email: 'dg@finec.bf',
    password: 'demo123',
    firstName: 'Jacques',
    lastName: 'Ouattara',
    role: 'DG',
    agencyId: 'OUA' // Siège
  },
  
  // DSI
  {
    id: 'dsi1',
    email: 'dsi@finec.bf',
    password: 'demo123',
    firstName: 'Thomas',
    lastName: 'Somda',
    role: 'DSI',
    agencyId: 'OUA' // Siège
  }
];

export const MOCK_LOAN_REQUESTS: LoanRequest[] = [
  {
    id: 'loan1',
    requestNumber: 'CR-2025-001',
    agentId: 'agent1',
    agentName: 'Amidou Ouedraogo',
    agencyId: 'OUA',
    servicePoint: 'Bonheur-Ville',
    status: 'PENDING',
    clientName: 'Souleymane Kaboré',
    clientPhone: '+226 70 12 34 56',
    clientEmail: 'souleymane.k@email.bf',
    clientAddress: '12 Rue de la Liberté, Ouagadougou',
    amount: 2500000,
    duration: 12,
    purpose: 'Extension commerce de détail',
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      incomeStatement: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'h1',
        userId: 'agent1',
        userName: 'Amidou Ouedraogo',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-10T09:30:00Z'
      },
      {
        id: 'h2',
        userId: 'agent1',
        userName: 'Amidou Ouedraogo',
        userRole: 'AGENT',
        action: 'Demande soumise pour validation',
        timestamp: '2025-10-10T10:15:00Z'
      }
    ],
    createdAt: '2025-10-10T09:30:00Z',
    updatedAt: '2025-10-10T10:15:00Z'
  },
  {
    id: 'loan2',
    requestNumber: 'CR-2025-002',
    agentId: 'agent2',
    agentName: 'Fatimata Kabore',
    agencyId: 'OUA',
    servicePoint: 'Kilouin',
    status: 'VALIDATED_BY_MANAGER',
    clientName: 'Aicha Sanogo',
    clientPhone: '+226 71 23 45 67',
    clientEmail: 'aicha.s@email.bf',
    clientAddress: '45 Avenue Kwame Nkrumah, Ouagadougou',
    amount: 1500000,
    duration: 6,
    purpose: 'Achat matériel agricole',
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      incomeStatement: 'uploaded',
      bankStatement: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'h3',
        userId: 'agent2',
        userName: 'Fatimata Kabore',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-09T14:20:00Z'
      },
      {
        id: 'h4',
        userId: 'agent2',
        userName: 'Fatimata Kabore',
        userRole: 'AGENT',
        action: 'Demande soumise',
        timestamp: '2025-10-09T15:00:00Z'
      },
      {
        id: 'h5',
        userId: 'chef1',
        userName: 'Jean Zongo',
        userRole: 'CHEF_AGENCE',
        action: 'Validé par Chef d\'agence',
        comment: 'Dossier complet, bon profil client',
        timestamp: '2025-10-10T08:45:00Z'
      }
    ],
    createdAt: '2025-10-09T14:20:00Z',
    updatedAt: '2025-10-10T08:45:00Z'
  },
  {
    id: 'loan3',
    requestNumber: 'CR-2025-003',
    agentId: 'agent4',
    agentName: 'Paul Coulibaly',
    agencyId: 'BOBO',
    servicePoint: 'Sikassocira',
    status: 'VALIDATED_BY_OPERATIONS',
    clientName: 'Mamadou Touré',
    clientPhone: '+226 72 34 56 78',
    clientEmail: 'mamadou.t@email.bf',
    clientAddress: '23 Route de Sikasso, Bobo-Dioulasso',
    amount: 3000000,
    duration: 18,
    purpose: 'Construction d\'un local commercial',
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      incomeStatement: 'uploaded',
      bankStatement: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'h6',
        userId: 'agent4',
        userName: 'Paul Coulibaly',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-08T10:00:00Z'
      },
      {
        id: 'h7',
        userId: 'chef2',
        userName: 'Anne Diallo',
        userRole: 'CHEF_AGENCE',
        action: 'Validé par Chef d\'agence',
        comment: 'Projet viable, garanties suffisantes',
        timestamp: '2025-10-09T11:30:00Z'
      },
      {
        id: 'h8',
        userId: 'ops1',
        userName: 'Marie Compaore',
        userRole: 'OPERATIONS',
        action: 'Validé par Opérations',
        comment: 'Contrôle conforme, recommandé pour approbation',
        timestamp: '2025-10-10T09:00:00Z'
      }
    ],
    createdAt: '2025-10-08T10:00:00Z',
    updatedAt: '2025-10-10T09:00:00Z'
  },
  {
    id: 'loan4',
    requestNumber: 'CR-2025-004',
    agentId: 'agent6',
    agentName: 'Ibrahim Sawadogo',
    agencyId: 'BANFORA',
    status: 'APPROVED',
    clientName: 'Boukary Soro',
    clientPhone: '+226 73 45 67 89',
    clientEmail: 'boukary.s@email.bf',
    clientAddress: '78 Quartier Résidentiel, Banfora',
    amount: 1000000,
    duration: 12,
    purpose: 'Fonds de roulement commerce',
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      incomeStatement: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'h9',
        userId: 'agent6',
        userName: 'Jean Sawadogo',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-05T09:00:00Z'
      },
      {
        id: 'h10',
        userId: 'chef3',
        userName: 'Michel Konate',
        userRole: 'CHEF_AGENCE',
        action: 'Validé par Chef d\'agence',
        timestamp: '2025-10-06T10:00:00Z'
      },
      {
        id: 'h11',
        userId: 'ops1',
        userName: 'Marie Compaore',
        userRole: 'OPERATIONS',
        action: 'Validé par Opérations',
        timestamp: '2025-10-08T14:00:00Z'
      },
      {
        id: 'h12',
        userId: 'dg1',
        userName: 'Jacques Ouattara',
        userRole: 'DG',
        action: 'APPROUVÉ',
        comment: 'Crédit accordé',
        timestamp: '2025-10-09T16:00:00Z'
      }
    ],
    createdAt: '2025-10-05T09:00:00Z',
    updatedAt: '2025-10-09T16:00:00Z'
  },
  {
    id: 'loan5',
    requestNumber: 'CR-2025-005',
    agentId: 'agent3',
    agentName: 'Joseph Traore',
    agencyId: 'OUA',
    servicePoint: 'Saba',
    status: 'REJECTED',
    clientName: 'Rasmata Kindo',
    clientPhone: '+226 74 56 78 90',
    clientEmail: 'rasmata.k@email.bf',
    clientAddress: '34 Zone Industrielle, Ouagadougou',
    amount: 5000000,
    duration: 24,
    purpose: 'Équipement industriel',
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'h13',
        userId: 'agent3',
        userName: 'Joseph Traore',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-07T11:00:00Z'
      },
      {
        id: 'h14',
        userId: 'chef1',
        userName: 'Jean Zongo',
        userRole: 'CHEF_AGENCE',
        action: 'REJETÉ',
        comment: 'Dossier incomplet, garanties insuffisantes',
        timestamp: '2025-10-08T09:30:00Z'
      }
    ],
    createdAt: '2025-10-07T11:00:00Z',
    updatedAt: '2025-10-08T09:30:00Z'
  }
];

export const MOCK_CHEQUES: Cheque[] = [
  {
    id: 'chq1',
    chequeNumber: '001234567',
    clientName: 'Souleymane Kaboré',
    amount: 250000,
    date: '2025-10-15',
    agencyId: 'OUA',
    servicePoint: 'Bonheur-Ville',
    status: 'ACTIVE',
    scannedDocument: 'cheque_scan_1.pdf'
  },
  {
    id: 'chq2',
    chequeNumber: '001234568',
    clientName: 'Aicha Sanogo',
    amount: 150000,
    date: '2025-10-20',
    agencyId: 'OUA',
    servicePoint: 'Kilouin',
    status: 'ACTIVE',
    scannedDocument: 'cheque_scan_2.pdf'
  },
  {
    id: 'chq3',
    chequeNumber: '002345678',
    clientName: 'Mamadou Touré',
    amount: 500000,
    date: '2025-10-12',
    agencyId: 'BOBO',
    servicePoint: 'Sikassocira',
    status: 'CASHED',
    scannedDocument: 'cheque_scan_3.pdf'
  },
  {
    id: 'chq4',
    chequeNumber: '003456789',
    clientName: 'Boukary Soro',
    amount: 100000,
    date: '2025-10-18',
    agencyId: 'BANFORA',
    status: 'ACTIVE',
    scannedDocument: 'cheque_scan_4.pdf'
  }
];

export const MOCK_ACTIVE_CREDITS: ActiveCredit[] = [
  {
    id: 'credit1',
    loanRequestId: 'loan4',
    requestNumber: 'CR-2025-004',
    clientName: 'Boukary Soro',
    clientPhone: '+226 73 45 67 89',
    agentId: 'agent6',
    agentName: 'Ibrahim Sawadogo',
    agencyId: 'BANFORA',
    totalAmount: 1100000, // 1M + 10% épargne
    duration: 12,
    interestRate: 1.25,
    monthlyPayment: 95833,
    amountPaid: 383332, // 4 paiements
    amountRemaining: 716668,
    paymentsCompleted: 4,
    paymentsRemaining: 8,
    startDate: '2025-10-10',
    nextPaymentDate: '2025-11-10',
    endDate: '2026-10-10',
    status: 'CURRENT',
    daysOverdue: 0,
    payments: [
      {
        id: 'pay1',
        creditId: 'credit1',
        amount: 95833,
        date: '2025-10-10',
        method: 'Espèces',
        reference: 'PAY-001',
        recordedBy: 'agent6'
      },
      {
        id: 'pay2',
        creditId: 'credit1',
        amount: 95833,
        date: '2025-10-25',
        method: 'Mobile Money',
        reference: 'PAY-002',
        recordedBy: 'agent6'
      },
      {
        id: 'pay3',
        creditId: 'credit1',
        amount: 95833,
        date: '2025-11-10',
        method: 'Espèces',
        reference: 'PAY-003',
        recordedBy: 'agent6'
      },
      {
        id: 'pay4',
        creditId: 'credit1',
        amount: 95833,
        date: '2025-11-25',
        method: 'Virement',
        reference: 'PAY-004',
        recordedBy: 'agent6'
      }
    ],
    contractPdfUrl: '/contracts/CR-2025-004.pdf'
  },
  {
    id: 'credit2',
    loanRequestId: 'loan1',
    requestNumber: 'CR-2025-001',
    clientName: 'Souleymane Kaboré',
    clientPhone: '+226 70 12 34 56',
    agentId: 'agent1',
    agentName: 'Amidou Ouedraogo',
    agencyId: 'OUA',
    servicePoint: 'Bonheur-Ville',
    totalAmount: 2750000,
    duration: 12,
    interestRate: 1.25,
    monthlyPayment: 235416,
    amountPaid: 470832,
    amountRemaining: 2279168,
    paymentsCompleted: 2,
    paymentsRemaining: 10,
    startDate: '2025-10-15',
    nextPaymentDate: '2025-12-15',
    endDate: '2026-10-15',
    status: 'CURRENT',
    daysOverdue: 0,
    payments: [
      {
        id: 'pay5',
        creditId: 'credit2',
        amount: 235416,
        date: '2025-10-15',
        method: 'Espèces',
        reference: 'PAY-005',
        recordedBy: 'agent1'
      },
      {
        id: 'pay6',
        creditId: 'credit2',
        amount: 235416,
        date: '2025-11-15',
        method: 'Mobile Money',
        reference: 'PAY-006',
        recordedBy: 'agent1'
      }
    ],
    contractPdfUrl: '/contracts/CR-2025-001.pdf'
  },
  {
    id: 'credit3',
    loanRequestId: 'loan2',
    requestNumber: 'CR-2025-002',
    clientName: 'Aicha Sanogo',
    clientPhone: '+226 71 23 45 67',
    agentId: 'agent2',
    agentName: 'Fatimata Kabore',
    agencyId: 'OUA',
    servicePoint: 'Kilouin',
    totalAmount: 1650000,
    duration: 6,
    interestRate: 1.25,
    monthlyPayment: 286875,
    amountPaid: 860625,
    amountRemaining: 789375,
    paymentsCompleted: 3,
    paymentsRemaining: 3,
    startDate: '2025-09-01',
    nextPaymentDate: '2025-12-01',
    endDate: '2026-03-01',
    status: 'CURRENT',
    daysOverdue: 0,
    payments: [
      {
        id: 'pay7',
        creditId: 'credit3',
        amount: 286875,
        date: '2025-09-01',
        method: 'Espèces',
        reference: 'PAY-007',
        recordedBy: 'agent2'
      },
      {
        id: 'pay8',
        creditId: 'credit3',
        amount: 286875,
        date: '2025-10-01',
        method: 'Espèces',
        reference: 'PAY-008',
        recordedBy: 'agent2'
      },
      {
        id: 'pay9',
        creditId: 'credit3',
        amount: 286875,
        date: '2025-11-01',
        method: 'Mobile Money',
        reference: 'PAY-009',
        recordedBy: 'agent2'
      }
    ],
    contractPdfUrl: '/contracts/CR-2025-002.pdf'
  }
];

export const MOCK_SAVINGS: Savings[] = [
  {
    id: 'sav1',
    accountNumber: 'EP-2025-001',
    clientName: 'Souleymane Kaboré',
    clientPhone: '+226 70 12 34 56',
    clientEmail: 'souleymane.k@email.bf',
    agencyId: 'OUA',
    servicePoint: 'Bonheur-Ville',
    type: 'MONTHLY',
    totalSaved: 450000,
    currentBalance: 450000,
    targetAmount: 1000000,
    openedDate: '2025-01-15',
    lastDepositDate: '2025-10-15',
    maturityDate: '2026-01-15',
    status: 'ACTIVE',
    deposits: [
      {
        id: 'dep1',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-01-15',
        method: 'Espèces',
        reference: 'DEP-001',
        recordedBy: 'agent1'
      },
      {
        id: 'dep2',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-02-15',
        method: 'Espèces',
        reference: 'DEP-002',
        recordedBy: 'agent1'
      },
      {
        id: 'dep3',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-03-15',
        method: 'Mobile Money',
        reference: 'DEP-003',
        recordedBy: 'agent1'
      },
      {
        id: 'dep4',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-04-15',
        method: 'Espèces',
        reference: 'DEP-004',
        recordedBy: 'agent1'
      },
      {
        id: 'dep5',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-05-15',
        method: 'Espèces',
        reference: 'DEP-005',
        recordedBy: 'agent1'
      },
      {
        id: 'dep6',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-06-15',
        method: 'Mobile Money',
        reference: 'DEP-006',
        recordedBy: 'agent1'
      },
      {
        id: 'dep7',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-07-15',
        method: 'Espèces',
        reference: 'DEP-007',
        recordedBy: 'agent1'
      },
      {
        id: 'dep8',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-08-15',
        method: 'Espèces',
        reference: 'DEP-008',
        recordedBy: 'agent1'
      },
      {
        id: 'dep9',
        savingsId: 'sav1',
        amount: 50000,
        date: '2025-09-15',
        method: 'Mobile Money',
        reference: 'DEP-009',
        recordedBy: 'agent1'
      }
    ],
    withdrawals: []
  },
  {
    id: 'sav2',
    accountNumber: 'EP-2025-002',
    clientName: 'Aicha Sanogo',
    clientPhone: '+226 71 23 45 67',
    clientEmail: 'aicha.s@email.bf',
    agencyId: 'OUA',
    servicePoint: 'Kilouin',
    type: 'PROJECT',
    totalSaved: 800000,
    currentBalance: 650000,
    targetAmount: 2000000,
    openedDate: '2025-03-01',
    lastDepositDate: '2025-10-01',
    maturityDate: '2026-09-01',
    status: 'ACTIVE',
    deposits: [
      {
        id: 'dep10',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-03-01',
        method: 'Virement',
        reference: 'DEP-010',
        recordedBy: 'agent2'
      },
      {
        id: 'dep11',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-04-01',
        method: 'Virement',
        reference: 'DEP-011',
        recordedBy: 'agent2'
      },
      {
        id: 'dep12',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-05-01',
        method: 'Virement',
        reference: 'DEP-012',
        recordedBy: 'agent2'
      },
      {
        id: 'dep13',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-06-01',
        method: 'Espèces',
        reference: 'DEP-013',
        recordedBy: 'agent2'
      },
      {
        id: 'dep14',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-07-01',
        method: 'Virement',
        reference: 'DEP-014',
        recordedBy: 'agent2'
      },
      {
        id: 'dep15',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-08-01',
        method: 'Virement',
        reference: 'DEP-015',
        recordedBy: 'agent2'
      },
      {
        id: 'dep16',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-09-01',
        method: 'Espèces',
        reference: 'DEP-016',
        recordedBy: 'agent2'
      },
      {
        id: 'dep17',
        savingsId: 'sav2',
        amount: 100000,
        date: '2025-10-01',
        method: 'Virement',
        reference: 'DEP-017',
        recordedBy: 'agent2'
      }
    ],
    withdrawals: [
      {
        id: 'with1',
        savingsId: 'sav2',
        amount: 150000,
        date: '2025-08-15',
        reason: 'Urgence médicale',
        approvedBy: 'chef1',
        recordedBy: 'agent2'
      }
    ]
  },
  {
    id: 'sav3',
    accountNumber: 'EP-2025-003',
    clientName: 'Mamadou Touré',
    clientPhone: '+226 72 34 56 78',
    clientEmail: 'mamadou.t@email.bf',
    agencyId: 'BOBO',
    servicePoint: 'Sikassocira',
    type: 'VOLUNTARY',
    totalSaved: 1200000,
    currentBalance: 1200000,
    openedDate: '2025-01-10',
    lastDepositDate: '2025-10-10',
    status: 'ACTIVE',
    deposits: [
      {
        id: 'dep18',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-01-10',
        method: 'Virement',
        reference: 'DEP-018',
        recordedBy: 'agent4'
      },
      {
        id: 'dep19',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-02-10',
        method: 'Virement',
        reference: 'DEP-019',
        recordedBy: 'agent4'
      },
      {
        id: 'dep20',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-03-10',
        method: 'Virement',
        reference: 'DEP-020',
        recordedBy: 'agent4'
      },
      {
        id: 'dep21',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-04-10',
        method: 'Espèces',
        reference: 'DEP-021',
        recordedBy: 'agent4'
      },
      {
        id: 'dep22',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-05-10',
        method: 'Virement',
        reference: 'DEP-022',
        recordedBy: 'agent4'
      },
      {
        id: 'dep23',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-06-10',
        method: 'Virement',
        reference: 'DEP-023',
        recordedBy: 'agent4'
      },
      {
        id: 'dep24',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-07-10',
        method: 'Espèces',
        reference: 'DEP-024',
        recordedBy: 'agent4'
      },
      {
        id: 'dep25',
        savingsId: 'sav3',
        amount: 150000,
        date: '2025-08-10',
        method: 'Virement',
        reference: 'DEP-025',
        recordedBy: 'agent4'
      }
    ],
    withdrawals: []
  }
];

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc1',
    accountNumber: 'FINEC-2025-001',
    agentId: 'agent1',
    agentName: 'Pierre Ouedraogo',
    agencyId: 'OUA',
    servicePoint: 'Bonheur-Ville',
    status: 'APPROVED',
    accountType: 'INDIVIDUAL',
    clientName: 'Emmanuel Zoungrana',
    clientPhone: '+226 70 11 22 33',
    clientEmail: 'emmanuel.z@email.bf',
    clientAddress: '15 Avenue de l\'Indépendance, Ouagadougou',
    clientBirthDate: '1985-05-15',
    clientIdNumber: 'CNI-001234567',
    clientProfession: 'Commerçant',
    initialDeposit: 50000,
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      photo: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'acc_h1',
        userId: 'agent1',
        userName: 'Pierre Ouedraogo',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-01T09:00:00Z'
      },
      {
        id: 'acc_h2',
        userId: 'agent1',
        userName: 'Pierre Ouedraogo',
        userRole: 'AGENT',
        action: 'Demande soumise',
        timestamp: '2025-10-01T10:00:00Z'
      },
      {
        id: 'acc_h3',
        userId: 'chef1',
        userName: 'Honoré Zongo',
        userRole: 'CHEF_AGENCE',
        action: 'Validé par Chef d\'agence',
        comment: 'Dossier conforme',
        timestamp: '2025-10-02T11:00:00Z'
      },
      {
        id: 'acc_h4',
        userId: 'ops1',
        userName: 'Marie Compaore',
        userRole: 'OPERATIONS',
        action: 'Validé par Opérations',
        comment: 'Vérifications complètes',
        timestamp: '2025-10-03T14:00:00Z'
      },
      {
        id: 'acc_h5',
        userId: 'dg1',
        userName: 'Jacques Ouattara',
        userRole: 'DG',
        action: 'APPROUVÉ - Compte ouvert',
        comment: 'Compte activé',
        timestamp: '2025-10-04T09:00:00Z'
      }
    ],
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-10-04T09:00:00Z',
    approvedAt: '2025-10-04T09:00:00Z'
  },
  {
    id: 'acc2',
    accountNumber: 'FINEC-2025-002',
    agentId: 'agent2',
    agentName: 'Marie Kabore',
    agencyId: 'OUA',
    servicePoint: 'Kilouin',
    status: 'PENDING',
    accountType: 'JOINT',
    clientName: 'Catherine Ouattara',
    clientPhone: '+226 71 22 33 44',
    clientEmail: 'catherine.o@email.bf',
    clientAddress: '28 Rue des Palmiers, Ouagadougou',
    clientBirthDate: '1990-08-22',
    clientIdNumber: 'CNI-002345678',
    clientProfession: 'Enseignante',
    secondHolderName: 'Marc Ouattara',
    secondHolderPhone: '+226 72 33 44 55',
    secondHolderEmail: 'marc.o@email.bf',
    secondHolderIdNumber: 'CNI-003456789',
    initialDeposit: 100000,
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      photo: 'uploaded',
      secondHolderIdentity: 'uploaded'
    },
    signature: 'signed',
    secondHolderSignature: 'signed',
    history: [
      {
        id: 'acc_h6',
        userId: 'agent2',
        userName: 'Marie Kabore',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-30T10:00:00Z'
      },
      {
        id: 'acc_h7',
        userId: 'agent2',
        userName: 'Marie Kabore',
        userRole: 'AGENT',
        action: 'Demande soumise',
        timestamp: '2025-10-30T11:00:00Z'
      }
    ],
    createdAt: '2025-10-30T10:00:00Z',
    updatedAt: '2025-10-30T11:00:00Z'
  },
  {
    id: 'acc3',
    accountNumber: 'FINEC-2025-003',
    agentId: 'agent4',
    agentName: 'Paul Coulibaly',
    agencyId: 'BOBO',
    servicePoint: 'Sikassocira',
    status: 'VALIDATED_BY_MANAGER',
    accountType: 'BUSINESS',
    clientName: 'François Kambou',
    clientPhone: '+226 73 44 55 66',
    clientEmail: 'francois.k@email.bf',
    clientAddress: '45 Boulevard Commercial, Bobo-Dioulasso',
    clientBirthDate: '1978-03-10',
    clientIdNumber: 'CNI-004567890',
    clientProfession: 'Entrepreneur',
    businessName: 'KAMBOU SARL',
    businessRegistration: 'RCCM-BF-2020-001234',
    initialDeposit: 200000,
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      photo: 'uploaded',
      businessRegistration: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'acc_h8',
        userId: 'agent4',
        userName: 'Paul Coulibaly',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-28T09:00:00Z'
      },
      {
        id: 'acc_h9',
        userId: 'agent4',
        userName: 'Paul Coulibaly',
        userRole: 'AGENT',
        action: 'Demande soumise',
        timestamp: '2025-10-28T10:00:00Z'
      },
      {
        id: 'acc_h10',
        userId: 'chef2',
        userName: 'Anne Diallo',
        userRole: 'CHEF_AGENCE',
        action: 'Validé par Chef d\'agence',
        comment: 'Documentation complète, entreprise vérifiée',
        timestamp: '2025-10-29T14:00:00Z'
      }
    ],
    createdAt: '2025-10-28T09:00:00Z',
    updatedAt: '2025-10-29T14:00:00Z'
  },
  {
    id: 'acc4',
    accountNumber: 'FINEC-2025-004',
    agentId: 'agent6',
    agentName: 'Jean Sawadogo',
    agencyId: 'BANFORA',
    status: 'VALIDATED_BY_OPERATIONS',
    accountType: 'INDIVIDUAL',
    clientName: 'Martine Compaoré',
    clientPhone: '+226 74 55 66 77',
    clientEmail: 'martine.c@email.bf',
    clientAddress: '12 Quartier Résidentiel, Banfora',
    clientBirthDate: '1992-11-18',
    clientIdNumber: 'CNI-005678901',
    clientProfession: 'Infirmière',
    initialDeposit: 75000,
    documents: {
      identityCard: 'uploaded',
      proofOfAddress: 'uploaded',
      photo: 'uploaded'
    },
    signature: 'signed',
    history: [
      {
        id: 'acc_h11',
        userId: 'agent6',
        userName: 'Jean Sawadogo',
        userRole: 'AGENT',
        action: 'Demande créée',
        timestamp: '2025-10-25T08:00:00Z'
      },
      {
        id: 'acc_h12',
        userId: 'agent6',
        userName: 'Jean Sawadogo',
        userRole: 'AGENT',
        action: 'Demande soumise',
        timestamp: '2025-10-25T09:00:00Z'
      },
      {
        id: 'acc_h13',
        userId: 'chef3',
        userName: 'Michel Konate',
        userRole: 'CHEF_AGENCE',
        action: 'Validé par Chef d\'agence',
        comment: 'Profil client solide',
        timestamp: '2025-10-26T10:00:00Z'
      },
      {
        id: 'acc_h14',
        userId: 'ops1',
        userName: 'Marie Compaore',
        userRole: 'OPERATIONS',
        action: 'Validé par Opérations',
        comment: 'Contrôle documentaire conforme',
        timestamp: '2025-10-29T15:00:00Z'
      }
    ],
    createdAt: '2025-10-25T08:00:00Z',
    updatedAt: '2025-10-29T15:00:00Z'
  }
];
