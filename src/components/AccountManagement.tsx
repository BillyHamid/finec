import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Eye, Filter, UserPlus, Users, Building, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Account } from '../lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AccountValidation } from './AccountValidation';

export function AccountManagement() {
  const { currentUser, accounts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  if (!currentUser) return null;

  // Filter accounts based on user role
  let filteredAccounts = accounts;
  
  if (currentUser.role === 'AGENT') {
    filteredAccounts = accounts.filter(acc => acc.agentId === currentUser.id);
  } else if (currentUser.role === 'CHEF_AGENCE') {
    filteredAccounts = accounts.filter(acc => acc.agencyId === currentUser.agencyId);
  }

  // Apply search and filters
  filteredAccounts = filteredAccounts.filter(acc => {
    const matchesSearch = acc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acc.clientPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || acc.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || acc.accountType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: accounts.filter(acc => currentUser.role === 'AGENT' ? acc.agentId === currentUser.id : currentUser.role === 'CHEF_AGENCE' ? acc.agencyId === currentUser.agencyId : true).length,
    pending: accounts.filter(acc => (currentUser.role === 'AGENT' ? acc.agentId === currentUser.id : currentUser.role === 'CHEF_AGENCE' ? acc.agencyId === currentUser.agencyId : true) && ['PENDING', 'VALIDATED_BY_MANAGER', 'VALIDATED_BY_OPERATIONS'].includes(acc.status)).length,
    approved: accounts.filter(acc => (currentUser.role === 'AGENT' ? acc.agentId === currentUser.id : currentUser.role === 'CHEF_AGENCE' ? acc.agencyId === currentUser.agencyId : true) && acc.status === 'APPROVED').length,
    rejected: accounts.filter(acc => (currentUser.role === 'AGENT' ? acc.agentId === currentUser.id : currentUser.role === 'CHEF_AGENCE' ? acc.agencyId === currentUser.agencyId : true) && acc.status === 'REJECTED').length
  };

  const statusLabels = {
    PENDING: 'En attente',
    VALIDATED_BY_MANAGER: 'Validé par Chef',
    VALIDATED_BY_OPERATIONS: 'Validé par Opérations',
    APPROVED: 'Compte ouvert',
    REJECTED: 'Rejeté',
    ACTIVE: 'Actif'
  };

  const statusColors = {
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

  if (selectedAccount) {
    return <AccountValidation account={selectedAccount} onBack={() => setSelectedAccount(null)} />;
  }

  // Old detailed view - keeping for reference but replaced by AccountValidation
  const oldDetailedView = selectedAccount && (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => setSelectedAccount(null)} className="mb-4">
              ← Retour à la liste
            </Button>
            <h1 className="text-3xl">Détails du compte</h1>
            <p className="text-slate-600 mt-1 text-lg">
              {selectedAccount.accountNumber}
            </p>
          </div>
          <Badge className={`${statusColors[selectedAccount.status]} px-4 py-2 text-base`}>
            {statusLabels[selectedAccount.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informations du titulaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Type de compte</div>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const Icon = accountTypeIcons[selectedAccount.accountType];
                      return <Icon className="w-4 h-4" />;
                    })()}
                    <span>{accountTypeLabels[selectedAccount.accountType]}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Dépôt initial</div>
                  <div className="mt-1">{selectedAccount.initialDeposit.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Nom complet</div>
                  <div className="mt-1">{selectedAccount.clientName}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Date de naissance</div>
                  <div className="mt-1">{new Date(selectedAccount.clientBirthDate).toLocaleDateString('fr-FR')}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Numéro CNI</div>
                  <div className="mt-1">{selectedAccount.clientIdNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Profession</div>
                  <div className="mt-1">{selectedAccount.clientProfession}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Téléphone</div>
                  <div className="mt-1">{selectedAccount.clientPhone}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Email</div>
                  <div className="mt-1">{selectedAccount.clientEmail}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-slate-600">Adresse</div>
                  <div className="mt-1">{selectedAccount.clientAddress}</div>
                </div>
              </div>

              {selectedAccount.accountType === 'JOINT' && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-base font-medium mb-3">Second titulaire</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-600">Nom complet</div>
                        <div className="mt-1">{selectedAccount.secondHolderName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Numéro CNI</div>
                        <div className="mt-1">{selectedAccount.secondHolderIdNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Téléphone</div>
                        <div className="mt-1">{selectedAccount.secondHolderPhone}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Email</div>
                        <div className="mt-1">{selectedAccount.secondHolderEmail}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedAccount.accountType === 'BUSINESS' && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-base font-medium mb-3">Informations entreprise</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-600">Raison sociale</div>
                        <div className="mt-1">{selectedAccount.businessName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">N° RCCM</div>
                        <div className="mt-1">{selectedAccount.businessRegistration}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedAccount.documents.identityCard && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">Pièce d'identité</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              )}
              {selectedAccount.documents.proofOfAddress && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">Justificatif de domicile</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              )}
              {selectedAccount.documents.photo && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">Photo</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              )}
              {selectedAccount.documents.secondHolderIdentity && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">CNI 2ème titulaire</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              )}
              {selectedAccount.documents.businessRegistration && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">RCCM entreprise</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              )}
              {selectedAccount.signature && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">Signature principale</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              )}
              {selectedAccount.secondHolderSignature && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">Signature secondaire</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historique de validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedAccount.history.map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 p-3 bg-slate-50 rounded">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.userName}</span>
                      <Badge variant="outline" className="text-xs">{entry.userRole}</Badge>
                    </div>
                    <div className="text-sm mt-1">{entry.action}</div>
                    {entry.comment && (
                      <div className="text-sm text-slate-600 mt-1 italic">{entry.comment}</div>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(entry.timestamp).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );

  return oldDetailedView || (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total demandes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-slate-600">
              <UserPlus className="w-4 h-4" />
              <span className="text-sm">Toutes les demandes</span>
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
            <CardDescription>Comptes ouverts</CardDescription>
            <CardTitle className="text-3xl">{stats.approved}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Actifs</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejetés</CardDescription>
            <CardTitle className="text-3xl">{stats.rejected}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">Refusés</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes d'ouverture de compte</CardTitle>
          <CardDescription>
            Gérez les demandes d'ouverture de compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, numéro, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="VALIDATED_BY_MANAGER">Validé Chef</SelectItem>
                <SelectItem value="VALIDATED_BY_OPERATIONS">Validé Opérations</SelectItem>
                <SelectItem value="APPROVED">Compte ouvert</SelectItem>
                <SelectItem value="REJECTED">Rejeté</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les types</SelectItem>
                <SelectItem value="INDIVIDUAL">Individuel</SelectItem>
                <SelectItem value="JOINT">Joint</SelectItem>
                <SelectItem value="BUSINESS">Entreprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Compte</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dépôt initial</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    Aucune demande trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => {
                  const Icon = accountTypeIcons[account.accountType];
                  return (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.accountNumber}</TableCell>
                      <TableCell>
                        <div>{account.clientName}</div>
                        <div className="text-sm text-slate-500">{account.clientPhone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{accountTypeLabels[account.accountType]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{account.initialDeposit.toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(account.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[account.status]}>
                          {statusLabels[account.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAccount(account)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
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
};
