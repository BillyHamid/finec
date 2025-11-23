import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, X, FileText, Eye, Download, Send, Users, User, Lock } from 'lucide-react';
import { AGENCIES } from '../lib/data';
import { ContractTemplate } from './ContractTemplate';
import { ContractGage } from './ContractGage';
import { ReconnaissanceDette } from './ReconnaissanceDette';
import { SignatureCanvas } from './SignatureCanvas';
import { toast } from 'sonner';

interface FormData {
  loanType: 'particulier' | 'groupement';
  firstName: string;
  lastName: string;
  idNumber: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  neighborhood: string;
  phone: string;
  email: string;
  profession: string;
  monthlyIncome: string;
  agencyId: string;
  servicePoint: string;
  amount: string;
  duration: string;
  purpose: string;
  interestRate: string;
  savingsRate: string;
  repaymentMode: string;
  guaranteeType: string;
  identityCard: File | null;
  photo: File | null;
  addressProof: File | null;
  borrowerSignature: string | null;
}

export function LoanRequestForm({ onClose }: { onClose: () => void }) {
  const { currentUser, createLoanRequest } = useApp();
  const [step, setStep] = useState(0);
  const [showContractType, setShowContractType] = useState<'pret' | 'gage' | 'dette' | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    loanType: 'particulier',
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: '',
    birthPlace: '',
    address: '',
    neighborhood: '',
    phone: '',
    email: '',
    profession: '',
    monthlyIncome: '',
    agencyId: currentUser?.agencyId || 'OUA',
    servicePoint: currentUser?.servicePoint || '',
    amount: '',
    duration: '',
    purpose: '',
    interestRate: '1.25',
    savingsRate: '10',
    repaymentMode: 'Mensuel',
    guaranteeType: 'Épargne',
    identityCard: null,
    photo: null,
    addressProof: null,
    borrowerSignature: null
  });

  if (!currentUser) return null;

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;
  const selectedAgency = AGENCIES.find(a => a.id === formData.agencyId);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const removeFile = (field: keyof FormData) => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const validateStep0 = () => formData.loanType === 'particulier';
  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.idNumber && 
           formData.birthDate && formData.address && formData.phone && 
           formData.email && formData.profession && formData.monthlyIncome;
  };
  const validateStep2 = () => formData.amount && formData.duration && formData.purpose;
  const validateStep3 = () => formData.identityCard && formData.photo && formData.addressProof;
  const validateStep4 = () => formData.borrowerSignature;

  const canProceed = () => {
    switch (step) {
      case 0: return validateStep0();
      case 1: return validateStep1();
      case 2: return validateStep2();
      case 3: return validateStep3();
      case 4: return validateStep4();
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setStep(s => Math.min(totalSteps - 1, s + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Veuillez remplir tous les champs obligatoires');
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePreviewLoan = () => {
    return {
      id: 'temp',
      requestNumber: 'PREVIEW',
      agentId: currentUser.id,
      agentName: `${currentUser.firstName} ${currentUser.lastName}`,
      agencyId: formData.agencyId,
      servicePoint: formData.servicePoint,
      status: 'DRAFT' as const,
      clientName: `${formData.firstName} ${formData.lastName}`,
      clientPhone: formData.phone,
      clientEmail: formData.email,
      clientAddress: `${formData.address}, ${formData.neighborhood}`,
      amount: parseFloat(formData.amount),
      duration: parseInt(formData.duration),
      purpose: formData.purpose,
      documents: {
        identityCard: formData.identityCard ? 'uploaded' : undefined,
        proofOfAddress: formData.addressProof ? 'uploaded' : undefined,
        incomeStatement: formData.photo ? 'uploaded' : undefined
      },
      signature: undefined,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSubmit = () => {
    createLoanRequest({
      agentId: currentUser.id,
      agentName: `${currentUser.firstName} ${currentUser.lastName}`,
      agencyId: formData.agencyId,
      servicePoint: formData.servicePoint,
      status: 'PENDING',
      clientName: `${formData.firstName} ${formData.lastName}`,
      clientPhone: formData.phone,
      clientEmail: formData.email,
      clientAddress: `${formData.address}, ${formData.neighborhood}`,
      amount: parseFloat(formData.amount),
      duration: parseInt(formData.duration),
      purpose: formData.purpose,
      documents: {
        identityCard: formData.identityCard ? 'uploaded' : undefined,
        proofOfAddress: formData.addressProof ? 'uploaded' : undefined,
        incomeStatement: formData.photo ? 'uploaded' : undefined
      },
      signature: formData.borrowerSignature || undefined,
      history: [
        {
          id: `h${Date.now()}`,
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userRole: currentUser.role,
          action: 'Demande créée',
          timestamp: new Date().toISOString()
        },
        {
          id: `h${Date.now() + 1}`,
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userRole: currentUser.role,
          action: 'Demande soumise pour validation',
          timestamp: new Date().toISOString()
        }
      ]
    });
    toast.success('Demande de crédit créée avec succès !');
    onClose();
  };

  const handleSaveSignature = (signature: string) => {
    setFormData(prev => ({ ...prev, borrowerSignature: signature }));
    setShowSignatureModal(false);
    toast.success('Signature enregistrée');
  };

  const calculateTotalAmount = () => {
    if (!formData.amount || !formData.duration || !formData.interestRate) return 0;
    const principal = parseFloat(formData.amount);
    const interest = principal * (parseFloat(formData.interestRate) / 100) * parseInt(formData.duration);
    const savings = principal * (parseFloat(formData.savingsRate) / 100);
    return principal + interest + savings;
  };

  if (showContractType) {
    const loan = generatePreviewLoan();
    if (showContractType === 'pret') {
      return <ContractTemplate loan={loan} onBack={() => setShowContractType(null)} />;
    } else if (showContractType === 'gage') {
      return <ContractGage loan={loan} onBack={() => setShowContractType(null)} />;
    } else if (showContractType === 'dette') {
      return <ReconnaissanceDette loan={loan} onBack={() => setShowContractType(null)} />;
    }
  }

  const stepTitles = [
    'Type de Crédit',
    'Identification',
    'Détails du Crédit',
    'Documents KYC',
    'Signature'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div className="text-sm text-slate-600">
            Étape {step + 1} sur {totalSteps}
          </div>
        </div>

        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-5 gap-2">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`text-xs text-center transition-colors ${
                  index === step
                    ? 'text-blue-600 font-medium'
                    : index < step
                    ? 'text-green-600'
                    : 'text-slate-400'
                }`}
              >
                {title}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">{stepTitles[step]}</CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  {step === 0 && 'Sélectionnez le type de crédit'}
                  {step === 1 && 'Informations personnelles'}
                  {step === 2 && 'Caractéristiques du crédit'}
                  {step === 3 && 'Documents justificatifs (KYC)'}
                  {step === 4 && 'Signature et validation'}
                </CardDescription>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                {step + 1}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Step 0: Type Selection */}
            {step === 0 && (
              <div className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    Choisissez le type de crédit adapté à vos besoins
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      formData.loanType === 'particulier'
                        ? 'border-2 border-green-500 bg-green-50'
                        : 'border-2 border-slate-200 hover:border-green-300'
                    }`}
                    onClick={() => handleInputChange('loanType', 'particulier')}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Crédit Particulier</CardTitle>
                            <CardDescription>Pour les besoins individuels</CardDescription>
                          </div>
                        </div>
                        {formData.loanType === 'particulier' && (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Montant : 100K à 5M FCFA
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Durée : 3 à 36 mois
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Taux : 1,25% / mois
                        </li>
                      </ul>
                      <Badge className="mt-4 bg-green-600">Disponible</Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-slate-200 opacity-60 cursor-not-allowed">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Crédit Groupement</CardTitle>
                            <CardDescription>Pour les groupes</CardDescription>
                          </div>
                        </div>
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-400">
                        <li>• Crédit solidaire</li>
                        <li>• Garantie collective</li>
                        <li>• Conditions spéciales</li>
                      </ul>
                      <Badge className="mt-4 bg-amber-500">Bientôt disponible</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 1: Borrower Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="OUEDRAOGO"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Amidou"
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>CNI / Passeport *</Label>
                    <Input
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value)}
                      placeholder="B12345678"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de naissance *</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Lieu de naissance</Label>
                    <Input
                      value={formData.birthPlace}
                      onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                      placeholder="Ouagadougou"
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Adresse *</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="12 Rue de la Liberté"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quartier</Label>
                    <Input
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Ouaga 2000"
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Téléphone *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+226 70 12 34 56"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="client@email.bf"
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Profession *</Label>
                    <Input
                      value={formData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      placeholder="Commerçant"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Revenus mensuels (FCFA) *</Label>
                    <Input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                      placeholder="150000"
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Agence</Label>
                    <Select
                      value={formData.agencyId}
                      onValueChange={(value) => {
                        handleInputChange('agencyId', value);
                        handleInputChange('servicePoint', '');
                      }}
                    >
                      <SelectTrigger className="bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AGENCIES.map(agency => (
                          <SelectItem key={agency.id} value={agency.id}>
                            {agency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedAgency && selectedAgency.servicePoints.length > 0 && (
                    <div className="space-y-2">
                      <Label>Point de service</Label>
                      <Select
                        value={formData.servicePoint}
                        onValueChange={(value) => handleInputChange('servicePoint', value)}
                      >
                        <SelectTrigger className="bg-slate-50">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedAgency.servicePoints.map(point => (
                            <SelectItem key={point} value={point}>
                              {point}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Loan Details */}
            {step === 2 && (
              <div className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    Crédit Particulier - Conditions standards ACFIME
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Montant demandé (FCFA) *</Label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="1000000"
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500">Entre 100 000 et 5 000 000 FCFA</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Durée (mois) *</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => handleInputChange('duration', value)}
                    >
                      <SelectTrigger className="bg-slate-50">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 6, 9, 12, 18, 24, 36].map(months => (
                          <SelectItem key={months} value={months.toString()}>
                            {months} mois
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Objet du prêt *</Label>
                  <Textarea
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="Décrivez l'utilisation prévue du crédit"
                    rows={4}
                    className="bg-slate-50"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Label className="text-green-900">Taux d'intérêt mensuel</Label>
                    <div className="flex items-baseline gap-2 mt-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.interestRate}
                        onChange={(e) => handleInputChange('interestRate', e.target.value)}
                        className="w-24 bg-white"
                      />
                      <span className="text-2xl text-green-700">%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Label className="text-blue-900">Épargne obligatoire</Label>
                    <div className="flex items-baseline gap-2 mt-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.savingsRate}
                        onChange={(e) => handleInputChange('savingsRate', e.target.value)}
                        className="w-24 bg-white"
                      />
                      <span className="text-2xl text-blue-700">%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Mode de remboursement</Label>
                    <Select
                      value={formData.repaymentMode}
                      onValueChange={(value) => handleInputChange('repaymentMode', value)}
                    >
                      <SelectTrigger className="bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mensuel">Mensuel</SelectItem>
                        <SelectItem value="Trimestriel">Trimestriel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de garantie</Label>
                    <Select
                      value={formData.guaranteeType}
                      onValueChange={(value) => handleInputChange('guaranteeType', value)}
                    >
                      <SelectTrigger className="bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Épargne">Épargne de garantie</SelectItem>
                        <SelectItem value="Matérielle">Garantie matérielle</SelectItem>
                        <SelectItem value="Gage">Contrat de gage</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.amount && formData.duration && (
                  <div className="p-6 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-lg">
                    <h4 className="mb-4">Récapitulatif financier</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-blue-200">Capital</div>
                        <div className="text-xl mt-1">{parseFloat(formData.amount).toLocaleString()} FCFA</div>
                      </div>
                      <div>
                        <div className="text-blue-200">Intérêts totaux</div>
                        <div className="text-xl mt-1">
                          {(parseFloat(formData.amount) * parseFloat(formData.interestRate) / 100 * parseInt(formData.duration)).toLocaleString()} FCFA
                        </div>
                      </div>
                      <div>
                        <div className="text-blue-200">Montant total</div>
                        <div className="text-xl mt-1">{calculateTotalAmount().toLocaleString()} FCFA</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div className="space-y-6">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertDescription className="text-amber-800">
                    Formats acceptés : PDF, JPG, PNG (max 5 MB par fichier)
                  </AlertDescription>
                </Alert>

                {(['identityCard', 'photo', 'addressProof'] as const).map((field) => {
                  const labels = {
                    identityCard: 'Pièce d\'identité (CNI/Passeport)',
                    photo: 'Photo récente du client',
                    addressProof: 'Justificatif de domicile'
                  };
                  
                  return (
                    <div key={field} className="space-y-3">
                      <Label>{labels[field]} *</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                          formData[field]
                            ? 'bg-green-50 border-green-300'
                            : 'bg-slate-50 border-slate-300 hover:border-blue-400'
                        }`}
                        onClick={() => !formData[field] && document.getElementById(field)?.click()}
                      >
                        {formData[field] ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                              <div className="text-left">
                                <div className="text-sm">{formData[field]!.name}</div>
                                <div className="text-xs text-slate-500">
                                  {(formData[field]!.size / 1024).toFixed(0)} KB
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(field);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                            <div className="text-sm text-slate-600">
                              Cliquez ou glissez le fichier ici
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        id={field}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 4: Signature */}
            {step === 4 && (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Vérifiez les informations avant de signer
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <h4>Récapitulatif</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Client :</span> {formData.firstName} {formData.lastName}
                    </div>
                    <div>
                      <span className="text-slate-500">Montant :</span> {parseFloat(formData.amount || '0').toLocaleString()} FCFA
                    </div>
                    <div>
                      <span className="text-slate-500">Durée :</span> {formData.duration} mois
                    </div>
                    <div>
                      <span className="text-slate-500">Total :</span> {calculateTotalAmount().toLocaleString()} FCFA
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4>Contrats disponibles</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" onClick={() => setShowContractType('pret')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Contrat de prêt
                    </Button>
                    <Button variant="outline" onClick={() => setShowContractType('gage')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Contrat de gage
                    </Button>
                    <Button variant="outline" onClick={() => setShowContractType('dette')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Reconnaissance dette
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4>Signature de l'emprunteur *</h4>
                  {formData.borrowerSignature ? (
                    <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          <div>
                            <div>Signature enregistrée</div>
                            <div className="text-sm text-slate-500">Cliquez pour modifier</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowSignatureModal(true)}>
                          Modifier
                        </Button>
                      </div>
                      <img src={formData.borrowerSignature} alt="Signature" className="mt-4 h-20 border rounded" />
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={() => setShowSignatureModal(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Signer électroniquement
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t mt-8">
              {step > 0 ? (
                <Button variant="outline" onClick={handleBack} size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  size="lg"
                  className="bg-blue-900 hover:bg-blue-800"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Soumettre la demande
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showSignatureModal && (
        <SignatureCanvas
          onSave={handleSaveSignature}
          onCancel={() => setShowSignatureModal(false)}
          title="Signature de l'emprunteur"
        />
      )}
    </div>
  );
}
