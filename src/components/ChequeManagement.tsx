import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, FileText, Filter, Printer } from 'lucide-react';
import { AGENCIES } from '../lib/data';

export function ChequeManagement() {
  const { cheques } = useApp();
  const [filterAgency, setFilterAgency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  let filteredCheques = cheques;
  
  if (filterAgency !== 'all') {
    filteredCheques = filteredCheques.filter(c => c.agencyId === filterAgency);
  }
  
  if (filterStatus !== 'all') {
    filteredCheques = filteredCheques.filter(c => c.status === filterStatus);
  }

  const stats = {
    total: cheques.length,
    active: cheques.filter(c => c.status === 'ACTIVE').length,
    cashed: cheques.filter(c => c.status === 'CASHED').length,
    bounced: cheques.filter(c => c.status === 'BOUNCED').length,
    totalAmount: filteredCheques.reduce((sum, c) => sum + c.amount, 0)
  };

  const statusLabels = {
    ACTIVE: 'Actif',
    CASHED: 'Encaissé',
    BOUNCED: 'Rejeté',
    CANCELLED: 'Annulé'
  };

  const statusColors = {
    ACTIVE: 'bg-blue-100 text-blue-700',
    CASHED: 'bg-green-100 text-green-700',
    BOUNCED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total chèques</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Tous les chèques
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Actifs</CardDescription>
            <CardTitle className="text-3xl">{stats.active}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-600">
              Non encaissés
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Encaissés</CardDescription>
            <CardTitle className="text-3xl">{stats.cashed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600">
              Traités
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Montant total</CardDescription>
            <CardTitle className="text-2xl">{(stats.totalAmount / 1000000).toFixed(1)}M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              FCFA
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registre des chèques</CardTitle>
              <CardDescription>
                Gestion centralisée des chèques par agence
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={filterAgency} onValueChange={setFilterAgency}>
                <SelectTrigger className="w-48">
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Chèque</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Agence</TableHead>
                <TableHead>Point de service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCheques.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    Aucun chèque trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredCheques.map((cheque) => {
                  const agency = AGENCIES.find(a => a.id === cheque.agencyId);
                  return (
                    <TableRow key={cheque.id}>
                      <TableCell>{cheque.chequeNumber}</TableCell>
                      <TableCell>{cheque.clientName}</TableCell>
                      <TableCell>{cheque.amount.toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        {new Date(cheque.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{agency?.name}</TableCell>
                      <TableCell>{cheque.servicePoint || '-'}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[cheque.status]}>
                          {statusLabels[cheque.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
