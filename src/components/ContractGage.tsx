import { useState } from 'react';
import { LoanRequest } from '../lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import finecLogo from 'figma:asset/2a3227c23a3f44bc54561135554266ef6ac37c87.png';

interface ContractGageProps {
  loan: LoanRequest;
  onBack?: () => void;
}

export function ContractGage({ loan, onBack }: ContractGageProps) {
  const [contractData, setContractData] = useState({
    contractNumber: loan.requestNumber.replace('CR-', 'GAGE-'),
    borrowerName: loan.clientName,
    idNumber: '',
    address: loan.clientAddress,
    loanAmount: loan.amount.toString(),
    
    // Détails du gage
    gageItem1: '',
    gageValue1: '',
    gageItem2: '',
    gageValue2: '',
    gageItem3: '',
    gageValue3: '',
    totalGageValue: '',
    
    // Location & Date
    location: 'Ouagadougou',
    date: new Date().toLocaleDateString('fr-FR'),
    
    // Signatures
    borrowerSignature: false,
    witnessName: '',
    witnessSignature: false,
    acfimeStamp: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Action Bar */}
        {onBack && (
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
            </div>
          </div>
        )}

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
                  CONTRAT DE GAGE N° 
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
                Entre les soussignés :
              </p>
              <p className="ml-6">
                <strong>FINEC</strong>, représentée par son Directeur Général, ci-après dénommée « <strong>le créancier</strong> »,
              </p>
              <p className="text-center my-4">
                <strong>D'UNE PART,</strong>
              </p>
              <p>Et</p>
              <p className="flex items-start gap-2 ml-6">
                <span>M./Mme/Mlle</span>
                <Input 
                  value={contractData.borrowerName}
                  onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                  className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                  placeholder="Nom de l'emprunteur"
                />
              </p>
              <p className="flex items-start gap-2 ml-6">
                <span>Titulaire de la CNI/Passeport N°</span>
                <Input 
                  value={contractData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                  placeholder="Numéro"
                />
              </p>
              <p className="flex items-start gap-2 ml-6">
                <span>Demeurant à</span>
                <Input 
                  value={contractData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                />
              </p>
              <p className="ml-6">
                Ci-après dénommé « <strong>le débiteur</strong> »,
              </p>
              <p className="text-center my-4">
                <strong>D'AUTRE PART,</strong>
              </p>
            </div>

            {/* Article 1 */}
            <div className="space-y-3 text-sm leading-relaxed mt-6">
              <h3 className="text-base underline">Article 1 : Objet du contrat</h3>
              <p>
                Le débiteur remet en gage au créancier les biens meubles ci-après désignés en garantie 
                du remboursement d'un prêt d'un montant de{' '}
                <Input 
                  value={contractData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="inline-block w-48 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                />
                {' '}FCFA (Francs CFA) consenti par FINEC.
              </p>
            </div>

            {/* Article 2 */}
            <div className="space-y-3 text-sm leading-relaxed mt-6">
              <h3 className="text-base underline">Article 2 : Désignation des biens gagés</h3>
              <p>Les biens donnés en gage sont les suivants :</p>
              
              <div className="mt-4">
                <table className="w-full border-2 border-slate-800">
                  <thead>
                    <tr className="bg-slate-200">
                      <th className="border border-slate-800 p-2 text-left text-sm">
                        Désignation du bien
                      </th>
                      <th className="border border-slate-800 p-2 text-center text-sm w-48">
                        Valeur estimée (FCFA)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.gageItem1}
                          onChange={(e) => handleInputChange('gageItem1', e.target.value)}
                          className="w-full border-0 bg-transparent text-sm"
                          placeholder="Ex: Motocyclette marque YAMAHA 125cc..."
                        />
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.gageValue1}
                          onChange={(e) => handleInputChange('gageValue1', e.target.value)}
                          className="w-full border-0 bg-transparent text-center text-sm"
                          placeholder="Montant"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.gageItem2}
                          onChange={(e) => handleInputChange('gageItem2', e.target.value)}
                          className="w-full border-0 bg-transparent text-sm"
                          placeholder="Ex: Téléviseur LCD 32 pouces..."
                        />
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.gageValue2}
                          onChange={(e) => handleInputChange('gageValue2', e.target.value)}
                          className="w-full border-0 bg-transparent text-center text-sm"
                          placeholder="Montant"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.gageItem3}
                          onChange={(e) => handleInputChange('gageItem3', e.target.value)}
                          className="w-full border-0 bg-transparent text-sm"
                          placeholder="Autre bien..."
                        />
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.gageValue3}
                          onChange={(e) => handleInputChange('gageValue3', e.target.value)}
                          className="w-full border-0 bg-transparent text-center text-sm"
                          placeholder="Montant"
                        />
                      </td>
                    </tr>
                    <tr className="bg-slate-100">
                      <td className="border border-slate-800 p-2">
                        <strong>VALEUR TOTALE DES BIENS GAGÉS</strong>
                      </td>
                      <td className="border border-slate-800 p-2">
                        <Input 
                          value={contractData.totalGageValue}
                          onChange={(e) => handleInputChange('totalGageValue', e.target.value)}
                          className="w-full border-0 bg-transparent text-center text-sm"
                          placeholder="Total"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Article 3 */}
            <div className="space-y-3 text-sm leading-relaxed mt-6">
              <h3 className="text-base underline">Article 3 : Conservation du gage</h3>
              <p>
                Les biens gagés seront conservés par FINEC dans ses locaux jusqu'au remboursement 
                intégral du prêt. Le débiteur s'interdit de disposer des biens gagés tant que la dette 
                n'est pas entièrement remboursée.
              </p>
            </div>

            {/* Article 4 */}
            <div className="space-y-3 text-sm leading-relaxed mt-6">
              <h3 className="text-base underline">Article 4 : Restitution du gage</h3>
              <p>
                Les biens gagés seront restitués au débiteur dès le remboursement total du prêt, 
                des intérêts et de tous les frais y afférents.
              </p>
            </div>

            {/* Article 5 */}
            <div className="space-y-3 text-sm leading-relaxed mt-6">
              <h3 className="text-base underline">Article 5 : Réalisation du gage en cas de défaillance</h3>
              <p>
                En cas de non-remboursement du prêt aux échéances convenues, FINEC se réserve le droit 
                de faire vendre les biens gagés aux enchères publiques ou de gré à gré, après mise en 
                demeure restée infructueuse pendant un délai de 15 jours.
              </p>
              <p>
                Le produit de la vente sera affecté au remboursement de la dette, des intérêts, 
                des pénalités et des frais. L'éventuel excédent sera restitué au débiteur.
              </p>
            </div>

            {/* Article 6 */}
            <div className="space-y-3 text-sm leading-relaxed mt-6">
              <h3 className="text-base underline">Article 6 : Déclaration du débiteur</h3>
              <p>
                Le débiteur déclare et certifie sur l'honneur :
              </p>
              <ul className="list-disc ml-8 space-y-1">
                <li>Être le propriétaire légitime des biens remis en gage</li>
                <li>Que ces biens sont libres de tout privilège, nantissement ou hypothèque</li>
                <li>Qu'il ne les a pas déjà donnés en garantie à un tiers</li>
              </ul>
            </div>

            {/* Location and Date */}
            <div className="flex items-center gap-2 text-sm mt-12 justify-center">
              <span>Fait à</span>
              <Input 
                value={contractData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="inline-block w-48 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
              />
              <span>le</span>
              <Input 
                value={contractData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="inline-block w-48 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
              />
            </div>

            {/* Signatures Section */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {/* Borrower Signature */}
              <div className="space-y-4">
                <h4 className="text-center underline text-sm">Le Débiteur</h4>
                <p className="text-xs text-center">(Lu et approuvé)</p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-[100px] bg-slate-50 text-center text-sm text-slate-400">
                  [Signature]
                </div>
              </div>

              {/* Witness Signature */}
              <div className="space-y-4">
                <h4 className="text-center underline text-sm">Témoin</h4>
                <Input 
                  value={contractData.witnessName}
                  onChange={(e) => handleInputChange('witnessName', e.target.value)}
                  placeholder="Nom du témoin"
                  className="text-xs text-center border-0 border-b border-dotted"
                />
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-[100px] bg-slate-50 text-center text-sm text-slate-400">
                  [Signature]
                </div>
              </div>

              {/* FINEC Signature */}
              <div className="space-y-4">
                <h4 className="text-center underline text-sm">FINEC</h4>
                <p className="text-xs text-center">Le Directeur Général</p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-[100px] bg-slate-50 text-center text-sm text-slate-400">
                  [Cachet et Signature]
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
