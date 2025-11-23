import { useState } from 'react';
import { LoanRequest } from '../lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import finecLogo from 'figma:asset/2a3227c23a3f44bc54561135554266ef6ac37c87.png';

interface ReconnaissanceDetteProps {
  loan: LoanRequest;
  onBack?: () => void;
}

export function ReconnaissanceDette({ loan, onBack }: ReconnaissanceDetteProps) {
  const [contractData, setContractData] = useState({
    contractNumber: loan.requestNumber.replace('CR-', 'RD-'),
    borrowerName: loan.clientName,
    idNumber: '',
    address: loan.clientAddress,
    loanAmount: loan.amount.toString(),
    amountInWords: '',
    duration: loan.duration.toString(),
    interestRate: '1.25',
    monthlyPayment: '',
    
    // Dates
    loanDate: new Date().toLocaleDateString('fr-FR'),
    firstPaymentDate: '',
    lastPaymentDate: '',
    
    location: 'Ouagadougou',
    date: new Date().toLocaleDateString('fr-FR')
  });

  const handleInputChange = (field: string, value: string) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  const numberToWords = (num: number): string => {
    // Fonction simplifiée - à améliorer
    return `${num.toLocaleString()} francs CFA`;
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
                  RECONNAISSANCE DE DETTE N° 
                  <Input 
                    value={contractData.contractNumber}
                    onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                    className="inline-block w-48 mx-2 border-0 border-b border-dotted border-slate-400 rounded-none px-1"
                  />
                </h2>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 text-sm leading-relaxed mt-8">
              <p>
                Je soussigné(e),
              </p>
              
              <p className="flex items-start gap-2 ml-6">
                <span>M./Mme/Mlle</span>
                <Input 
                  value={contractData.borrowerName}
                  onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                  className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                />
              </p>

              <p className="flex items-start gap-2 ml-6">
                <span>Titulaire de la CNI/Passeport N°</span>
                <Input 
                  value={contractData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="flex-1 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
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

              <p className="mt-6">
                <strong>RECONNAIS DEVOIR</strong> à FINEC (Financement et Numérisation des Entreprises et Coopératives) 
                (<strong>FINEC</strong>) la somme de :
              </p>

              <div className="p-6 bg-slate-100 border-2 border-slate-800 rounded-lg text-center my-6">
                <div className="text-2xl mb-2">
                  <Input 
                    value={contractData.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    className="inline-block w-64 text-center text-2xl border-0 border-b-2 border-slate-800 rounded-none px-2 bg-transparent"
                  />
                  {' '}FCFA
                </div>
                <div className="text-sm mt-2">
                  (
                  <Input 
                    value={contractData.amountInWords || numberToWords(parseFloat(contractData.loanAmount || '0'))}
                    onChange={(e) => handleInputChange('amountInWords', e.target.value)}
                    className="inline-block w-full text-center border-0 border-b border-dotted border-slate-600 rounded-none px-1 bg-transparent"
                    placeholder="Montant en lettres"
                  />
                  )
                </div>
              </div>

              <p>
                Cette somme m'a été prêtée le{' '}
                <Input 
                  value={contractData.loanDate}
                  onChange={(e) => handleInputChange('loanDate', e.target.value)}
                  className="inline-block w-40 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                />
                {' '}pour une durée de{' '}
                <Input 
                  value={contractData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="inline-block w-20 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                />
                {' '}mois.
              </p>

              <div className="space-y-3 mt-6 ml-6">
                <h4 className="underline">Conditions de remboursement :</h4>
                <p className="flex items-center gap-2">
                  • Taux d'intérêt mensuel :{' '}
                  <Input 
                    value={contractData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className="inline-block w-20 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                  />
                  {' '}% par mois
                </p>
                <p className="flex items-center gap-2">
                  • Mensualité :{' '}
                  <Input 
                    value={contractData.monthlyPayment}
                    onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                    className="inline-block w-48 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent text-center"
                  />
                  {' '}FCFA
                </p>
                <p className="flex items-center gap-2">
                  • Première échéance :{' '}
                  <Input 
                    value={contractData.firstPaymentDate}
                    onChange={(e) => handleInputChange('firstPaymentDate', e.target.value)}
                    className="inline-block w-40 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                  />
                </p>
                <p className="flex items-center gap-2">
                  • Dernière échéance :{' '}
                  <Input 
                    value={contractData.lastPaymentDate}
                    onChange={(e) => handleInputChange('lastPaymentDate', e.target.value)}
                    className="inline-block w-40 border-0 border-b border-dotted border-slate-400 rounded-none px-1 bg-transparent"
                  />
                </p>
              </div>

              <p className="mt-6">
                Je m'engage à rembourser cette dette selon les modalités définies dans le contrat de prêt 
                N° {contractData.contractNumber.replace('RD-', 'PRET-')} signé le même jour.
              </p>

              <p className="mt-4">
                En cas de retard de paiement, je reconnais devoir payer les pénalités et intérêts moratoires 
                conformément aux conditions générales de prêt de FINEC.
              </p>

              <p className="mt-4">
                En foi de quoi, j'ai signé la présente reconnaissance de dette.
              </p>
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
            <div className="grid grid-cols-2 gap-12 mt-12">
              {/* Borrower Signature */}
              <div className="space-y-4">
                <h4 className="text-center underline">Le Débiteur</h4>
                <p className="text-xs text-center">
                  Précédé de la mention « <strong>BON POUR</strong> » suivie du montant en chiffres et en lettres
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 min-h-[140px] bg-slate-50">
                  <p className="text-xs mb-4">BON POUR {contractData.loanAmount} FCFA</p>
                  <div className="text-center text-sm text-slate-400 mt-8">
                    [Signature manuscrite]
                  </div>
                </div>
              </div>

              {/* FINEC */}
              <div className="space-y-4">
                <h4 className="text-center underline">FINEC</h4>
                <p className="text-xs text-center">Le Directeur Général</p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 min-h-[140px] bg-slate-50 text-center">
                  <div className="text-sm text-slate-400 mt-4">
                    [Cachet et Signature]
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
