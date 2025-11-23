import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, Clock, CheckCircle2, XCircle, TrendingUp, TrendingDown, BarChart3, Filter, Building2, Users, Banknote, Activity, AlertCircle, Award } from 'lucide-react';
import { LoanRequest } from '../lib/types';
import { LoanValidation } from './LoanValidation';
import { AGENCIES } from '../lib/data';

export function DashboardDG() {
  const { loanRequests, users } = useApp();
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [filterAgency, setFilterAgency] = useState<string>('all');

  // Calculate statistics by agency
  const getAgencyStats = () => {
    return AGENCIES.map(agency => {
      const agencyRequests = loanRequests.filter(req => req.agencyId === agency.id);
      const approved = agencyRequests.filter(r => r.status === 'APPROVED');
      const pending = agencyRequests.filter(r => 
        r.status === 'PENDING' || 
        r.status === 'VALIDATED_BY_MANAGER' || 
        r.status === 'VALIDATED_BY_OPERATIONS'
      );
      const rejected = agencyRequests.filter(r => r.status === 'REJECTED');
      
      return {
        id: agency.id,
        name: agency.name,
        totalRequests: agencyRequests.length,
        approved: approved.length,
        pending: pending.length,
        rejected: rejected.length,
        approvedAmount: approved.reduce((sum, req) => sum + req.amount, 0),
        totalAmount: agencyRequests.reduce((sum, req) => sum + req.amount, 0),
        successRate: agencyRequests.length > 0 ? (approved.length / agencyRequests.length * 100) : 0
      };
    });
  };

  const agencyStats = getAgencyStats();

  // Filter by agency if selected
  let filteredRequests = loanRequests;
  if (filterAgency !== 'all') {
    filteredRequests = loanRequests.filter(req => req.agencyId === filterAgency);
  }

  const pendingRequests = filteredRequests.filter(r => r.status === 'VALIDATED_BY_OPERATIONS');
  const approvedRequests = filteredRequests.filter(r => r.status === 'APPROVED');
  const rejectedRequests = filteredRequests.filter(r => r.status === 'REJECTED');
  const allRequests = filteredRequests.filter(r => 
    r.status === 'VALIDATED_BY_OPERATIONS' || 
    r.status === 'APPROVED' ||
    r.status === 'REJECTED'
  );

  const globalStats = {
    totalRequests: loanRequests.length,
    pending: loanRequests.filter(r => r.status === 'VALIDATED_BY_OPERATIONS').length,
    approved: loanRequests.filter(r => r.status === 'APPROVED').length,
    rejected: loanRequests.filter(r => r.status === 'REJECTED').length,
    approvedAmount: loanRequests.filter(r => r.status === 'APPROVED').reduce((sum, req) => sum + req.amount, 0),
    pendingAmount: loanRequests.filter(r => r.status === 'VALIDATED_BY_OPERATIONS').reduce((sum, req) => sum + req.amount, 0),
    totalAmount: loanRequests.reduce((sum, req) => sum + req.amount, 0),
    averageAmount: loanRequests.length > 0 ? loanRequests.reduce((sum, req) => sum + req.amount, 0) / loanRequests.length : 0,
    successRate: loanRequests.length > 0 ? (loanRequests.filter(r => r.status === 'APPROVED').length / loanRequests.length * 100) : 0
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
    return <LoanValidation loan={selectedLoan} onBack={() => setSelectedLoan(null)} />;
  }

  const RequestsTable = ({ requests }: { requests: LoanRequest[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Demande</TableHead>
          <TableHead>Agence</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Durée</TableHead>
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
                <TableCell className="font-medium">{request.requestNumber}</TableCell>
                <TableCell>
                  <div>{agency?.name}</div>
                  {request.servicePoint && (
                    <div className="text-xs text-slate-500">{request.servicePoint}</div>
                  )}
                </TableCell>
                <TableCell>{request.clientName}</TableCell>
                <TableCell className="font-medium">{request.amount.toLocaleString()} FCFA</TableCell>
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
                    {request.status === 'VALIDATED_BY_OPERATIONS' ? 'Décider' : 'Voir'}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Direction Générale</h1>
          <p className="text-slate-600 mt-1 text-lg">Vue exécutive et décision finale sur les demandes de crédit</p>
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

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Total demandes</CardDescription>
            <CardTitle className="text-4xl">{globalStats.totalRequests}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-600">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Toutes agences</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">À décider</CardDescription>
            <CardTitle className="text-4xl text-red-700">{globalStats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-700">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Décision requise</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Approuvées</CardDescription>
            <CardTitle className="text-4xl text-green-700">{globalStats.approved}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">Crédits accordés</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Taux de réussite</CardDescription>
            <CardTitle className="text-4xl text-amber-700">{globalStats.successRate.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-amber-600">
              <Award className="w-5 h-5" />
              <span className="text-sm">Performance globale</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Montant approuvé</CardDescription>
            <CardTitle className="text-3xl text-purple-700">{(globalStats.approvedAmount / 1000000).toFixed(1)}M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">FCFA décaissés</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Montant en attente</CardDescription>
            <CardTitle className="text-2xl">{(globalStats.pendingAmount / 1000000).toFixed(2)}M FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              {globalStats.pending} demandes à traiter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Montant moyen par crédit</CardDescription>
            <CardTitle className="text-2xl">{(globalStats.averageAmount / 1000).toFixed(0)}K FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Moyenne de {globalStats.totalRequests} demandes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Volume total</CardDescription>
            <CardTitle className="text-2xl">{(globalStats.totalAmount / 1000000).toFixed(2)}M FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Toutes demandes confondues
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agency Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Performance par agence</CardTitle>
          <CardDescription className="text-base">
            Analyse comparative des agences FINEC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base">Agence</TableHead>
                <TableHead className="text-base">Total</TableHead>
                <TableHead className="text-base">Approuvées</TableHead>
                <TableHead className="text-base">En attente</TableHead>
                <TableHead className="text-base">Rejetées</TableHead>
                <TableHead className="text-base">Taux de réussite</TableHead>
                <TableHead className="text-base">Montant approuvé</TableHead>
                <TableHead className="text-base">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencyStats.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell className="font-medium text-base">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-500" />
                      {agency.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-base font-medium">{agency.totalRequests}</TableCell>
                  <TableCell className="text-base">
                    <Badge className="bg-green-100 text-green-700 text-sm">
                      {agency.approved}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-base">
                    <Badge className="bg-yellow-100 text-yellow-700 text-sm">
                      {agency.pending}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-base">
                    <Badge className="bg-red-100 text-red-700 text-sm">
                      {agency.rejected}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-base">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${agency.successRate}%` }}
                        />
                      </div>
                      <span className="font-medium">{agency.successRate.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-base font-medium">
                    {(agency.approvedAmount / 1000000).toFixed(2)}M
                  </TableCell>
                  <TableCell>
                    {agency.successRate >= 70 ? (
                      <Badge className="bg-green-500 text-white text-sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Excellente
                      </Badge>
                    ) : agency.successRate >= 50 ? (
                      <Badge className="bg-blue-500 text-white text-sm">
                        <Activity className="w-3 h-3 mr-1" />
                        Bonne
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500 text-white text-sm">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        À améliorer
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Requests Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestion des demandes</CardTitle>
          <CardDescription className="text-base">
            Décisions finales sur les demandes validées par les Services Opérations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending" className="text-base">
                À décider ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-base">
                Approuvées ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-base">
                Rejetées ({rejectedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="text-base">
                Toutes ({allRequests.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <RequestsTable requests={pendingRequests} />
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <RequestsTable requests={approvedRequests} />
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <RequestsTable requests={rejectedRequests} />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <RequestsTable requests={allRequests} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
