import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Search, Filter, Eye, Download, Send, CheckCircle2, Clock, AlertTriangle, XCircle, Banknote, Calendar, TrendingUp, Archive, Plus } from 'lucide-react';
import { MOCK_ACTIVE_CREDITS } from '../lib/data';
import { ActiveCredit } from '../lib/types';
import { toast } from 'sonner';

export function CreditManagement() {
  const [credits, setCredits] = useState<ActiveCredit[]>(MOCK_ACTIVE_CREDITS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCredit, setSelectedCredit] = useState<ActiveCredit | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Espèces');

  // Filter credits
  const filteredCredits = credits.filter(credit => {
    const matchesSearch = credit.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.requestNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || credit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: credits.length,
    current: credits.filter(c => c.status === 'CURRENT').length,
    late: credits.filter(c => c.status === 'LATE').length,
    totalOutstanding: credits.reduce((sum, c) => sum + c.amountRemaining, 0),
    totalDisbursed: credits.reduce((sum, c) => sum + c.totalAmount, 0),
    totalCollected: credits.reduce((sum, c) => sum + c.amountPaid, 0)
  };

  const getStatusBadge = (credit: ActiveCredit) => {
    const daysUntilPayment = Math.floor((new Date(credit.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (credit.status === 'LATE' || daysUntilPayment < 0) {
      return <Badge className="bg-red-100 text-red-700"><AlertTriangle className="w-3 h-3 mr-1" />En retard</Badge>;
    } else if (daysUntilPayment <= 3) {
      return <Badge className="bg-orange-100 text-orange-700"><Clock className="w-3 h-3 mr-1" />Proche</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" />À jour</Badge>;
    }
  };

  const handleRecordPayment = () => {
    if (!selectedCredit || !paymentAmount) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedCredit.amountRemaining) {
      toast.error('Montant invalide');
      return;
    }

    // Update credit
    const updatedCredit = {
      ...selectedCredit,
      amountPaid: selectedCredit.amountPaid + amount,
      amountRemaining: selectedCredit.amountRemaining - amount,
      paymentsCompleted: selectedCredit.paymentsCompleted + 1,
      paymentsRemaining: selectedCredit.paymentsRemaining - 1,
      payments: [
        ...selectedCredit.payments,
        {
          id: `pay${Date.now()}`,
          creditId: selectedCredit.id,
          amount,
          date: new Date().toISOString().split('T')[0],
          method: paymentMethod,
          reference: `PAY-${Date.now()}`,
          recordedBy: 'current_user'
        }
      ]
    };

    setCredits(prev => prev.map(c => c.id === selectedCredit.id ? updatedCredit : c));
    setSelectedCredit(null);
    setShowPaymentDialog(false);
    setPaymentAmount('');
    toast.success('Paiement enregistré avec succès');
  };

  const handleSendReminder = (credit: ActiveCredit) => {
    toast.success(`Rappel envoyé à ${credit.clientName} (${credit.clientPhone})`);
  };

  const handleArchive = (credit: ActiveCredit) => {
    if (credit.amountRemaining > 0) {
      toast.error('Impossible d\'archiver un crédit non soldé');
      return;
    }
    setCredits(prev => prev.filter(c => c.id !== credit.id));
    toast.success('Crédit archivé');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Suivi des Crédits</h1>
          <p className="text-slate-600 mt-1 text-lg">Gestion et suivi des remboursements</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Crédits actifs</CardDescription>
            <CardTitle className="text-4xl text-blue-700">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">En cours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">À jour</CardDescription>
            <CardTitle className="text-4xl text-green-700">{stats.current}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">Paiements réguliers</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">En retard</CardDescription>
            <CardTitle className="text-4xl text-red-700">{stats.late}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Nécessite suivi</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Montant restant</CardDescription>
            <CardTitle className="text-3xl text-purple-700">{(stats.totalOutstanding / 1000000).toFixed(2)}M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-purple-600">
              <Banknote className="w-5 h-5" />
              <span className="text-sm">FCFA à recouvrer</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total décaissé</CardDescription>
            <CardTitle className="text-2xl">{(stats.totalDisbursed / 1000000).toFixed(2)}M FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Montant total des crédits actifs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total collecté</CardDescription>
            <CardTitle className="text-2xl">{(stats.totalCollected / 1000000).toFixed(2)}M FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Paiements reçus à ce jour
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Taux de recouvrement</CardDescription>
            <CardTitle className="text-2xl">{((stats.totalCollected / stats.totalDisbursed) * 100).toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Performance de recouvrement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Liste des crédits</CardTitle>
          <CardDescription className="text-base">
            Recherchez et gérez vos crédits actifs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher par nom de client ou N° de crédit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="CURRENT">À jour</SelectItem>
                  <SelectItem value="LATE">En retard</SelectItem>
                  <SelectItem value="COMPLETED">Soldés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all" className="text-base">
                Tous ({filteredCredits.length})
              </TabsTrigger>
              <TabsTrigger value="current" className="text-base">
                À jour ({filteredCredits.filter(c => c.status === 'CURRENT').length})
              </TabsTrigger>
              <TabsTrigger value="late" className="text-base">
                En retard ({filteredCredits.filter(c => c.status === 'LATE').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base">N° Crédit</TableHead>
                    <TableHead className="text-base">Client</TableHead>
                    <TableHead className="text-base">Montant total</TableHead>
                    <TableHead className="text-base">Durée</TableHead>
                    <TableHead className="text-base">Taux</TableHead>
                    <TableHead className="text-base">Remboursé</TableHead>
                    <TableHead className="text-base">Restant</TableHead>
                    <TableHead className="text-base">Prochaine échéance</TableHead>
                    <TableHead className="text-base">Statut</TableHead>
                    <TableHead className="text-base">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                        Aucun crédit trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-medium text-base">{credit.requestNumber}</TableCell>
                        <TableCell>
                          <div className="text-base">{credit.clientName}</div>
                          <div className="text-sm text-slate-500">{credit.clientPhone}</div>
                        </TableCell>
                        <TableCell className="font-medium text-base">
                          {credit.totalAmount.toLocaleString()} FCFA
                        </TableCell>
                        <TableCell className="text-base">{credit.duration} mois</TableCell>
                        <TableCell className="text-base">{credit.interestRate}%</TableCell>
                        <TableCell>
                          <div className="text-base font-medium text-green-700">
                            {credit.amountPaid.toLocaleString()} FCFA
                          </div>
                          <div className="text-sm text-slate-500">
                            {credit.paymentsCompleted}/{credit.duration} paiements
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-base font-medium text-blue-700">
                            {credit.amountRemaining.toLocaleString()} FCFA
                          </div>
                          <div className="text-sm text-slate-500">
                            {credit.paymentsRemaining} restants
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-base">
                            {new Date(credit.nextPaymentDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-slate-500">
                            {Math.floor((new Date(credit.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(credit)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCredit(credit)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCredit(credit);
                                setShowPaymentDialog(true);
                              }}
                            >
                              <Banknote className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendReminder(credit)}
                            >
                              <Send className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(credit.contractPdfUrl, '_blank')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {credit.amountRemaining === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleArchive(credit)}
                              >
                                <Archive className="w-4 h-4 text-slate-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="current" className="mt-4">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 text-base">
                  {filteredCredits.filter(c => c.status === 'CURRENT').length} crédit(s) à jour avec les paiements
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="late" className="mt-4">
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800 text-base">
                  {filteredCredits.filter(c => c.status === 'LATE').length} crédit(s) en retard nécessitent un suivi
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Enregistrer un paiement</DialogTitle>
            <DialogDescription className="text-base">
              Client: {selectedCredit?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-base">Montant du paiement (FCFA)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Montant"
                className="h-12 text-base"
              />
              <p className="text-sm text-slate-500">
                Montant restant: {selectedCredit?.amountRemaining.toLocaleString()} FCFA
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-base">Mode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleRecordPayment}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Detail Dialog */}
      {selectedCredit && !showPaymentDialog && (
        <Dialog open={!!selectedCredit} onOpenChange={() => setSelectedCredit(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Détails du crédit {selectedCredit.requestNumber}</DialogTitle>
              <DialogDescription className="text-base">
                {selectedCredit.clientName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Montant total</CardDescription>
                    <CardTitle className="text-xl">{selectedCredit.totalAmount.toLocaleString()} FCFA</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Mensualité</CardDescription>
                    <CardTitle className="text-xl">{selectedCredit.monthlyPayment.toLocaleString()} FCFA</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Historique des paiements</h4>
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
                    {selectedCredit.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="font-medium">{payment.amount.toLocaleString()} FCFA</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell className="font-mono text-sm">{payment.reference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
