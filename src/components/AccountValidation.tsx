import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, FileText, CheckCircle2, XCircle, Building, Users, UserPlus, Banknote, IdCard, Briefcase } from 'lucide-react';
import { Account } from '../lib/types';

export function AccountValidation({ account, onBack }: { account: Account; onBack: () => void }) {
  const { currentUser, updateAccount } = useApp();
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!currentUser) return null;

  const canValidate = () => {
    if (currentUser.role === 'CHEF_AGENCE' && account.status === 'PENDING') return true;
    if (currentUser.role === 'OPERATIONS' && account.status === 'VALIDATED_BY_MANAGER') return true;
    if (currentUser.role === 'DG' && account.status === 'VALIDATED_BY_OPERATIONS') return true;
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
      currentUser.role === 'DG' ? 'APPROVED' : account.status;

    const action = 
      currentUser.role === 'CHEF_AGENCE' ? 'Validé par Chef d\'agence' :
      currentUser.role === 'OPERATIONS' ? 'Validé par Service Opérations' :
      currentUser.role === 'DG' ? 'APPROUVÉ - Compte ouvert' : 'Validé';

    updateAccount(account.id, {
      status: newStatus,
      approvedAt: currentUser.role === 'DG' ? new Date().toISOString() : account.approvedAt,
      history: [
        ...account.history,
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

    updateAccount(account.id, {
      status: 'REJECTED',
      history: [
        ...account.history,
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
    INDIVIDUAL: 'Compte Individuel',
    JOINT: 'Compte Joint',
    BUSINESS: 'Compte Entreprise'
  };

  const accountTypeIcons = {
    INDIVIDUAL: UserPlus,
    JOINT: Users,
    BUSINESS: Building
  };

  const TypeIcon = accountTypeIcons[account.accountType];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compte {account.accountNumber}</CardTitle>
                  <div className="text-sm text-slate-500 mt-1">
                    Agent: {account.agentName} • {account.servicePoint || 'Agence principale'}
                  </div>
                </div>
                <Badge className={statusColors[account.status]}>
                  {statusLabels[account.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type de compte */}
              <div>
                <h3 className="text-lg font-medium mb-3">Type de compte</h3>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <TypeIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-medium">{accountTypeLabels[account.accountType]}</div>
                    <div className="text-sm text-slate-600">
                      {account.accountType === 'INDIVIDUAL' && 'Un seul titulaire'}
                      {account.accountType === 'JOINT' && 'Deux titulaires'}
                      {account.accountType === 'BUSINESS' && 'Compte professionnel'}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informations du titulaire principal */}
              <div>
                <h3 className="text-lg font-medium mb-3">Titulaire principal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Nom complet</div>
                      <div className="font-medium">{account.clientName}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Date de naissance</div>
                      <div className="font-medium">
                        {new Date(account.clientBirthDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IdCard className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Numéro CNI</div>
                      <div className="font-medium">{account.clientIdNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Profession</div>
                      <div className="font-medium">{account.clientProfession}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Téléphone</div>
                      <div className="font-medium">{account.clientPhone}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <div className="font-medium">{account.clientEmail}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Adresse</div>
                      <div className="font-medium">{account.clientAddress}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second titulaire pour compte joint */}
              {account.accountType === 'JOINT' && account.secondHolderName && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-3">Second titulaire</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">Nom complet</div>
                          <div className="font-medium">{account.secondHolderName}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <IdCard className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">Numéro CNI</div>
                          <div className="font-medium">{account.secondHolderIdNumber}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">Téléphone</div>
                          <div className="font-medium">{account.secondHolderPhone}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">Email</div>
                          <div className="font-medium">{account.secondHolderEmail || 'Non fourni'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Informations entreprise */}
              {account.accountType === 'BUSINESS' && account.businessName && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-3">Informations de l'entreprise</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">Raison sociale</div>
                          <div className="font-medium">{account.businessName}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">N° RCCM</div>
                          <div className="font-medium">{account.businessRegistration}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Dépôt initial */}
              <div>
                <h3 className="text-lg font-medium mb-3">Informations financières</h3>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Banknote className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-blue-700">Dépôt initial</div>
                    <div className="text-2xl font-medium text-blue-900">
                      {account.initialDeposit.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents fournis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {account.documents.identityCard && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Pièce d'identité</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Fourni</Badge>
                  </div>
                )}

                {account.documents.proofOfAddress && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Justificatif de domicile</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Fourni</Badge>
                  </div>
                )}

                {account.documents.photo && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Photo d'identité</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Fourni</Badge>
                  </div>
                )}

                {account.documents.secondHolderIdentity && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium">CNI du second titulaire</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Fourni</Badge>
                  </div>
                )}

                {account.documents.businessRegistration && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium">RCCM de l'entreprise</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Fourni</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Signatures */}
          <Card>
            <CardHeader>
              <CardTitle>Signatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {account.signature && (
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Signature du titulaire principal</div>
                    <div className="border rounded-lg p-4 bg-slate-50">
                      <img src={account.signature} alt="Signature" className="max-h-32" />
                    </div>
                  </div>
                )}

                {account.secondHolderSignature && (
                  <div>
                    <div className="text-sm text-slate-600 mb-2">Signature du second titulaire</div>
                    <div className="border rounded-lg p-4 bg-slate-50">
                      <img src={account.secondHolderSignature} alt="Signature second titulaire" className="max-h-32" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Validation */}
          {canValidate() && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-700">Action requise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Cette demande d'ouverture de compte nécessite votre validation.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="comment">Commentaire (optionnel)</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajoutez un commentaire..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={handleApprove}
                    disabled={processing}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {currentUser.role === 'DG' ? 'Approuver et ouvrir le compte' : 'Valider'}
                  </Button>

                  {canReject() && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleReject}
                      disabled={processing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status info */}
          {!canValidate() && (
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[account.status]}>
                      {statusLabels[account.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {account.status === 'PENDING' && 'En attente de validation du Chef d\'agence'}
                    {account.status === 'VALIDATED_BY_MANAGER' && 'En attente de validation du Service Opérations'}
                    {account.status === 'VALIDATED_BY_OPERATIONS' && 'En attente d\'approbation de la Direction Générale'}
                    {account.status === 'APPROVED' && 'Compte approuvé et ouvert'}
                    {account.status === 'REJECTED' && 'Demande rejetée'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {account.history.map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{entry.userName}</span>
                        <Badge variant="outline" className="text-xs">{entry.userRole}</Badge>
                      </div>
                      <div className="text-sm mt-1">{entry.action}</div>
                      {entry.comment && (
                        <div className="text-sm text-slate-600 mt-1 italic">
                          &quot;{entry.comment}&quot;
                        </div>
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

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow de validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 ${
                  ['PENDING', 'VALIDATED_BY_MANAGER', 'VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(account.status)
                    ? 'text-green-600'
                    : 'text-slate-400'
                }`}>
                  {['PENDING', 'VALIDATED_BY_MANAGER', 'VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(account.status) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current" />
                  )}
                  <span className="text-sm">Agent de crédit</span>
                </div>

                <div className={`flex items-center gap-3 ${
                  ['VALIDATED_BY_MANAGER', 'VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(account.status)
                    ? 'text-green-600'
                    : account.status === 'PENDING'
                    ? 'text-yellow-600'
                    : 'text-slate-400'
                }`}>
                  {['VALIDATED_BY_MANAGER', 'VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(account.status) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current" />
                  )}
                  <span className="text-sm">Chef d'agence</span>
                </div>

                <div className={`flex items-center gap-3 ${
                  ['VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(account.status)
                    ? 'text-green-600'
                    : account.status === 'VALIDATED_BY_MANAGER'
                    ? 'text-yellow-600'
                    : 'text-slate-400'
                }`}>
                  {['VALIDATED_BY_OPERATIONS', 'APPROVED'].includes(account.status) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current" />
                  )}
                  <span className="text-sm">Service Opérations</span>
                </div>

                <div className={`flex items-center gap-3 ${
                  account.status === 'APPROVED'
                    ? 'text-green-600'
                    : account.status === 'VALIDATED_BY_OPERATIONS'
                    ? 'text-yellow-600'
                    : 'text-slate-400'
                }`}>
                  {account.status === 'APPROVED' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current" />
                  )}
                  <span className="text-sm">Direction Générale</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
