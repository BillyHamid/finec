import { useState } from 'react';
import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Building2, Lock, Mail } from 'lucide-react';
import finecLogo from 'figma:asset/2a3227c23a3f44bc54561135554266ef6ac37c87.png';

export function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    if (!success) {
      setError('Email ou mot de passe incorrect');
    }
  };

  const quickLogins = [
    { label: 'Agent (Bonheur-Ville)', email: 'agent.bonheur@finec.bf' },
    { label: 'Chef Ouaga', email: 'chef.ouaga@finec.bf' },
    { label: 'Opérations', email: 'operations@finec.bf' },
    { label: 'Direction Générale', email: 'dg@finec.bf' },
    { label: 'DSI', email: 'dsi@finec.bf' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <img src={finecLogo} alt="FINEC" className="h-20 w-auto" />
          </div>
          <h1 className="text-5xl font-bold">FINEC</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Plateforme de digitalisation des services financiers : ouverture de compte, demandes de crédit, gestion de l'épargne
          </p>
          <div className="space-y-4 mt-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xl font-medium">3 Agences</div>
                <div className="text-base text-blue-200">Ouagadougou • Bobo-Dioulasso • Banfora</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xl font-medium">Workflow sécurisé</div>
                <div className="text-base text-blue-200">Validation multi-niveaux avec audit complet</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-3xl">Connexion</CardTitle>
            <CardDescription className="text-lg">
              Accédez à votre espace FINEC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@acfime.bf"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-base">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 text-base"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-base">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 text-base bg-blue-900 hover:bg-blue-800">
                Se connecter
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t">
              <p className="text-base text-slate-600 mb-4 font-medium">Connexion rapide (démo) :</p>
              <div className="grid grid-cols-2 gap-3">
                {quickLogins.map((quick) => (
                  <Button
                    key={quick.email}
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setEmail(quick.email);
                      setPassword('demo123');
                    }}
                    className="text-sm h-11"
                  >
                    {quick.label}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-4 text-center bg-slate-50 p-3 rounded-lg">
                Mot de passe par défaut : <span className="font-mono font-medium">demo123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
