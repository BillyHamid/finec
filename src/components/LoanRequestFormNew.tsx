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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, X, FileText, Eye, Download, Send, Users, User, Lock, PenTool } from 'lucide-react';
import { AGENCIES } from '../lib/data';
import { ContractTemplate } from './ContractTemplate';
import { ContractGage } from './ContractGage';
import { ReconnaissanceDette } from './ReconnaissanceDette';
import { SignatureCanvas } from './SignatureCanvas';
import { toast } from 'sonner';

interface FormData {
  // Étape 0: Type de crédit
  loanType: 'particulier' | 'groupement';
  
  // Étape 1: Informations emprunteur
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
  
  // Étape 2: Détails crédit
  amount: string;
  duration: string;
  purpose: string;
  interestRate: string;
  savingsRate: string;
  repaymentMode: string;
  guaranteeType: string;
  
  // Étape 3: Documents
  identityCard: File | null;
  photo: File | null;
  addressProof: File | null;
  
  // Étape 4: Signatures
  borrowerSignature: string | null;
  dgSignature: string | null;
}

export function LoanRequestFormNew({ onClose }: { onClose: () => void }) {
  const { currentUser, createLoanRequest } = useApp();
  const [step, setStep] = useState(0);
  const [showContractType, setShowContractType] = useState<'pret' | 'gage' | 'dette' | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [previewLoan, setPreviewLoan] = useState<any>(null);
  
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
    borrowerSignature: null,
    dgSignature: null
  });

  if (!currentUser) return null;

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const selectedAgency = AGENCIES.find(a => a.id === formData.agencyId);

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
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
    'Identification du Demandeur',
    'Détails du Crédit',
    'Documents Justificatifs',
    'Signature et Validation'
  ];

  const calculateTotalAmount = () => {
    if (!formData.amount || !formData.duration || !formData.interestRate) return 0;
    const principal = parseFloat(formData.amount);
    const interest = principal * (parseFloat(formData.interestRate) / 100) * parseInt(formData.duration);
    const savings = principal * (parseFloat(formData.savingsRate) / 100);
    return principal + interest + savings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Button>
          <div className="text-sm text-slate-600">
            Étape {step + 1} sur {totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  {stepTitles[step]}
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  {step === 0 && 'Sélectionnez le type de crédit que vous souhaitez demander'}
                  {step === 1 && 'Renseignez les informations personnelles du demandeur'}
                  {step === 2 && 'Définissez les caractéristiques du crédit demandé'}
                  {step === 3 && 'Téléversez les documents justificatifs requis (KYC)'}
                  {step === 4 && 'Vérifiez et signez les documents contractuels'}
                </CardDescription>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                {step + 1}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Step 0: Loan Type Selection */}
            {step === 0 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    Choisissez le type de crédit adapté à vos besoins
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Crédit Particulier */}
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
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Épargne : 10% obligatoire
                        </li>
                      </ul>
                      <Badge className="mt-4 bg-green-600">Disponible</Badge>
                    </CardContent>
                  </Card>

                  {/* Crédit Groupement */}
                  <Card
                    className="border-2 border-slate-200 opacity-60 cursor-not-allowed"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Crédit Groupement</CardTitle>
                            <CardDescription>Pour les groupes et associations</CardDescription>
                          </div>
                        </div>
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-400">
                        <li>• Crédit solidaire de groupe</li>
                        <li>• Garantie collective</li>
                        <li>• Conditions spéciales</li>
                        <li>• Accompagnement renforcé</li>
                      </ul>
                      <Badge className="mt-4 bg-amber-500">Bientôt disponible</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 1: Borrower Information - Unchanged from previous version */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Copie du contenu de l'étape 1 de la version précédente */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="OUEDRAOGO"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
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
                    <Label htmlFor="idNumber">Numéro de CNI / Passeport *</Label>
                    <Input
                      id="idNumber"
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value)}
                      placeholder="B12345678"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date de naissance *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="birthPlace">Lieu de naissance</Label>
                    <Input
                      id="birthPlace"
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
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="12 Rue de la Liberté"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Quartier</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Ouaga 2000"
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+226 70 12 34 56"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
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
                    <Label htmlFor="profession">Profession *</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      placeholder="Commerçant"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Revenus mensuels (FCFA) *</Label>
                    <Input
                      id="monthlyIncome"
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
                    <Label htmlFor="agency">Agence</Label>
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
                      <Label htmlFor="servicePoint">Point de service</Label>
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

            {/* Continué dans le prochain message... */}
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
