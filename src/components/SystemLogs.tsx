import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  module: string;
  action: string;
  user?: string;
  ipAddress?: string;
  details?: string;
}

const MOCK_SYSTEM_LOGS: SystemLog[] = [
  {
    id: 'log1',
    timestamp: '2025-10-14T14:30:15Z',
    level: 'INFO',
    module: 'Authentification',
    action: 'Connexion réussie',
    user: 'dg@finec.bf',
    ipAddress: '192.168.1.105',
    details: 'Utilisateur Jacques Ouattara connecté depuis le bureau'
  },
  {
    id: 'log2',
    timestamp: '2025-10-14T14:25:42Z',
    level: 'SUCCESS',
    module: 'Crédit',
    action: 'Demande approuvée',
    user: 'dg@finec.bf',
    ipAddress: '192.168.1.105',
    details: 'Demande CR-2025-004 approuvée pour 1M FCFA'
  },
  {
    id: 'log3',
    timestamp: '2025-10-14T14:20:18Z',
    level: 'INFO',
    module: 'Opérations',
    action: 'Validation effectuée',
    user: 'operations@finec.bf',
    ipAddress: '192.168.1.103',
    details: 'Demande CR-2025-003 validée par le service opérations'
  },
  {
    id: 'log4',
    timestamp: '2025-10-14T14:15:33Z',
    level: 'WARNING',
    module: 'Système',
    action: 'Tentative de connexion échouée',
    user: 'unknown@finec.bf',
    ipAddress: '192.168.1.201',
    details: 'Mot de passe incorrect - 3 tentatives'
  },
  {
    id: 'log5',
    timestamp: '2025-10-14T14:10:05Z',
    level: 'INFO',
    module: 'Épargne',
    action: 'Dépôt enregistré',
    user: 'agent.bonheur@finec.bf',
    ipAddress: '192.168.1.50',
    details: 'Dépôt de 50,000 FCFA sur compte EP-2025-001'
  },
  {
    id: 'log6',
    timestamp: '2025-10-14T14:05:20Z',
    level: 'SUCCESS',
    module: 'Crédit',
    action: 'Paiement reçu',
    user: 'agent.bonheur@finec.bf',
    ipAddress: '192.168.1.50',
    details: 'Paiement de 95,833 FCFA pour crédit CR-2025-001'
  },
  {
    id: 'log7',
    timestamp: '2025-10-14T13:58:44Z',
    level: 'INFO',
    module: 'Utilisateurs',
    action: 'Création utilisateur',
    user: 'dsi@finec.bf',
    ipAddress: '192.168.1.100',
    details: 'Nouvel agent créé : agent.cissin@finec.bf'
  },
  {
    id: 'log8',
    timestamp: '2025-10-14T13:45:12Z',
    level: 'ERROR',
    module: 'Base de données',
    action: 'Erreur de connexion',
    ipAddress: '192.168.1.100',
    details: 'Timeout lors de la connexion à la base de données - Résolu automatiquement'
  },
  {
    id: 'log9',
    timestamp: '2025-10-14T13:30:00Z',
    level: 'SUCCESS',
    module: 'Sauvegarde',
    action: 'Sauvegarde automatique',
    details: 'Sauvegarde quotidienne effectuée avec succès - 2.4 GB'
  },
  {
    id: 'log10',
    timestamp: '2025-10-14T13:15:28Z',
    level: 'WARNING',
    module: 'Sécurité',
    action: 'Accès refusé',
    user: 'agent.kilouin@finec.bf',
    ipAddress: '192.168.1.51',
    details: 'Tentative d\'accès à une demande d\'une autre agence'
  },
  {
    id: 'log11',
    timestamp: '2025-10-14T12:00:00Z',
    level: 'INFO',
    module: 'Système',
    action: 'Redémarrage serveur',
    details: 'Serveur redémarré pour maintenance programmée'
  },
  {
    id: 'log12',
    timestamp: '2025-10-14T11:45:15Z',
    level: 'SUCCESS',
    module: 'Validation',
    action: 'Chef d\'agence validation',
    user: 'chef.ouaga@finec.bf',
    ipAddress: '192.168.1.80',
    details: 'Demande CR-2025-002 validée par Chef Honoré Zongo'
  },
  {
    id: 'log13',
    timestamp: '2025-10-14T11:30:42Z',
    level: 'INFO',
    module: 'Crédit',
    action: 'Nouvelle demande',
    user: 'agent.sikasso@finec.bf',
    ipAddress: '192.168.2.50',
    details: 'Demande CR-2025-005 créée pour 800,000 FCFA'
  },
  {
    id: 'log14',
    timestamp: '2025-10-14T11:15:08Z',
    level: 'ERROR',
    module: 'Upload',
    action: 'Échec téléchargement document',
    user: 'agent.yegueri@finec.bf',
    ipAddress: '192.168.2.51',
    details: 'Fichier trop volumineux - Maximum 10 MB autorisé'
  },
  {
    id: 'log15',
    timestamp: '2025-10-14T10:00:00Z',
    level: 'SUCCESS',
    module: 'Rapport',
    action: 'Génération rapport mensuel',
    details: 'Rapport d\'activité Septembre 2025 généré'
  }
];

