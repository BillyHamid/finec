import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, User, Phone, Mail, MapPin, Banknote, Calendar, FileText, Download, CheckCircle2, XCircle, FileSignature } from 'lucide-react';
import { LoanRequest } from '../lib/types';
import { ContractTemplate } from './ContractTemplate';

export function LoanRequestDetail({ loan, onBack }: { loan: LoanRequest; onBack: () => void }) {
  const { currentUser } = useApp();
  const [showContract, setShowContract] = useState(false);

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

  if (showContract) {
    return <ContractTemplate loan={loan} onBack={() => setShowContract(false)} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        {loan.status === 'APPROVED' && (
          <Button onClick={() => setShowContract(true)}>
            <FileSignature className="w-4 h-4 mr-2" />
            Générer le contrat
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Demande {loan.requestNumber}</CardTitle>
                  <div className="text-sm text-slate-500 mt-1">
                    Créée le {new Date(loan.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <Badge className={statusColors[loan.status]}>
                  {statusLabels[loan.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-4">Informations du client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Nom complet</div>
                      <div>{loan.clientName}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Téléphone</div>
                      <div>{loan.clientPhone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <div>{loan.clientEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Adresse</div>
                      <div>{loan.clientAddress}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Détails du crédit</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Banknote className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Montant demandé</div>
                      <div>{loan.amount.toLocaleString()} FCFA</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Durée</div>
                      <div>{loan.duration} mois</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 col-span-2">
                    <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Objet du crédit</div>
                      <div>{loan.purpose}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Documents justificatifs</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'identityCard', label: 'Pièce d\'identité' },
                    { key: 'proofOfAddress', label: 'Justificatif de domicile' },
                    { key: 'incomeStatement', label: 'Relevé de revenus' },
                    { key: 'bankStatement', label: 'Relevé bancaire' }
                  ].map((doc) => {
                    const uploaded = loan.documents[doc.key as keyof typeof loan.documents];
                    return (
                      <div key={doc.key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {uploaded ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300" />
                          )}
                          <span className="text-sm">{doc.label}</span>
                        </div>
                        {uploaded && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loan.history.map((entry, index) => (
                  <div key={entry.id} className="relative">
                    {index < loan.history.length - 1 && (
                      <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-slate-200" />
                    )}
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 relative z-10" />
                      <div className="flex-1 pb-4">
                        <div>{entry.action}</div>
                        <div className="text-sm text-slate-500 mt-1">
                          Par {entry.userName}
                        </div>
                        {entry.comment && (
                          <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                            {entry.comment}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(entry.timestamp).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-slate-500">Agent</div>
                <div>{loan.agentName}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Point de service</div>
                <div>{loan.servicePoint || 'Agence principale'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
