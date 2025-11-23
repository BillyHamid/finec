import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, FileText, Clock, CheckCircle2, XCircle, Eye, Banknote, PiggyBank, UserPlus } from 'lucide-react';
import { LoanRequestForm } from './LoanRequestForm';
import { LoanRequestDetail } from './LoanRequestDetail';
import { CreditManagement } from './CreditManagement';
import { SavingsManagement } from './SavingsManagement';
import { AccountManagement } from './AccountManagement';
import { AccountOpeningForm } from './AccountOpeningForm';
import { LoanRequest } from '../lib/types';

export function DashboardAgent() {
  const { currentUser, loanRequests } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);

  if (!currentUser) return null;

  const myRequests = loanRequests.filter(req => req.agentId === currentUser.id);

  const stats = {
    total: myRequests.length,
    pending: myRequests.filter(r => r.status === 'PENDING' || r.status === 'VALIDATED_BY_MANAGER' || r.status === 'VALIDATED_BY_OPERATIONS').length,
    approved: myRequests.filter(r => r.status === 'APPROVED').length,
    rejected: myRequests.filter(r => r.status === 'REJECTED').length
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

  if (selectedLoan) {
    return <LoanRequestDetail loan={selectedLoan} onBack={() => setSelectedLoan(null)} />;
  }

  if (showForm) {
    return <LoanRequestForm onClose={() => setShowForm(false)} />;
  }

  if (showAccountForm) {
    return <AccountOpeningForm onClose={() => setShowAccountForm(false)} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Tableau de bord</h1>
          <p className="text-slate-600 mt-1 text-lg">Gestion de votre portefeuille client</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAccountForm(true)} size="lg" variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Ouvrir un compte
          </Button>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Demande de crédit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="accounts" className="text-base gap-2">
            <UserPlus className="w-4 h-4" />
            Ouverture de compte
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-base gap-2">
            <FileText className="w-4 h-4" />
            Demandes de crédit
          </TabsTrigger>
          <TabsTrigger value="credits" className="text-base gap-2">
            <Banknote className="w-4 h-4" />
            Suivi des crédits
          </TabsTrigger>
          <TabsTrigger value="savings" className="text-base gap-2">
            <PiggyBank className="w-4 h-4" />
            Épargne
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <AccountManagement />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* Existing dashboard content */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total demandes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-slate-600">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Toutes vos demandes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>En cours</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-yellow-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">En validation</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approuvées</CardDescription>
            <CardTitle className="text-3xl">{stats.approved}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Crédits accordés</span>
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

      <Card>
        <CardHeader>
          <CardTitle>Mes demandes de crédit</CardTitle>
          <CardDescription>
            Liste de toutes vos demandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Demande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Aucune demande. Créez votre première demande de crédit.
                  </TableCell>
                </TableRow>
              ) : (
                myRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.requestNumber}</TableCell>
                    <TableCell>{request.clientName}</TableCell>
                    <TableCell>{request.amount.toLocaleString()} FCFA</TableCell>
                    <TableCell>{request.duration} mois</TableCell>
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
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="credits">
          <CreditManagement />
        </TabsContent>

        <TabsContent value="savings">
          <SavingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
