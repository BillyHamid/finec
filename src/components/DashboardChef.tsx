import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, Clock, CheckCircle2, XCircle, Filter, UserPlus, Users, Building } from 'lucide-react';
import { LoanRequest, Account } from '../lib/types';
import { LoanValidation } from './LoanValidation';
import { AccountValidation } from './AccountValidation';
import { AGENCIES } from '../lib/data';

export function DashboardChef() {
  const { currentUser, loanRequests, accounts } = useApp();
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [filterPoint, setFilterPoint] = useState<string>('all');

  if (!currentUser) return null;

  const agency = AGENCIES.find(a => a.id === currentUser.agencyId);
  
  // Get all requests from the agency
  let agencyRequests = loanRequests.filter(req => req.agencyId === currentUser.agencyId);
  
  // Filter by service point if selected
  if (filterPoint !== 'all') {
    agencyRequests = agencyRequests.filter(req => req.servicePoint === filterPoint);
  }

  const pendingRequests = agencyRequests.filter(r => r.status === 'PENDING');
  const validatedRequests = agencyRequests.filter(r => 
    r.status === 'VALIDATED_BY_MANAGER' || 
    r.status === 'VALIDATED_BY_OPERATIONS' || 
    r.status === 'APPROVED'
  );
  const rejectedRequests = agencyRequests.filter(r => r.status === 'REJECTED');

  const stats = {
    total: agencyRequests.length,
    pending: pendingRequests.length,
    validated: validatedRequests.length,
    rejected: rejectedRequests.length
  };

  const statusLabels = {
    DRAFT: 'Brouillon',
    PENDING: 'En attente',
    VALIDATED_BY_MANAGER: 'Validé par Chef',
    VALIDATED_BY_OPERATIONS: 'Validé par Opérations',
    APPROVED: 'Approuvé',
    REJECTED: 'Rejeté'
  };

  const statusColors = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    VALIDATED_BY_MANAGER: 'bg-blue-100 text-blue-700',
    VALIDATED_BY_OPERATIONS: 'bg-purple-100 text-purple-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700'
  };

  // Get all account requests from the agency
  let agencyAccounts = accounts.filter(acc => acc.agencyId === currentUser.agencyId);
  
  // Filter by service point if selected
  if (filterPoint !== 'all') {
    agencyAccounts = agencyAccounts.filter(acc => acc.servicePoint === filterPoint);
  }

  const pendingAccounts = agencyAccounts.filter(a => a.status === 'PENDING');
  const validatedAccounts = agencyAccounts.filter(a => 
    a.status === 'VALIDATED_BY_MANAGER' || 
    a.status === 'VALIDATED_BY_OPERATIONS' || 
    a.status === 'APPROVED'
  );
  const rejectedAccounts = agencyAccounts.filter(a => a.status === 'REJECTED');

  const accountStats = {
    total: agencyAccounts.length,
    pending: pendingAccounts.length,
    validated: validatedAccounts.length,
    rejected: rejectedAccounts.length
  };

  if (selectedLoan) {
    return <LoanValidation loan={selectedLoan} onBack={() => setSelectedLoan(null)} />;
  }

  if (selectedAccount) {
    return <AccountValidation account={selectedAccount} onBack={() => setSelectedAccount(null)} />;
  }

  const accountStatusLabels = {
    PENDING: 'En attente',
    VALIDATED_BY_MANAGER: 'Validé par Chef',
    VALIDATED_BY_OPERATIONS: 'Validé par Opérations',
    APPROVED: 'Compte ouvert',
    REJECTED: 'Rejeté',
    ACTIVE: 'Actif'
  };

  const accountStatusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    VALIDATED_BY_MANAGER: 'bg-blue-100 text-blue-700',
    VALIDATED_BY_OPERATIONS: 'bg-purple-100 text-purple-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ACTIVE: 'bg-emerald-100 text-emerald-700'
  };

  const accountTypeLabels = {
    INDIVIDUAL: 'Individuel',
    JOINT: 'Joint',
    BUSINESS: 'Entreprise'
  };

  const accountTypeIcons = {
    INDIVIDUAL: UserPlus,
    JOINT: Users,
    BUSINESS: Building
  };

  const RequestsTable = ({ requests }: { requests: LoanRequest[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Demande</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Point de service</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-slate-500">
              Aucune demande
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.requestNumber}</TableCell>
              <TableCell>{request.agentName}</TableCell>
              <TableCell>{request.servicePoint || '-'}</TableCell>
              <TableCell>{request.clientName}</TableCell>
              <TableCell>{request.amount.toLocaleString()} FCFA</TableCell>
              <TableCell>
                <Badge className={statusColors[request.status]}>
                  {statusLabels[request.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(request.createdAt).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLoan(request)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {request.status === 'PENDING' ? 'Traiter' : 'Voir'}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const AccountsTable = ({ accounts }: { accounts: Account[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Compte</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Point de service</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Dépôt initial</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-slate-500">
              Aucune demande
            </TableCell>
          </TableRow>
        ) : (
          accounts.map((account) => {
            const Icon = accountTypeIcons[account.accountType];
            return (
              <TableRow key={account.id}>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.agentName}</TableCell>
                <TableCell>{account.servicePoint || '-'}</TableCell>
                <TableCell>{account.clientName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{accountTypeLabels[account.accountType]}</span>
                  </div>
                </TableCell>
                <TableCell>{account.initialDeposit.toLocaleString()} FCFA</TableCell>
                <TableCell>
                  <Badge className={accountStatusColors[account.status]}>
                    {accountStatusLabels[account.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(account.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAccount(account)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {account.status === 'PENDING' ? 'Traiter' : 'Voir'}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tableau de bord Chef d'Agence</h1>
          <p className="text-slate-600 mt-1">Agence {agency?.name}</p>
        </div>
        {agency && agency.servicePoints.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={filterPoint} onValueChange={setFilterPoint}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les points de service</SelectItem>
                {agency.servicePoints.map(point => (
                  <SelectItem key={point} value={point}>{point}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total demandes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Dans votre agence
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <CardDescription>À traiter</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-yellow-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Validation requise</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Validées</CardDescription>
            <CardTitle className="text-3xl">{stats.validated}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Approuvées</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejetées</CardDescription>
            <CardTitle className="text-3xl">{stats.rejected}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">Non approuvées</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="credits" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="credits">Demandes de crédit</TabsTrigger>
          <TabsTrigger value="accounts">Ouverture de compte</TabsTrigger>
        </TabsList>

        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de crédit</CardTitle>
              <CardDescription>
                Gérez les demandes de crédit de votre agence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">
                    En attente ({pendingRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="validated">
                    Validées ({validatedRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejetées ({rejectedRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    Toutes ({agencyRequests.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                  <RequestsTable requests={pendingRequests} />
                </TabsContent>
                <TabsContent value="validated" className="mt-4">
                  <RequestsTable requests={validatedRequests} />
                </TabsContent>
                <TabsContent value="rejected" className="mt-4">
                  <RequestsTable requests={rejectedRequests} />
                </TabsContent>
                <TabsContent value="all" className="mt-4">
                  <RequestsTable requests={agencyRequests} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Demandes d'ouverture de compte</CardTitle>
              <CardDescription>
                Gérez les demandes d'ouverture de compte de votre agence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">
                    En attente ({pendingAccounts.length})
                  </TabsTrigger>
                  <TabsTrigger value="validated">
                    Validées ({validatedAccounts.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejetées ({rejectedAccounts.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    Toutes ({agencyAccounts.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                  <AccountsTable accounts={pendingAccounts} />
                </TabsContent>
                <TabsContent value="validated" className="mt-4">
                  <AccountsTable accounts={validatedAccounts} />
                </TabsContent>
                <TabsContent value="rejected" className="mt-4">
                  <AccountsTable accounts={rejectedAccounts} />
                </TabsContent>
                <TabsContent value="all" className="mt-4">
                  <AccountsTable accounts={agencyAccounts} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
