import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Shield, User, FileText, Settings, AlertTriangle } from 'lucide-react';

export function AuditLogs() {
  const { loanRequests, users } = useApp();

  // Generate audit logs from loan request history
  const auditLogs = loanRequests.flatMap(loan => 
    loan.history.map(entry => ({
      ...entry,
      loanId: loan.id,
      loanNumber: loan.requestNumber,
      type: entry.action.includes('REJETÉ') ? 'REJECTION' :
            entry.action.includes('APPROUVÉ') ? 'APPROVAL' :
            entry.action.includes('Validé') ? 'VALIDATION' :
            'CREATION'
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const typeIcons = {
    CREATION: <FileText className="w-4 h-4 text-blue-500" />,
    VALIDATION: <Shield className="w-4 h-4 text-green-500" />,
    APPROVAL: <Shield className="w-4 h-4 text-purple-500" />,
    REJECTION: <AlertTriangle className="w-4 h-4 text-red-500" />
  };

  const typeLabels = {
    CREATION: 'Création',
    VALIDATION: 'Validation',
    APPROVAL: 'Approbation',
    REJECTION: 'Rejet'
  };

  const typeColors = {
    CREATION: 'bg-blue-100 text-blue-700',
    VALIDATION: 'bg-green-100 text-green-700',
    APPROVAL: 'bg-purple-100 text-purple-700',
    REJECTION: 'bg-red-100 text-red-700'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <div>
            <CardTitle>Journaux d'audit</CardTitle>
            <CardDescription>
              Historique complet de toutes les actions dans le système
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Demande</TableHead>
              <TableHead>Commentaire</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Aucun log d'audit
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>{new Date(log.timestamp).toLocaleDateString('fr-FR')}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {typeIcons[log.type]}
                      <Badge className={typeColors[log.type]}>
                        {typeLabels[log.type]}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {log.userName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {log.userRole}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.loanNumber}</TableCell>
                  <TableCell>
                    {log.comment ? (
                      <div className="text-sm max-w-xs truncate" title={log.comment}>
                        {log.comment}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