export function SystemLogs() {
  const [logs] = useState<SystemLog[]>(MOCK_SYSTEM_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    
    return matchesSearch && matchesLevel && matchesModule;
  });

  const levelIcons = {
    INFO: <Info className="w-4 h-4" />,
    WARNING: <AlertTriangle className="w-4 h-4" />,
    ERROR: <XCircle className="w-4 h-4" />,
    SUCCESS: <CheckCircle2 className="w-4 h-4" />
  };

  const levelColors = {
    INFO: 'bg-blue-100 text-blue-700',
    WARNING: 'bg-amber-100 text-amber-700',
    ERROR: 'bg-red-100 text-red-700',
    SUCCESS: 'bg-green-100 text-green-700'
  };

  const stats = {
    total: logs.length,
    info: logs.filter(l => l.level === 'INFO').length,
    warning: logs.filter(l => l.level === 'WARNING').length,
    error: logs.filter(l => l.level === 'ERROR').length,
    success: logs.filter(l => l.level === 'SUCCESS').length
  };

  const modules = Array.from(new Set(logs.map(l => l.module)));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-slate-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Total événements</CardDescription>
            <CardTitle className="text-4xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">Dernières 24h</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Informations</CardDescription>
            <CardTitle className="text-4xl text-blue-700">{stats.info}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="w-5 h-5" />
              <span className="text-sm">Normales</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Succès</CardDescription>
            <CardTitle className="text-4xl text-green-700">{stats.success}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">Opérations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Avertissements</CardDescription>
            <CardTitle className="text-4xl text-amber-700">{stats.warning}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">À surveiller</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-base">Erreurs</CardDescription>
            <CardTitle className="text-4xl text-red-700">{stats.error}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Nécessitent attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Journaux Système</CardTitle>
              <CardDescription className="text-base">
                Historique complet des événements et actions système
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="INFO">Information</SelectItem>
                  <SelectItem value="SUCCESS">Succès</SelectItem>
                  <SelectItem value="WARNING">Avertissement</SelectItem>
                  <SelectItem value="ERROR">Erreur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les modules</SelectItem>
                  {modules.map(module => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Logs Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base">Horodatage</TableHead>
                <TableHead className="text-base">Niveau</TableHead>
                <TableHead className="text-base">Module</TableHead>
                <TableHead className="text-base">Action</TableHead>
                <TableHead className="text-base">Utilisateur</TableHead>
                <TableHead className="text-base">IP</TableHead>
                <TableHead className="text-base">Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Aucun journal trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${levelColors[log.level]} flex items-center gap-1 w-fit`}>
                        {levelIcons[log.level]}
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-base">{log.module}</TableCell>
                    <TableCell className="text-base">{log.action}</TableCell>
                    <TableCell className="font-mono text-sm">{log.user || '-'}</TableCell>
                    <TableCell className="font-mono text-sm">{log.ipAddress || '-'}</TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-md truncate">
                      {log.details || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
