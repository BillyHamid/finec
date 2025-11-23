import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, Clock, CheckCircle2, TrendingUp, Filter, UserPlus, Users, Building } from 'lucide-react';
import { LoanRequest, Account } from '../lib/types';
import { LoanValidation } from './LoanValidation';
import { AccountValidation } from './AccountValidation';
import { AGENCIES } from '../lib/data';

export function DashboardOperations() {
  const { loanRequests, accounts } = useApp();
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [filterAgency, setFilterAgency] = useState<string>('all');

  // Filter by agency if selected
  let filteredRequests = loanRequests;
  if (filterAgency !== 'all') {
    filteredRequests = loanRequests.filter(req => req.agencyId === filterAgency);
  }

  const pendingRequests = filteredRequests.filter(r => r.status === 'VALIDATED_BY_MANAGER');
  const processedRequests = filteredRequests.filter(r => 
    r.status === 'VALIDATED_BY_OPERATIONS' || 
    r.status === 'APPROVED'
  );
  const allValidatedRequests = filteredRequests.filter(r => 
    r.status === 'VALIDATED_BY_MANAGER' || 
    r.status === 'VALIDATED_BY_OPERATIONS' || 
    r.status === 'APPROVED'
  );

  const stats = {
    total: allValidatedRequests.length,
    pending: pendingRequests.length,
    processed: processedRequests.length,
    totalAmount: allValidatedRequests.reduce((sum, req) => sum + req.amount, 0)
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

  // Filter accounts by agency if selected
  let filteredAccounts = accounts;
  if (filterAgency !== 'all') {
    filteredAccounts = accounts.filter(acc => acc.agencyId === filterAgency);
  }

  const pendingAccounts = filteredAccounts.filter(a => a.status === 'VALIDATED_BY_MANAGER');
  const processedAccounts = filteredAccounts.filter(a => 
    a.status === 'VALIDATED_BY_OPERATIONS' || 
    a.status === 'APPROVED'
  );
  const allValidatedAccounts = filteredAccounts.filter(a => 
    a.status === 'VALIDATED_BY_MANAGER' || 
    a.status === 'VALIDATED_BY_OPERATIONS' || 
    a.status === 'APPROVED'
  );

  const accountStats = {
    total: allValidatedAccounts.length,
    pending: pendingAccounts.length,
    processed: processedAccounts.length
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
          <TableHead>Agence</TableHead>
          <TableHead>Agent</TableHead>
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
          requests.map((request) => {
            const agency = AGENCIES.find(a => a.id === request.agencyId);
            return (
              <TableRow key={request.id}>
                <TableCell>{request.requestNumber}</TableCell>
                <TableCell>
                  <div>{agency?.name}</div>
                  {request.servicePoint && (
                    <div className="text-xs text-slate-500">{request.servicePoint}</div>
                  )}
                </TableCell>
                <TableCell>{request.agentName}</TableCell>
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
                    {request.status === 'VALIDATED_BY_MANAGER' ? 'Traiter' : 'Voir'}
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
          <h1>Service Opérations</h1>
          <p className="text-slate-600 mt-1">Contrôle et validation des demandes</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select value={filterAgency} onValueChange={setFilterAgency}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les agences</SelectItem>
              {AGENCIES.map(agency => (
                <SelectItem key={agency.id} value={agency.id}>{agency.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total demandes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Validées par chefs
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardDescription>À contrôler</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-orange-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Action requise</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Traitées</CardDescription>
            <CardTitle className="text-3xl">{stats.processed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Contrôle effectué</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Montant total</CardDescription>
            <CardTitle className="text-2xl">{(stats.totalAmount / 1000000).toFixed(1)}M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">FCFA</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes de crédit</CardTitle>
          <CardDescription>
            Vue globale de toutes les demandes validées par les chefs d'agence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                À contrôler ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="processed">
                Traitées ({processedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Toutes ({allValidatedRequests.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <RequestsTable requests={pendingRequests} />
            </TabsContent>
            <TabsContent value="processed" className="mt-4">
              <RequestsTable requests={processedRequests} />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <RequestsTable requests={allValidatedRequests} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
