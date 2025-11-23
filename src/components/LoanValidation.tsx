import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, User, Phone, Mail, Banknote, Calendar, FileText, CheckCircle2, XCircle, AlertTriangle, FileSignature } from 'lucide-react';
import { LoanRequest } from '../lib/types';
import { ContractTemplate } from './ContractTemplate';

export function LoanValidation({ loan, onBack }: { loan: LoanRequest; onBack: () => void }) {
  const { currentUser, updateLoanRequest } = useApp();
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showContract, setShowContract] = useState(false);

  if (!currentUser) return null;

  const canValidate = () => {
    if (currentUser.role === 'CHEF_AGENCE' && loan.status === 'PENDING') return true;
    if (currentUser.role === 'OPERATIONS' && loan.status === 'VALIDATED_BY_MANAGER') return true;
    if (currentUser.role === 'DG' && loan.status === 'VALIDATED_BY_OPERATIONS') return true;
    return false;
  };

  const canReject = () => {
    return canValidate();
  };

  const handleApprove = () => {
    setProcessing(true);
    
    const newStatus = 
      currentUser.role === 'CHEF_AGENCE' ? 'VALIDATED_BY_MANAGER' :
      currentUser.role === 'OPERATIONS' ? 'VALIDATED_BY_OPERATIONS' :
      currentUser.role === 'DG' ? 'APPROVED' : loan.status;

    const action = 
      currentUser.role === 'CHEF_AGENCE' ? 'Validé par Chef d\'agence' :
      currentUser.role === 'OPERATIONS' ? 'Validé par Service Opérations' :
      currentUser.role === 'DG' ? 'APPROUVÉ par Direction Générale' : 'Validé';

    updateLoanRequest(loan.id, {
      status: newStatus,
      history: [
        ...loan.history,
        {
          id: `h${Date.now()}`,
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userRole: currentUser.role,
          action,
          comment: comment || undefined,
          timestamp: new Date().toISOString()
        }
      ]
    });

    setTimeout(() => {
      setProcessing(false);
      onBack();
    }, 500);
  };

  const handleReject = () => {
    if (!comment.trim()) {
      alert('Veuillez fournir un motif de rejet');
      return;
    }

    setProcessing(true);

    updateLoanRequest(loan.id, {
      status: 'REJECTED',
      history: [
        ...loan.history,
        {
          id: `h${Date.now()}`,
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userRole: currentUser.role,
          action: 'REJETÉ',
          comment,
          timestamp: new Date().toISOString()
        }
      ]
    });

    setTimeout(() => {
      setProcessing(false);
      onBack();
    }, 500);
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
            Voir le contrat
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
                    Agent: {loan.agentName} • {loan.servicePoint || 'Agence principale'}
                  </div>
                </div>
                <Badge className={statusColors[loan.status]}>
                  {statusLabels[loan.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {canValidate() && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Cette demande nécessite votre validation en tant que {currentUser.role === 'CHEF_AGENCE' ? 'Chef d\'Agence' : currentUser.role === 'OPERATIONS' ? 'Service Opérations' : 'Direction Générale'}
                  </AlertDescription>
                </Alert>
              )}

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
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Détails du crédit</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-sm text-slate-500">Montant</div>
                        <div className="text-xl">{loan.amount.toLocaleString()} FCFA</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-sm text-slate-500">Durée</div>
                        <div className="text-xl">{loan.duration} mois</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Objet du crédit</div>
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
                      <div key={doc.key} className={`flex items-center gap-2 p-3 rounded-lg border ${uploaded ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}>
                        {uploaded ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300" />
                        )}
                        <span className="text-sm">{doc.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {canValidate() && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="comment">Commentaire (optionnel pour validation, requis pour rejet)</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ajoutez un commentaire sur cette demande..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={processing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {currentUser.role === 'DG' ? 'Approuver définitivement' : 'Valider et transférer'}
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={processing}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Workflow & History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow de validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { role: 'Agent', status: 'PENDING', label: 'Création' },
                  { role: 'Chef d\'agence', status: 'VALIDATED_BY_MANAGER', label: 'Validation Chef' },
                  { role: 'Opérations', status: 'VALIDATED_BY_OPERATIONS', label: 'Contrôle Opérations' },
                  { role: 'Direction Générale', status: 'APPROVED', label: 'Décision finale' }
                ].map((step, index) => {
                  const isCompleted = 
                    (step.status === 'PENDING') ||
                    (step.status === 'VALIDATED_BY_MANAGER' && ['VALIDATED_BY_MANAGER', 'VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(loan.status)) ||
                    (step.status === 'VALIDATED_BY_OPERATIONS' && ['VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(loan.status)) ||
                    (step.status === 'APPROVED' && loan.status === 'APPROVED');

                  const isRejected = loan.status === 'REJECTED';

                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isRejected ? 'bg-red-100' :
                        isCompleted ? 'bg-green-500' : 'bg-slate-200'
                      }`}>
                        {isCompleted && !isRejected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className={isCompleted && !isRejected ? '' : 'text-slate-500'}>
                          {step.label}
                        </div>
                        <div className="text-sm text-slate-400">{step.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

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
                          {entry.userName}
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
        </div>
      </div>
    </div>
  );
}
