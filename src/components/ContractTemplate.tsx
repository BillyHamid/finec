import { useState } from 'react';
import { LoanRequest, User } from '../lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Download, Send, Printer } from 'lucide-react';
import finecLogo from 'figma:asset/2a3227c23a3f44bc54561135554266ef6ac37c87.png';

interface ContractTemplateProps {
  loan: LoanRequest;
  onBack: () => void;
}

export function ContractTemplate({ loan, onBack }: ContractTemplateProps) {
  const [contractData, setContractData] = useState({
    contractNumber: loan.requestNumber.replace('CR-', 'PRET-'),
    borrowerName: loan.clientName,
    idCardNumber: '',
    address: loan.clientAddress,
    loanAmount: loan.amount.toString(),
    durationMonths: loan.duration.toString(),
    purpose: loan.purpose,
    interestRate: '1,25',
    savingsRate: '10',
    totalAmount: '',
    numberOfInstallments: loan.duration.toString(),
    installmentFrequency: 'mensuelle',
    firstInstallmentDate: '',
    lastInstallmentDate: '',
    // Guarantees
    hasSavingsGuarantee: false,
    hasEndorsement: false,
    hasMaterialGuarantees: false,
    hasPledgeContract: false,
    // Guarantee details
    savingsGuaranteeDetail: '',
    savingsGuaranteeValue: '',
    materialGuaranteesDetail: '',
    materialGuaranteesValue: '',
    otherGuaranteesDetail: '',
    otherGuaranteesValue: '',
    totalGuaranteeValue: '',
    // Signature
    signatureLocation: 'Ouagadougou',
    signatureDate: new Date().toLocaleDateString('fr-FR'),
    borrowerManuscript: '',
    borrowerSignature: '',
    acfimeStamp: false,
    dgSignature: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalAmount = () => {
    const principal = parseFloat(contractData.loanAmount);
    const interest = principal * (parseFloat(contractData.interestRate.replace(',', '.')) / 100);
    const savings = principal * (parseFloat(contractData.savingsRate) / 100);
    return (principal + interest + savings).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              Envoyer pour signature
            </Button>
          </div>
        </div>

        {/* Contract Document */}
        <Card className="p-12 bg-white shadow-lg">
          <div className="space-y-6 contract-document" style={{ fontFamily: 'serif' }}>
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-4">
                <img src={finecLogo} alt="FINEC" className="h-16" />
              </div>
              <div className="text-lg">
                Financement et Numérisation des Entreprises et Coopératives<br />
                FINEC
              </div>
              <div className="text-base">Burkina Faso</div>
              <div className="border-t border-b border-slate-800 py-2 mt-4">
                <h2 className="text-xl">
                  CONTRAT DE PRÊT N° 
                  <Input 
                    value={contractData.contractNumber}
                    onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                    className="inline-block w-48 mx-2 border-0 border-b border-dotted border-slate-400 rounded-none px-1"
                  />
                </h2>
              </div>
            </div>

            {/* Introduction */}
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Entre FINEC (Financement et Numérisation des Entreprises et Coopératives) Ci-après dénommée <strong>FINEC</strong>, représentée par son Directeur Général d'une part,
              </p>
              <p className="flex items-start gap-2">
                <span>Et</span>
                <span className="flex-1">
                  M/me/M. 
                  <Input 
                    value={contractData.borrowerName}
                    onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                    className="inline-block w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                    placeholder="Nom de l'emprunteur"
                  />
                  Titulaire de la carte Nationale d'identité/Passeport N° 
                  <Input 
                    value={contractData.idCardNumber}
                    onChange={(e) => handleInputChange('idCardNumber', e.target.value)}
                    className="inline-block w-64 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                    placeholder="Numéro de pièce"
                  />
                  délivrée le 
                  <Input 
                    className="inline-block w-32 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                  />
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span>Résident à</span>
                <Input 
                  value={contractData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                />
              </p>
              <p>Ci-après dénommée « <strong>l'emprunteur</strong> ».</p>
              <p className="mt-6">Il est passé un contrat de crédit aux conditions suivantes :</p>
            </div>

            {/* Article 1 */}
            <div className="space-y-3 text-sm leading-relaxed">
              <h3 className="text-base underline">Article 1 : Objet montant et durée du prêt</h3>
              <p className="flex items-center gap-2">
                L'emprunteur reconnaît avoir reçu de FINEC un prêt de 
                <Input 
                  value={contractData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="inline-block w-48 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                />
                FCFA
              </p>
              <p className="flex items-start gap-2">
                <span>Pour une durée de</span>
                <Input 
                  value={contractData.durationMonths}
                  onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                  className="inline-block w-20 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                />
                <span>mois, décaissé le</span>
                <Input 
                  className="inline-block w-32 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                />
                <span>destiné à : Renforcer son activité avec</span>
              </p>
              <p className="flex items-start gap-2">
                <span>ou sans différé de</span>
                <Input 
                  className="inline-block w-20 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                />
                <span>mois</span>
              </p>
            </div>

            {/* Article 2 */}
            <div className="space-y-3 text-sm leading-relaxed">
              <h3 className="text-base underline">Article 2 : Conditions du prêt</h3>
              <p>L'emprunteur accepte le prêt aux conditions suivantes :</p>
              <div className="ml-6 space-y-2">
                <p className="flex items-center gap-2">
                  a) Capital emprunté : 
                  <span className="flex-1 border-b border-dotted border-slate-400">{contractData.loanAmount} FCFA</span>
                </p>
                <p className="flex items-center gap-2">
                  b) Intérêt : taux de 
                  <Input 
                    value={contractData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className="inline-block w-20 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                  />
                  % constant/mois
                  <span className="flex-1 border-b border-dotted border-slate-400"></span>
                </p>
                <p className="flex items-center gap-2">
                  c) Épargne parallèle obligatoire : taux de 
                  <Input 
                    value={contractData.savingsRate}
                    onChange={(e) => handleInputChange('savingsRate', e.target.value)}
                    className="inline-block w-20 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                  />
                  %
                  <span className="flex-1 border-b border-dotted border-slate-400"></span>
                </p>
                <p className="flex items-center gap-2">
                  d) Somme totale à rembourser :
                  <span className="flex-1 border-b border-dotted border-slate-400 text-center">
                    {calculateTotalAmount()} FCFA
                  </span>
                </p>
              </div>
            </div>

            {/* Article 3 */}
            <div className="space-y-3 text-sm leading-relaxed">
              <h3 className="text-base underline">Article 3 : Modalités de remboursement</h3>
              <p className="flex items-start gap-2">
                L'emprunteur s'engage à effectuer le remboursement du prêt (Capital + Intérêts + Épargne) en 
                <Input 
                  value={contractData.numberOfInstallments}
                  onChange={(e) => handleInputChange('numberOfInstallments', e.target.value)}
                  className="inline-block w-20 mx-2 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                />
                Échéances
                <span className="flex-1 border-b border-dotted border-slate-400"></span>
                égales et consécutives de 
                <span className="border-b border-dotted border-slate-400 px-2"></span>
                Nombre
              </p>
              
              <div className="ml-12 space-y-2">
                <h4 className="text-center underline">Périodicité</h4>
                <p className="flex items-center gap-8">
                  <span>Première échéance :</span>
                  <Input 
                    value={contractData.firstInstallmentDate}
                    onChange={(e) => handleInputChange('firstInstallmentDate', e.target.value)}
                    className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                    placeholder="Date"
                  />
                  <span>Différé :</span>
                  <span className="flex-1 border-b border-dotted border-slate-400"></span>
                </p>
                <p className="flex items-center gap-8">
                  <span>Dernière échéance :</span>
                  <Input 
                    value={contractData.lastInstallmentDate}
                    onChange={(e) => handleInputChange('lastInstallmentDate', e.target.value)}
                    className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                    placeholder="Date"
                  />
                </p>
              </div>
              
              <p className="mt-2">Conformément au tableau d'amortissement dont il a connaissance.</p>
            </div>

            {/* Article 4 */}
            <div className="space-y-3 text-sm leading-relaxed">
              <h3 className="text-base underline">Article 4 : Les garanties</h3>
              <p>Le crédit ne sera décaissé qu'après constitution des garanties prévues :</p>
              <div className="ml-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={contractData.hasSavingsGuarantee}
                    onCheckedChange={(checked) => handleInputChange('hasSavingsGuarantee', checked)}
                  />
                  <span>Épargne de garantie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={contractData.hasEndorsement}
                    onCheckedChange={(checked) => handleInputChange('hasEndorsement', checked)}
                  />
                  <span>Aval</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={contractData.hasMaterialGuarantees}
                    onCheckedChange={(checked) => handleInputChange('hasMaterialGuarantees', checked)}
                  />
                  <span>Garanties matérielles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={contractData.hasPledgeContract}
                    onCheckedChange={(checked) => handleInputChange('hasPledgeContract', checked)}
                  />
                  <span>Contrat de gage</span>
                </div>
              </div>

              {/* Guarantee Table */}
              <div className="mt-6">
                <table className="w-full border-2 border-slate-800">
                  <thead>
                    <tr className="bg-slate-200">
                      <th className="border border-slate-800 p-2 text-left text-sm">
                        Détail de garanties matérielles et financières
                      </th>
                      <th className="border border-slate-800 p-2 text-center text-sm w-48">
                        Valeurs estimées
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-800 p-2">
                        <span className="text-xs">Épargne de garantie</span>
                        <Input 
                          value={contractData.savingsGuaranteeDetail}
                          onChange={(e) => handleInputChange('savingsGuaranteeDetail', e.target.value)}
                          className="w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-sm"
                          placeholder="Détails..."
                        />
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.savingsGuaranteeValue}
                          onChange={(e) => handleInputChange('savingsGuaranteeValue', e.target.value)}
                          className="w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center text-sm"
                          placeholder="FCFA"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2">
                        <span className="text-xs">Garanties matérielles</span>
                        <Input 
                          value={contractData.materialGuaranteesDetail}
                          onChange={(e) => handleInputChange('materialGuaranteesDetail', e.target.value)}
                          className="w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-sm"
                          placeholder="Détails..."
                        />
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.materialGuaranteesValue}
                          onChange={(e) => handleInputChange('materialGuaranteesValue', e.target.value)}
                          className="w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center text-sm"
                          placeholder="FCFA"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2">
                        <span className="text-xs">Autres</span>
                        <Input 
                          value={contractData.otherGuaranteesDetail}
                          onChange={(e) => handleInputChange('otherGuaranteesDetail', e.target.value)}
                          className="w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-sm"
                          placeholder="Détails..."
                        />
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.otherGuaranteesValue}
                          onChange={(e) => handleInputChange('otherGuaranteesValue', e.target.value)}
                          className="w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center text-sm"
                          placeholder="FCFA"
                        />
                      </td>
                    </tr>
                    <tr className="bg-slate-100">
                      <td className="border border-slate-800 p-2">
                        <strong>Montant total des garanties</strong>
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.totalGuaranteeValue}
                          onChange={(e) => handleInputChange('totalGuaranteeValue', e.target.value)}
                          className="w-full border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center text-sm"
                          placeholder="FCFA"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Page break indicator */}
            <div className="py-8">
              <Separator className="border-slate-300" />
              <div className="text-center text-xs text-slate-400 py-2">Page 2</div>
              <Separator className="border-slate-300" />
            </div>

            {/* Article 4 continued */}
            <div className="space-y-3 text-sm leading-relaxed">
              <p className="text-xs italic">
                L'emprunteur déclare sur l'honneur que les garanties ci-dessus mentionnées sont vraiment siennes, 
                sont saisissables par FINEC en cas de non-respect de ses engagements, non-respect pouvant 
                entraîner une poursuite judiciaire.
              </p>
            </div>

            {/* Article 5 */}
            <div className="space-y-3 text-sm leading-relaxed">
              <h3 className="text-base underline">Article 5 : Pénalités – Intérêt moratoires</h3>
              <p className="text-xs leading-relaxed">
                Lorsqu'il n'est pas procédé au remboursement de l'échéance est enregistré dans le paiement d'une échéance, une pénalité 
                fixée à 2.500 F est due par le retardataire à partir du premier jour de retard, un intérêt moratoire 
                de 0.07% par jour de retard est calculé sur le principal et les intérêts dus de 
                l'échéance (ou des échéances) en retard à partir du premier jour de retard et ajouté aux 
                remboursements dûs.
              </p>
            </div>

            {/* Article 6 */}
            <div className="space-y-3 text-sm leading-relaxed">
              <h3 className="text-base underline">Article 6 : Conditions générales</h3>
              <ol className="list-decimal ml-6 space-y-2 text-xs leading-relaxed">
                <li>
                  Les remboursements doivent être effectués au guichet de FINEC ou à la banque 
                  suivant le tableau d'amortissement. Aucun retard n'est autorisé.
                </li>
                <li>
                  Le montant de l'épargne sera remis à l'emprunteur après relève pour toute la durée du prêt dans 
                  un compte d'épargne
                </li>
                <li>
                  En cas d'accident ou si, après l'échéance, le prêt présente toujours un 
                  solde, FINEC entreprendra les démarches nécessaires pour la réalisation des 
                  garanties, selon les procédures et la réglementation en vigueur afin de récupérer le 
                  capital prêté y compris les intérêts et les pénalités, jusqu'à l'épuisement de la dette de 
                  l'emprunteur.
                </li>
              </ol>
            </div>

            {/* Declaration */}
            <div className="space-y-3 text-sm leading-relaxed mt-6">
              <p className="text-xs leading-relaxed">
                L'emprunteur reconnaît avoir pris connaissance avec satisfaction des termes du présent contrat y 
                compris les conditions générales du prêt (ou traduction faite). De plus, l'emprunteur reconnaît avoir 
                reçu un double du présent contrat
              </p>
            </div>

            {/* Location and Date */}
            <div className="flex items-center gap-2 text-sm mt-8 justify-center">
              <span>Fait à</span>
              <Input 
                value={contractData.signatureLocation}
                onChange={(e) => handleInputChange('signatureLocation', e.target.value)}
                className="inline-block w-48 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
              />
              <span>le</span>
              <Input 
                value={contractData.signatureDate}
                onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                className="inline-block w-48 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
              />
            </div>

            {/* Signatures Section */}
            <div className="grid grid-cols-2 gap-12 mt-12">
              {/* Borrower Signature */}
              <div className="space-y-4">
                <h4 className="text-center underline">Signature de l'emprunteur</h4>
                <p className="text-xs text-center">
                  Nom et prénom précédés de la mention « <strong>LU ET APPROUVE</strong> »
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 min-h-[120px] bg-slate-50">
                  <Input 
                    value={contractData.borrowerManuscript}
                    onChange={(e) => handleInputChange('borrowerManuscript', e.target.value)}
                    placeholder="LU ET APPROUVÉ - [Nom et prénom]"
                    className="w-full bg-transparent border-0 text-center"
                  />
                  <div className="mt-4 text-center text-sm text-slate-400">
                    [Zone de signature électronique]
                  </div>
                </div>
              </div>

              {/* FINEC Signature */}
              <div className="space-y-4">
                <h4 className="text-center underline">Signature de FINEC</h4>
                <p className="text-xs text-center">(cachet)</p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 min-h-[120px] bg-slate-50">
                  <div className="text-center text-sm text-slate-400">
                    [Cachet et signature FINEC]
                  </div>
                  <div className="mt-8 text-center">
                    <div className="text-sm">Le Directeur Général</div>
                    <div className="mt-4 text-sm text-slate-400">[Signature DG]</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
