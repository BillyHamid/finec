import { useState } from 'react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Role, User } from '../lib/types';
import { AGENCIES } from '../lib/data';

export function UserManagement() {
  const { users, createUser, updateUser, deleteUser } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'AGENT' as Role,
    agencyId: 'OUA',
    servicePoint: ''
  });

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

  const selectedAgency = AGENCIES.find(a => a.id === formData.agencyId);

  const handleSubmit = () => {
    if (editingUser) {
      updateUser(editingUser.id, formData);
      setEditingUser(null);
    } else {
      createUser(formData);
    }
    setIsCreating(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      agencyId: user.agencyId,
      servicePoint: user.servicePoint || ''
    });
    setIsCreating(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(userId);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'AGENT',
      agencyId: 'OUA',
      servicePoint: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Créer, modifier et supprimer les comptes utilisateurs
            </CardDescription>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingUser(null); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations ci-dessous
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agency">Agence</Label>
                  <Select
                    value={formData.agencyId}
                    onValueChange={(value) => setFormData({ ...formData, agencyId: value, servicePoint: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENCIES.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id}>{agency.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAgency && selectedAgency.servicePoints.length > 0 && formData.role === 'AGENT' && (
                  <div className="space-y-2">
                    <Label htmlFor="servicePoint">Point de service</Label>
                    <Select
                      value={formData.servicePoint}
                      onValueChange={(value) => setFormData({ ...formData, servicePoint: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un point de service" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAgency.servicePoints.map((point) => (
                          <SelectItem key={point} value={point}>{point}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { setIsCreating(false); setEditingUser(null); }}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingUser ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Agence</TableHead>
              <TableHead>Point de service</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const agency = AGENCIES.find(a => a.id === user.agencyId);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>{agency?.name}</TableCell>
                  <TableCell>{user.servicePoint || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
