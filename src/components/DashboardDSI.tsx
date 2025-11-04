import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Users, FileText, Database, Shield, Activity, Server, AlertTriangle, CheckCircle2, XCircle, Lock, Unlock, UserCheck, UserX, Settings, RefreshCw } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { AuditLogs } from './AuditLogs';
import { SystemLogs } from './SystemLogs';
import { AGENCIES } from '../lib/data';

export function DashboardDSI() {
  const { loanRequests, users, cheques } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // System Health Metrics
  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.role !== 'DSI').length,
    totalLoans: loanRequests.length,
    activeLoans: loanRequests.filter(r => 
      r.status !== 'REJECTED' && r.status !== 'APPROVED'
    ).length,
    approvedLoans: loanRequests.filter(r => r.status === 'APPROVED').length,
    rejectedLoans: loanRequests.filter(r => r.status === 'REJECTED').length,
    totalCheques: cheques.length,
    activeCheques: cheques.filter(c => c.status === 'ACTIVE').length,
    systemHealth: 98.5,
    lastBackup: '14 Oct 2025 - 08:00',
    uptime: '99.9%'
  };

  // User distribution by role
  const usersByRole = {
    agents: users.filter(u => u.role === 'AGENT').length,
    chefs: users.filter(u => u.role === 'CHEF_AGENCE').length,
    operations: users.filter(u => u.role === 'OPERATIONS').length,
    dg: users.filter(u => u.role === 'DG').length,
    dsi: users.filter(u => u.role === 'DSI').length
  };

  // Agency distribution
  const agencyDistribution = AGENCIES.map(agency => ({
    id: agency.id,
    name: agency.name,
    users: users.filter(u => u.agencyId === agency.id).length,
    loans: loanRequests.filter(r => r.agencyId === agency.id).length,
    cheques: cheques.filter(c => c.agencyId === agency.id).length
  }));

  // Recent activities (simulation)
  const recentActivities = loanRequests
    .flatMap(loan => loan.history)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  // System alerts
  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: `${systemStats.activeLoans} demandes en cours de traitement`,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'info',
      message: `${systemStats.totalUsers} utilisateurs actifs dans le système`,
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      type: 'success',
      message: 'Sauvegarde automatique effectuée avec succès',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Direction des Systèmes d'Information</h1>
        <p className="text-slate-600 mt-1 text-lg">Supervision complète et administration du système FINEC</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="text-base">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users" className="text-base">Utilisateurs</TabsTrigger>
          <TabsTrigger value="logs" className="text-base">Journaux Système</TabsTrigger>
          <TabsTrigger value="audit" className="text-base">Audit</TabsTrigger>
          <TabsTrigger value="security" className="text-base">Sécurité</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardDescription className="text-base">Santé du système</CardDescription>
                <CardTitle className="text-4xl text-green-700">{systemStats.systemHealth}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-green-600">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">Système opérationnel</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardDescription className="text-base">Utilisateurs actifs</CardDescription>
                <CardTitle className="text-4xl text-blue-700">{systemStats.activeUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-blue-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">sur {systemStats.totalUsers} total</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardDescription className="text-base">Demandes actives</CardDescription>
                <CardTitle className="text-4xl text-purple-700">{systemStats.activeLoans}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-purple-600">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">En traitement</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <CardDescription className="text-base">Uptime système</CardDescription>
                <CardTitle className="text-4xl text-amber-700">{systemStats.uptime}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-amber-600">
                  <Server className="w-5 h-5" />
                  <span className="text-sm">Disponibilité</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total demandes de crédit</CardDescription>
                <CardTitle className="text-3xl">{systemStats.totalLoans}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Approuvées:</span>
                    <Badge className="bg-green-100 text-green-700">{systemStats.approvedLoans}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">En cours:</span>
                    <Badge className="bg-blue-100 text-blue-700">{systemStats.activeLoans}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Rejetées:</span>
                    <Badge className="bg-red-100 text-red-700">{systemStats.rejectedLoans}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Répartition des utilisateurs</CardDescription>
                <CardTitle className="text-3xl">{systemStats.totalUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Agents:</span>
                    <Badge variant="outline">{usersByRole.agents}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Chefs d'agence:</span>
                    <Badge variant="outline">{usersByRole.chefs}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Opérations + DG:</span>
                    <Badge variant="outline">{usersByRole.operations + usersByRole.dg}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Gestion des chèques</CardDescription>
                <CardTitle className="text-3xl">{systemStats.totalCheques}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Actifs:</span>
                    <Badge className="bg-blue-100 text-blue-700">{systemStats.activeCheques}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Encaissés:</span>
                    <Badge className="bg-green-100 text-green-700">
                      {cheques.filter(c => c.status === 'CASHED').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Problèmes:</span>
                    <Badge className="bg-red-100 text-red-700">
                      {cheques.filter(c => c.status === 'BOUNCED').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agency Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Répartition par agence</CardTitle>
              <CardDescription className="text-base">
                Distribution des ressources et activités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agencyDistribution.map((agency) => (
                  <div key={agency.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">{agency.name}</h4>
                          <p className="text-sm text-slate-500">Agence FINEC</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{agency.users} utilisateurs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{agency.loans} demandes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{agency.cheques} chèques</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Alertes système</CardTitle>
              <CardDescription className="text-base">
                Notifications et événements importants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <Alert key={alert.id} className={
                    alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                    alert.type === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }>
                    <div className="flex items-start gap-3">
                      {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />}
                      {alert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />}
                      {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-600 mt-0.5" />}
                      <div className="flex-1">
                        <AlertDescription className={
                          alert.type === 'warning' ? 'text-amber-800' :
                          alert.type === 'success' ? 'text-green-800' :
                          'text-blue-800'
                        }>
                          {alert.message}
                        </AlertDescription>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Activités récentes</CardTitle>
              <CardDescription className="text-base">
                Dernières actions dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Par {activity.userName} ({activity.userRole})
                      </div>
                      {activity.comment && (
                        <div className="text-sm text-slate-500 mt-1 italic">
                          "{activity.comment}"
                        </div>
                      )}
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Actions rapides</CardTitle>
              <CardDescription className="text-base">
                Administration et maintenance du système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Gérer les utilisateurs</div>
                    <div className="text-xs text-slate-500">Créer, modifier, supprimer</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveTab('logs')}
                >
                  <Activity className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Journaux Système</div>
                    <div className="text-xs text-slate-500">Événements temps réel</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveTab('audit')}
                >
                  <Shield className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Journaux d'audit</div>
                    <div className="text-xs text-slate-500">Historique complet</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveTab('security')}
                >
                  <Lock className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Sécurité & Accès</div>
                    <div className="text-xs text-slate-500">Permissions et rôles</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <SystemLogs />
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="mt-6">
          <AuditLogs />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sécurité et contrôle d'accès</CardTitle>
              <CardDescription className="text-base">
                Gestion des permissions et surveillance de la sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Role Permissions */}
              <div>
                <h4 className="text-lg font-medium mb-4">Permissions par rôle</h4>
                <div className="space-y-3">
                  {[
                    { role: 'AGENT', label: 'Agent de crédit', permissions: ['Créer demandes', 'Upload documents', 'Voir ses dossiers'], color: 'blue' },
                    { role: 'CHEF_AGENCE', label: 'Chef d\'agence', permissions: ['Valider/Rejeter', 'Voir agence', 'Commentaires'], color: 'purple' },
                    { role: 'OPERATIONS', label: 'Service Opérations', permissions: ['Contrôle secondaire', 'Vue globale', 'Validation'], color: 'orange' },
                    { role: 'DG', label: 'Direction Générale', permissions: ['Décision finale', 'Toutes agences', 'Analytics'], color: 'red' },
                    { role: 'DSI', label: 'DSI', permissions: ['Admin complet', 'Gestion users', 'Audit', 'Sécurité'], color: 'green' }
                  ].map((roleInfo) => (
                    <div key={roleInfo.role} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-base">{roleInfo.label}</h5>
                          <p className="text-sm text-slate-500">
                            {users.filter(u => u.role === roleInfo.role).length} utilisateur(s)
                          </p>
                        </div>
                        <Badge className={`bg-${roleInfo.color}-100 text-${roleInfo.color}-700`}>
                          {roleInfo.role}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {roleInfo.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Status */}
              <div>
                <h4 className="text-lg font-medium mb-4">Statut de sécurité</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Authentification</p>
                          <p className="text-2xl font-medium text-green-700">Sécurisée</p>
                        </div>
                        <Lock className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Dernière sauvegarde</p>
                          <p className="text-2xl font-medium">{systemStats.lastBackup}</p>
                        </div>
                        <Database className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* System Maintenance */}
              <div>
                <h4 className="text-lg font-medium mb-4">Maintenance système</h4>
                <Alert>
                  <Settings className="w-4 h-4" />
                  <AlertDescription className="text-base">
                    Le système fonctionne normalement. Aucune action de maintenance requise.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
