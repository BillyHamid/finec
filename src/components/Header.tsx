import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { LogOut, Building2, MapPin } from 'lucide-react';
import { AGENCIES } from '../lib/data';
import finecLogo from 'figma:asset/2a3227c23a3f44bc54561135554266ef6ac37c87.png';

export function Header() {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const agency = AGENCIES.find(a => a.id === currentUser.agencyId);
  
  const roleLabels = {
    AGENT: 'Agent de Crédit',
    CHEF_AGENCE: 'Chef d\'Agence',
    OPERATIONS: 'Service Opérations',
    DG: 'Direction Générale',
    DSI: 'DSI'
  };

  const roleColors = {
    AGENT: 'bg-blue-100 text-blue-700',
    CHEF_AGENCE: 'bg-purple-100 text-purple-700',
    OPERATIONS: 'bg-orange-100 text-orange-700',
    DG: 'bg-red-100 text-red-700',
    DSI: 'bg-green-100 text-green-700'
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700 sticky top-0 z-50 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={finecLogo} alt="FINEC" className="h-12 w-auto" />
            <div className="h-10 w-px bg-blue-600" />
            <div>
              <div className="text-sm text-blue-200 font-medium">FINEC - Financial Services Platform</div>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-blue-300" />
                <span className="text-base text-white font-medium">{agency?.name}</span>
                {currentUser.servicePoint && (
                  <>
                    <span className="text-blue-400">•</span>
                    <MapPin className="w-4 h-4 text-blue-300" />
                    <span className="text-base text-white">{currentUser.servicePoint}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-3 justify-end">
                <span className="text-base text-white font-medium">{currentUser.firstName} {currentUser.lastName}</span>
                <Badge className={`${roleColors[currentUser.role]} text-sm px-3 py-1`}>
                  {roleLabels[currentUser.role]}
                </Badge>
              </div>
              <div className="text-sm text-blue-200 mt-1">{currentUser.email}</div>
            </div>
            <Avatar className="w-11 h-11 border-2 border-blue-400">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-base font-medium">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="default" onClick={logout} className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
