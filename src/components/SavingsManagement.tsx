import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Search, Filter, Eye, Download, Plus, TrendingUp, PiggyBank, CheckCircle2, Pause, XCircle, Banknote, Calendar } from 'lucide-react';
import { MOCK_SAVINGS } from '../lib/data';
import { Savings } from '../lib/types';
import { toast } from 'sonner';

export function SavingsManagement() {
  const [savings, setSavings] = useState<Savings[]>(MOCK_SAVINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSaving, setSelectedSaving] = useState<Savings | null>(null);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('Espèces');

  // Filter savings
  const filteredSavings = savings.filter(saving => {
    const matchesSearch = saving.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saving.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || saving.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || saving.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: savings.length,
    active: savings.filter(s => s.status === 'ACTIVE').length,
    suspended: savings.filter(s => s.status === 'SUSPENDED').length,
    totalSaved: savings.reduce((sum, s) => sum + s.totalSaved, 0),
    currentBalance: savings.reduce((sum, s) => sum + s.currentBalance, 0),
    averageBalance: savings.length > 0 ? savings.reduce((sum, s) => sum + s.currentBalance, 0) / savings.length : 0
  };

  const typeLabels = {
    MONTHLY: 'Mensuelle',
    PROJECT: 'Projet',
    VOLUNTARY: 'Volontaire'
  };

  const typeColors = {
    MONTHLY: 'bg-blue-100 text-blue-700',
    PROJECT: 'bg-purple-100 text-purple-700',
    VOLUNTARY: 'bg-green-100 text-green-700'
  };

  const statusLabels = {
    ACTIVE: 'Actif',
    SUSPENDED: 'Suspendu',
    CLOSED: 'Fermé'
  };

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-700',
    SUSPENDED: 'bg-amber-100 text-amber-700',
    CLOSED: 'bg-slate-100 text-slate-700'
  };

  const handleAddDeposit = () => {
    if (!selectedSaving || !depositAmount) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      toast.error('Montant invalide');
      return;
    }

    const updatedSaving = {
      ...selectedSaving,
      totalSaved: selectedSaving.totalSaved + amount,
      currentBalance: selectedSaving.currentBalance + amount,
      lastDepositDate: new Date().toISOString().split('T')[0],
      deposits: [
        ...selectedSaving.deposits,
        {
          id: `dep${Date.now()}`,
          savingsId: selectedSaving.id,
          amount,
          date: new Date().toISOString().split('T')[0],
          method: depositMethod,
          reference: `DEP-${Date.now()}`,
          recordedBy: 'current_user'
        }
      ]
    };

    setSavings(prev => prev.map(s => s.id === selectedSaving.id ? updatedSaving : s));
    setSelectedSaving(null);
    setShowDepositDialog(false);
    setDepositAmount('');
    toast.success('Dépôt enregistré avec succès');
  };

  const handleDownloadStatement = (saving: Savings) => {
    toast.success(`Relevé téléchargé pour ${saving.clientName}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Gestion de l'Épargne</h1>
          <p className="text-slate-600 mt-1 text-lg">Suivi des comptes d'épargne clients</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle épargne
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Comptes actifs</CardDescription>
            <CardTitle className="text-4xl text-blue-700">{stats.active}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-600">
              <PiggyBank className="w-5 h-5" />
              <span className="text-sm">sur {stats.total} total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Solde total</CardDescription>
            <CardTitle className="text-3xl text-green-700">{(stats.currentBalance / 1000000).toFixed(2)}M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <Banknote className="w-5 h-5" />
              <span className="text-sm">FCFA</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Total épargné</CardDescription>
            <CardTitle className="text-3xl text-purple-700">{(stats.totalSaved / 1000000).toFixed(2)}M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">FCFA collectés</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Solde moyen</CardDescription>
            <CardTitle className="text-3xl text-amber-700">{(stats.averageBalance / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-amber-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">FCFA par compte</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution by Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['MONTHLY', 'PROJECT', 'VOLUNTARY'] as const).map((type) => {
          const count = savings.filter(s => s.type === type).length;
          const total = savings.filter(s => s.type === type).reduce((sum, s) => sum + s.currentBalance, 0);
          return (
            <Card key={type}>
              <CardHeader className="pb-3">
                <CardDescription>Épargne {typeLabels[type]}</CardDescription>
                <CardTitle className="text-2xl">{count} comptes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">
                  Solde: {(total / 1000000).toFixed(2)}M FCFA
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Liste des comptes d'épargne</CardTitle>
          <CardDescription className="text-base">
            Recherchez et gérez les comptes d'épargne
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher par nom de client ou N° de compte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="MONTHLY">Mensuelle</SelectItem>
                  <SelectItem value="PROJECT">Projet</SelectItem>
                  <SelectItem value="VOLUNTARY">Volontaire</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                  <SelectItem value="CLOSED">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all" className="text-base">
                Tous ({filteredSavings.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-base">
                Actifs ({filteredSavings.filter(s => s.status === 'ACTIVE').length})
              </TabsTrigger>
              <TabsTrigger value="suspended" className="text-base">
                Suspendus ({filteredSavings.filter(s => s.status === 'SUSPENDED').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base">N° Compte</TableHead>
                    <TableHead className="text-base">Client</TableHead>
                    <TableHead className="text-base">Type</TableHead>
                    <TableHead className="text-base">Total épargné</TableHead>
                    <TableHead className="text-base">Solde actuel</TableHead>
                    <TableHead className="text-base">Dernier dépôt</TableHead>
                    <TableHead className="text-base">Statut</TableHead>
                    <TableHead className="text-base">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSavings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                        Aucun compte d'épargne trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSavings.map((saving) => (
                      <TableRow key={saving.id}>
                        <TableCell className="font-medium text-base font-mono">{saving.accountNumber}</TableCell>
                        <TableCell>
                          <div className="text-base">{saving.clientName}</div>
                          <div className="text-sm text-slate-500">{saving.clientPhone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeColors[saving.type]}>
                            {typeLabels[saving.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-base">
                          {saving.totalSaved.toLocaleString()} FCFA
                        </TableCell>
                        <TableCell>
                          <div className="text-base font-medium text-green-700">
                            {saving.currentBalance.toLocaleString()} FCFA
                          </div>
                          {saving.targetAmount && (
                            <div className="text-sm text-slate-500">
                              Objectif: {saving.targetAmount.toLocaleString()} FCFA
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-base">
                          {saving.lastDepositDate ? new Date(saving.lastDepositDate).toLocaleDateString('fr-FR') : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[saving.status]}>
                            {statusLabels[saving.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedSaving(saving)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSaving(saving);
                                setShowDepositDialog(true);
                              }}
                              disabled={saving.status !== 'ACTIVE'}
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadStatement(saving)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="active" className="mt-4">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 text-base">
                  {filteredSavings.filter(s => s.status === 'ACTIVE').length} compte(s) d'épargne actif(s)
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="suspended" className="mt-4">
              <Alert className="bg-amber-50 border-amber-200">
                <Pause className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-base">
                  {filteredSavings.filter(s => s.status === 'SUSPENDED').length} compte(s) suspendu(s)
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Enregistrer un dépôt</DialogTitle>
            <DialogDescription className="text-base">
              Client: {selectedSaving?.clientName} - {selectedSaving?.accountNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-base">Montant du dépôt (FCFA)</Label>
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Montant"
                className="h-12 text-base"
              />
              <p className="text-sm text-slate-500">
                Solde actuel: {selectedSaving?.currentBalance.toLocaleString()} FCFA
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-base">Mode de dépôt</Label>
              <Select value={depositMethod} onValueChange={setDepositMethod}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Virement">Virement bancaire</SelectItem>
                  <SelectItem value="Chèque">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowDepositDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddDeposit}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Savings Detail Dialog */}
      {selectedSaving && !showDepositDialog && (
        <Dialog open={!!selectedSaving} onOpenChange={() => setSelectedSaving(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Compte {selectedSaving.accountNumber}</DialogTitle>
              <DialogDescription className="text-base">
                {selectedSaving.clientName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Type d'épargne</CardDescription>
                    <CardTitle className="text-xl">{typeLabels[selectedSaving.type]}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Solde actuel</CardDescription>
                    <CardTitle className="text-xl">{selectedSaving.currentBalance.toLocaleString()} FCFA</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total épargné</CardDescription>
                    <CardTitle className="text-xl">{selectedSaving.totalSaved.toLocaleString()} FCFA</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Historique des dépôts</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Référence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSaving.deposits.slice(-10).reverse().map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell>{new Date(deposit.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="font-medium text-green-700">+{deposit.amount.toLocaleString()} FCFA</TableCell>
                        <TableCell>{deposit.method}</TableCell>
                        <TableCell className="font-mono text-sm">{deposit.reference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedSaving.withdrawals.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-3">Historique des retraits</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Motif</TableHead>
                        <TableHead>Approuvé par</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSaving.withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell>{new Date(withdrawal.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="font-medium text-red-700">-{withdrawal.amount.toLocaleString()} FCFA</TableCell>
                          <TableCell>{withdrawal.reason}</TableCell>
                          <TableCell>{withdrawal.approvedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
