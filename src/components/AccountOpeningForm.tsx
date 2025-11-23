import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Upload, Check, UserPlus, Users, Building } from 'lucide-react';
import { SignatureCanvas } from './SignatureCanvas';
import { AccountType } from '../lib/types';
import { toast } from 'sonner';

interface AccountOpeningFormProps {
  onClose: () => void;
}

export function AccountOpeningForm({ onClose }: AccountOpeningFormProps) {
  const { currentUser, createAccount } = useApp();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>('INDIVIDUAL');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signingFor, setSigningFor] = useState<'primary' | 'secondary'>('primary');

  // Formulaire données client principal
  const [formData, setFormData] = useState({
    // Type de compte
    accountType: 'INDIVIDUAL' as AccountType,

    // Informations personnelles
    clientName: '',
    clientBirthDate: '',
    clientBirthPlace: '',
    clientNationality: 'Burkinabè',
    clientIdNumber: '',
    clientIdIssueDate: '',
    clientIdIssuePlace: '',
    clientProfession: '',
    clientEmployer: '',
    
    // Contact
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    clientCity: '',
    clientCountry: 'Burkina Faso',
    
    // Informations bancaires
    initialDeposit: '',
    
    // Personne à contacter en cas d'urgence
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Second titulaire (compte joint)
    secondHolderName: '',
    secondHolderBirthDate: '',
    secondHolderIdNumber: '',
    secondHolderPhone: '',
    secondHolderEmail: '',
    secondHolderAddress: '',
    secondHolderRelation: '',
    
    // Entreprise (compte business)
    businessName: '',
    businessRegistration: '',
    businessType: '',
    businessSector: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    businessCreationDate: '',
    
    // Documents
    hasIdentityCard: false,
    hasProofOfAddress: false,
    hasPhoto: false,
    hasSecondHolderIdentity: false,
    hasBusinessRegistration: false,
    
    // Signature
    signature: '',
    secondHolderSignature: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientName.trim()) newErrors.clientName = 'Le nom complet est requis';
    if (!formData.clientBirthDate) newErrors.clientBirthDate = 'La date de naissance est requise';
    if (!formData.clientIdNumber.trim()) newErrors.clientIdNumber = 'Le numéro CNI est requis';
    if (!formData.clientPhone.trim()) newErrors.clientPhone = 'Le téléphone est requis';
    if (!formData.clientAddress.trim()) newErrors.clientAddress = 'L\'adresse est requise';
    if (!formData.clientProfession.trim()) newErrors.clientProfession = 'La profession est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (accountType === 'JOINT') {
      if (!formData.secondHolderName.trim()) newErrors.secondHolderName = 'Le nom du second titulaire est requis';
      if (!formData.secondHolderIdNumber.trim()) newErrors.secondHolderIdNumber = 'Le numéro CNI du second titulaire est requis';
      if (!formData.secondHolderPhone.trim()) newErrors.secondHolderPhone = 'Le téléphone du second titulaire est requis';
      if (!formData.secondHolderRelation.trim()) newErrors.secondHolderRelation = 'La relation entre les titulaires est requise';
    }
    
    if (accountType === 'BUSINESS') {
      if (!formData.businessName.trim()) newErrors.businessName = 'La raison sociale est requise';
      if (!formData.businessRegistration.trim()) newErrors.businessRegistration = 'Le numéro RCCM est requis';
      if (!formData.businessType.trim()) newErrors.businessType = 'Le type d\'entreprise est requis';
      if (!formData.businessSector.trim()) newErrors.businessSector = 'Le secteur d\'activité est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.initialDeposit || parseFloat(formData.initialDeposit) < 5000) {
      newErrors.initialDeposit = 'Le dépôt initial minimum est de 5,000 FCFA';
    }
    
    if (!formData.hasIdentityCard) newErrors.hasIdentityCard = 'La pièce d\'identité est requise';
    if (!formData.hasProofOfAddress) newErrors.hasProofOfAddress = 'Le justificatif de domicile est requis';
    if (!formData.hasPhoto) newErrors.hasPhoto = 'La photo d\'identité est requise';
    
    if (accountType === 'JOINT' && !formData.hasSecondHolderIdentity) {
      newErrors.hasSecondHolderIdentity = 'La CNI du second titulaire est requise';
    }
    
    if (accountType === 'BUSINESS' && !formData.hasBusinessRegistration) {
      newErrors.hasBusinessRegistration = 'Le RCCM de l\'entreprise est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.signature) {
      toast.error('La signature du titulaire principal est requise');
      return;
    }
    
    if (accountType === 'JOINT' && !formData.secondHolderSignature) {
      toast.error('La signature du second titulaire est requise');
      return;
    }

    if (!currentUser) return;

    createAccount({
      agentId: currentUser.id,
      agentName: `${currentUser.firstName} ${currentUser.lastName}`,
      agencyId: currentUser.agencyId,
      servicePoint: currentUser.servicePoint,
      status: 'PENDING',
      accountType: accountType,
      
      // Primary client
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      clientAddress: formData.clientAddress,
      clientBirthDate: formData.clientBirthDate,
      clientIdNumber: formData.clientIdNumber,
      clientProfession: formData.clientProfession,
      
      // Joint account
      secondHolderName: accountType === 'JOINT' ? formData.secondHolderName : undefined,
      secondHolderPhone: accountType === 'JOINT' ? formData.secondHolderPhone : undefined,
      secondHolderEmail: accountType === 'JOINT' ? formData.secondHolderEmail : undefined,
      secondHolderIdNumber: accountType === 'JOINT' ? formData.secondHolderIdNumber : undefined,
      
      // Business
      businessName: accountType === 'BUSINESS' ? formData.businessName : undefined,
      businessRegistration: accountType === 'BUSINESS' ? formData.businessRegistration : undefined,
      
      // Documents
      documents: {
        identityCard: formData.hasIdentityCard ? 'identity_card.pdf' : undefined,
        proofOfAddress: formData.hasProofOfAddress ? 'proof_of_address.pdf' : undefined,
        photo: formData.hasPhoto ? 'photo.jpg' : undefined,
        secondHolderIdentity: formData.hasSecondHolderIdentity ? 'second_holder_id.pdf' : undefined,
        businessRegistration: formData.hasBusinessRegistration ? 'rccm.pdf' : undefined
      },
      
      initialDeposit: parseFloat(formData.initialDeposit),
      signature: formData.signature,
      secondHolderSignature: accountType === 'JOINT' ? formData.secondHolderSignature : undefined,
      
      history: [{
        id: `history-${Date.now()}`,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userRole: currentUser.role,
        action: 'Demande d\'ouverture de compte créée',
        timestamp: new Date().toISOString()
      }],
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    toast.success('Demande d\'ouverture de compte créée avec succès!');
    onClose();
  };

  const accountTypeOptions = [
    { value: 'INDIVIDUAL', label: 'Compte Individuel', icon: UserPlus, description: 'Un seul titulaire' },
    { value: 'JOINT', label: 'Compte Joint', icon: Users, description: 'Deux titulaires' },
    { value: 'BUSINESS', label: 'Compte Entreprise', icon: Building, description: 'Pour les entreprises' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl mt-2">Nouvelle demande d'ouverture de compte</h1>
            <p className="text-slate-600 mt-1 text-lg">
              Étape {step} sur 4
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Type de compte et informations du titulaire principal'}
              {step === 2 && accountType === 'JOINT' && 'Informations du second titulaire'}
              {step === 2 && accountType === 'BUSINESS' && 'Informations de l\'entreprise'}
              {step === 2 && accountType === 'INDIVIDUAL' && 'Informations complémentaires'}
              {step === 3 && 'Documents et dépôt initial'}
              {step === 4 && 'Signatures'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Type de compte et infos principales */}
            {step === 1 && (
              <>
                {/* Type de compte */}
                <div className="space-y-3">
                  <Label>Type de compte *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {accountTypeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setAccountType(option.value as AccountType);
                            handleInputChange('accountType', option.value);
                          }}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            accountType === option.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className={`w-6 h-6 ${accountType === option.value ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <p className="text-sm text-slate-600">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Informations personnelles */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Nom complet *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="Prénom(s) et NOM"
                      />
                      {errors.clientName && (
                        <p className="text-sm text-red-600">{errors.clientName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientBirthDate">Date de naissance *</Label>
                      <Input
                        id="clientBirthDate"
                        type="date"
                        value={formData.clientBirthDate}
                        onChange={(e) => handleInputChange('clientBirthDate', e.target.value)}
                      />
                      {errors.clientBirthDate && (
                        <p className="text-sm text-red-600">{errors.clientBirthDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientBirthPlace">Lieu de naissance</Label>
                      <Input
                        id="clientBirthPlace"
                        value={formData.clientBirthPlace}
                        onChange={(e) => handleInputChange('clientBirthPlace', e.target.value)}
                        placeholder="Ville, Pays"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientNationality">Nationalité</Label>
                      <Input
                        id="clientNationality"
                        value={formData.clientNationality}
                        onChange={(e) => handleInputChange('clientNationality', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pièce d'identité */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Pièce d'identité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientIdNumber">Numéro CNI/Passeport *</Label>
                      <Input
                        id="clientIdNumber"
                        value={formData.clientIdNumber}
                        onChange={(e) => handleInputChange('clientIdNumber', e.target.value)}
                        placeholder="B123456789"
                      />
                      {errors.clientIdNumber && (
                        <p className="text-sm text-red-600">{errors.clientIdNumber}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientIdIssueDate">Date de délivrance</Label>
                      <Input
                        id="clientIdIssueDate"
                        type="date"
                        value={formData.clientIdIssueDate}
                        onChange={(e) => handleInputChange('clientIdIssueDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientIdIssuePlace">Lieu de délivrance</Label>
                      <Input
                        id="clientIdIssuePlace"
                        value={formData.clientIdIssuePlace}
                        onChange={(e) => handleInputChange('clientIdIssuePlace', e.target.value)}
                        placeholder="Ouagadougou"
                      />
                    </div>
                  </div>
                </div>

                {/* Profession */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Activité professionnelle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientProfession">Profession *</Label>
                      <Input
                        id="clientProfession"
                        value={formData.clientProfession}
                        onChange={(e) => handleInputChange('clientProfession', e.target.value)}
                        placeholder="Commerçant, Agriculteur, etc."
                      />
                      {errors.clientProfession && (
                        <p className="text-sm text-red-600">{errors.clientProfession}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientEmployer">Employeur / Activité</Label>
                      <Input
                        id="clientEmployer"
                        value={formData.clientEmployer}
                        onChange={(e) => handleInputChange('clientEmployer', e.target.value)}
                        placeholder="Nom de l'entreprise ou activité"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Coordonnées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Téléphone *</Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="+226 XX XX XX XX"
                      />
                      {errors.clientPhone && (
                        <p className="text-sm text-red-600">{errors.clientPhone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        placeholder="exemple@email.com"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="clientAddress">Adresse complète *</Label>
                      <Textarea
                        id="clientAddress"
                        value={formData.clientAddress}
                        onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                        placeholder="Secteur, rue, arrondissement"
                        rows={2}
                      />
                      {errors.clientAddress && (
                        <p className="text-sm text-red-600">{errors.clientAddress}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientCity">Ville</Label>
                      <Input
                        id="clientCity"
                        value={formData.clientCity}
                        onChange={(e) => handleInputChange('clientCity', e.target.value)}
                        placeholder="Ouagadougou"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientCountry">Pays</Label>
                      <Input
                        id="clientCountry"
                        value={formData.clientCountry}
                        onChange={(e) => handleInputChange('clientCountry', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Personne à contacter */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Personne à contacter en cas d'urgence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Nom complet</Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                        placeholder="Nom de la personne"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Téléphone</Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                        placeholder="+226 XX XX XX XX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactRelation">Lien de parenté</Label>
                      <Input
                        id="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                        placeholder="Père, Mère, Conjoint(e), etc."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Joint account or Business info */}
            {step === 2 && (
              <>
                {accountType === 'JOINT' && (
                  <div className="space-y-6">
                    <Alert>
                      <AlertDescription>
                        Les deux titulaires doivent être présents lors de l'ouverture du compte
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Informations du second titulaire</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="secondHolderName">Nom complet *</Label>
                          <Input
                            id="secondHolderName"
                            value={formData.secondHolderName}
                            onChange={(e) => handleInputChange('secondHolderName', e.target.value)}
                            placeholder="Prénom(s) et NOM"
                          />
                          {errors.secondHolderName && (
                            <p className="text-sm text-red-600">{errors.secondHolderName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondHolderBirthDate">Date de naissance</Label>
                          <Input
                            id="secondHolderBirthDate"
                            type="date"
                            value={formData.secondHolderBirthDate}
                            onChange={(e) => handleInputChange('secondHolderBirthDate', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondHolderIdNumber">Numéro CNI/Passeport *</Label>
                          <Input
                            id="secondHolderIdNumber"
                            value={formData.secondHolderIdNumber}
                            onChange={(e) => handleInputChange('secondHolderIdNumber', e.target.value)}
                            placeholder="B123456789"
                          />
                          {errors.secondHolderIdNumber && (
                            <p className="text-sm text-red-600">{errors.secondHolderIdNumber}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondHolderPhone">Téléphone *</Label>
                          <Input
                            id="secondHolderPhone"
                            type="tel"
                            value={formData.secondHolderPhone}
                            onChange={(e) => handleInputChange('secondHolderPhone', e.target.value)}
                            placeholder="+226 XX XX XX XX"
                          />
                          {errors.secondHolderPhone && (
                            <p className="text-sm text-red-600">{errors.secondHolderPhone}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondHolderEmail">Email</Label>
                          <Input
                            id="secondHolderEmail"
                            type="email"
                            value={formData.secondHolderEmail}
                            onChange={(e) => handleInputChange('secondHolderEmail', e.target.value)}
                            placeholder="exemple@email.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondHolderRelation">Relation entre les titulaires *</Label>
                          <Select
                            value={formData.secondHolderRelation}
                            onValueChange={(value) => handleInputChange('secondHolderRelation', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Conjoint(e)">Conjoint(e)</SelectItem>
                              <SelectItem value="Parent">Parent</SelectItem>
                              <SelectItem value="Enfant">Enfant</SelectItem>
                              <SelectItem value="Frère/Sœur">Frère/Sœur</SelectItem>
                              <SelectItem value="Associé(e)">Associé(e)</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.secondHolderRelation && (
                            <p className="text-sm text-red-600">{errors.secondHolderRelation}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="secondHolderAddress">Adresse</Label>
                          <Textarea
                            id="secondHolderAddress"
                            value={formData.secondHolderAddress}
                            onChange={(e) => handleInputChange('secondHolderAddress', e.target.value)}
                            placeholder="Secteur, rue, arrondissement"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {accountType === 'BUSINESS' && (
                  <div className="space-y-6">
                    <Alert>
                      <AlertDescription>
                        Le représentant légal de l'entreprise doit être présent avec tous les documents officiels
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Raison sociale *</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                            placeholder="Nom officiel de l'entreprise"
                          />
                          {errors.businessName && (
                            <p className="text-sm text-red-600">{errors.businessName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessRegistration">Numéro RCCM *</Label>
                          <Input
                            id="businessRegistration"
                            value={formData.businessRegistration}
                            onChange={(e) => handleInputChange('businessRegistration', e.target.value)}
                            placeholder="BFOUA2025BXXXXX"
                          />
                          {errors.businessRegistration && (
                            <p className="text-sm text-red-600">{errors.businessRegistration}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessType">Forme juridique *</Label>
                          <Select
                            value={formData.businessType}
                            onValueChange={(value) => handleInputChange('businessType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SARL">SARL</SelectItem>
                              <SelectItem value="SA">SA</SelectItem>
                              <SelectItem value="SUARL">SUARL</SelectItem>
                              <SelectItem value="SNC">SNC</SelectItem>
                              <SelectItem value="GIE">GIE</SelectItem>
                              <SelectItem value="Association">Association</SelectItem>
                              <SelectItem value="Coopérative">Coopérative</SelectItem>
                              <SelectItem value="Entreprise Individuelle">Entreprise Individuelle</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.businessType && (
                            <p className="text-sm text-red-600">{errors.businessType}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessSector">Secteur d'activité *</Label>
                          <Input
                            id="businessSector"
                            value={formData.businessSector}
                            onChange={(e) => handleInputChange('businessSector', e.target.value)}
                            placeholder="Commerce, Agriculture, Services, etc."
                          />
                          {errors.businessSector && (
                            <p className="text-sm text-red-600">{errors.businessSector}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessCreationDate">Date de création</Label>
                          <Input
                            id="businessCreationDate"
                            type="date"
                            value={formData.businessCreationDate}
                            onChange={(e) => handleInputChange('businessCreationDate', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessPhone">Téléphone entreprise</Label>
                          <Input
                            id="businessPhone"
                            type="tel"
                            value={formData.businessPhone}
                            onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                            placeholder="+226 XX XX XX XX"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessEmail">Email entreprise</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            value={formData.businessEmail}
                            onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                            placeholder="contact@entreprise.bf"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="businessAddress">Adresse du siège social</Label>
                          <Textarea
                            id="businessAddress"
                            value={formData.businessAddress}
                            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                            placeholder="Adresse complète"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {accountType === 'INDIVIDUAL' && (
                  <Alert>
                    <Check className="w-4 h-4" />
                    <AlertDescription>
                      Les informations principales ont été enregistrées. Passez à l'étape suivante pour les documents et le dépôt initial.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {/* Step 3: Documents et dépôt */}
            {step === 3 && (
              <>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Dépôt initial</h3>
                    <div className="space-y-2">
                      <Label htmlFor="initialDeposit">Montant du dépôt initial (FCFA) *</Label>
                      <Input
                        id="initialDeposit"
                        type="number"
                        value={formData.initialDeposit}
                        onChange={(e) => handleInputChange('initialDeposit', e.target.value)}
                        placeholder="Minimum 5,000 FCFA"
                        min="5000"
                      />
                      {errors.initialDeposit && (
                        <p className="text-sm text-red-600">{errors.initialDeposit}</p>
                      )}
                      <p className="text-sm text-slate-600">
                        Le dépôt initial minimum est de 5,000 FCFA
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Documents requis</h3>
                    <div className="space-y-3">
                      <Alert>
                        <AlertDescription>
                          Les documents doivent être scannés et uploadés. Tous les documents marqués d'un * sont obligatoires.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Pièce d'identité (CNI/Passeport) *</span>
                            </div>
                            <p className="text-sm text-slate-600">Copie recto-verso de la carte d'identité ou passeport</p>
                          </div>
                          <label className="cursor-pointer">
                            <Input
                              type="checkbox"
                              checked={formData.hasIdentityCard}
                              onChange={(e) => handleInputChange('hasIdentityCard', e.target.checked)}
                              className="w-5 h-5"
                            />
                          </label>
                        </div>
                        {errors.hasIdentityCard && (
                          <p className="text-sm text-red-600">{errors.hasIdentityCard}</p>
                        )}

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Justificatif de domicile *</span>
                            </div>
                            <p className="text-sm text-slate-600">Facture d'eau, d'électricité ou attestation de résidence</p>
                          </div>
                          <label className="cursor-pointer">
                            <Input
                              type="checkbox"
                              checked={formData.hasProofOfAddress}
                              onChange={(e) => handleInputChange('hasProofOfAddress', e.target.checked)}
                              className="w-5 h-5"
                            />
                          </label>
                        </div>
                        {errors.hasProofOfAddress && (
                          <p className="text-sm text-red-600">{errors.hasProofOfAddress}</p>
                        )}

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Photo d'identité *</span>
                            </div>
                            <p className="text-sm text-slate-600">Photo récente format passeport</p>
                          </div>
                          <label className="cursor-pointer">
                            <Input
                              type="checkbox"
                              checked={formData.hasPhoto}
                              onChange={(e) => handleInputChange('hasPhoto', e.target.checked)}
                              className="w-5 h-5"
                            />
                          </label>
                        </div>
                        {errors.hasPhoto && (
                          <p className="text-sm text-red-600">{errors.hasPhoto}</p>
                        )}

                        {accountType === 'JOINT' && (
                          <>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">CNI du second titulaire *</span>
                                </div>
                                <p className="text-sm text-slate-600">Copie recto-verso de la CNI du second titulaire</p>
                              </div>
                              <label className="cursor-pointer">
                                <Input
                                  type="checkbox"
                                  checked={formData.hasSecondHolderIdentity}
                                  onChange={(e) => handleInputChange('hasSecondHolderIdentity', e.target.checked)}
                                  className="w-5 h-5"
                                />
                              </label>
                            </div>
                            {errors.hasSecondHolderIdentity && (
                              <p className="text-sm text-red-600">{errors.hasSecondHolderIdentity}</p>
                            )}
                          </>
                        )}

                        {accountType === 'BUSINESS' && (
                          <>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">RCCM de l'entreprise *</span>
                                </div>
                                <p className="text-sm text-slate-600">Copie du Registre de Commerce et du Crédit Mobilier</p>
                              </div>
                              <label className="cursor-pointer">
                                <Input
                                  type="checkbox"
                                  checked={formData.hasBusinessRegistration}
                                  onChange={(e) => handleInputChange('hasBusinessRegistration', e.target.checked)}
                                  className="w-5 h-5"
                                />
                              </label>
                            </div>
                            {errors.hasBusinessRegistration && (
                              <p className="text-sm text-red-600">{errors.hasBusinessRegistration}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Signatures */}
            {step === 4 && (
              <>
                <div className="space-y-6">
                  <Alert>
                    <AlertDescription>
                      Les signatures doivent être apposées par les titulaires du compte en présence de l'agent
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Signature du titulaire principal *</h3>
                    {formData.signature ? (
                      <div className="space-y-3">
                        <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                          <div className="flex items-center gap-2 mb-3">
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-700">Signature enregistrée</span>
                          </div>
                          <img 
                            src={formData.signature} 
                            alt="Signature" 
                            className="border rounded bg-white p-2 max-h-40"
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSigningFor('primary');
                            setShowSignatureModal(true);
                          }}
                        >
                          Modifier la signature
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => {
                          setSigningFor('primary');
                          setShowSignatureModal(true);
                        }}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Apposer la signature du titulaire principal
                      </Button>
                    )}
                  </div>

                  {accountType === 'JOINT' && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Signature du second titulaire *</h3>
                      {formData.secondHolderSignature ? (
                        <div className="space-y-3">
                          <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                            <div className="flex items-center gap-2 mb-3">
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-700">Signature enregistrée</span>
                            </div>
                            <img 
                              src={formData.secondHolderSignature} 
                              alt="Signature second titulaire" 
                              className="border rounded bg-white p-2 max-h-40"
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSigningFor('secondary');
                              setShowSignatureModal(true);
                            }}
                          >
                            Modifier la signature
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => {
                            setSigningFor('secondary');
                            setShowSignatureModal(true);
                          }}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Apposer la signature du second titulaire
                        </Button>
                      )}
                    </div>
                  )}

                  <Alert>
                    <Check className="w-4 h-4" />
                    <AlertDescription>
                      En signant, les titulaires acceptent les conditions générales d'ouverture de compte de FINEC
                    </AlertDescription>
                  </Alert>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Précédent
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={handleNext} className="ml-auto">
                  Suivant
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="ml-auto">
                  Soumettre la demande
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Signature Modal */}
        {showSignatureModal && (
          <SignatureCanvas
            title={signingFor === 'primary' 
              ? `Signature de ${formData.clientName || 'Titulaire principal'}`
              : `Signature de ${formData.secondHolderName || 'Second titulaire'}`
            }
            onSave={(signature) => {
              if (signingFor === 'primary') {
                handleInputChange('signature', signature);
              } else {
                handleInputChange('secondHolderSignature', signature);
              }
              setShowSignatureModal(false);
              toast.success('Signature enregistrée avec succès');
            }}
            onCancel={() => setShowSignatureModal(false)}
          />
        )}
      </div>
    </div>
  );
}
