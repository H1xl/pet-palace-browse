
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Edit2, Trash2, Shield, User, Search, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  fullName: string;
  login: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  registrationDate: string;
  status: 'active' | 'blocked';
}

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Мокапные данные пользователей
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      fullName: 'Иван Иванов',
      login: 'admin',
      email: 'admin@petshop.ru',
      phone: '+7 (999) 123-45-67',
      role: 'admin',
      registrationDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      fullName: 'Мария Петрова',
      login: 'maria_p',
      email: 'maria@example.com',
      phone: '+7 (999) 234-56-78',
      role: 'user',
      registrationDate: '2024-02-20',
      status: 'active'
    },
    {
      id: '3',
      fullName: 'Алексей Сидоров',
      login: 'alex_s',
      email: 'alex@example.com',
      phone: '+7 (999) 345-67-89',
      role: 'user',
      registrationDate: '2024-03-10',
      status: 'blocked'
    }
  ]);

  const [newUser, setNewUser] = useState({
    fullName: '',
    login: '',
    email: '',
    phone: '',
    role: 'user' as 'admin' | 'user',
    password: ''
  });

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.fullName || !newUser.login || !newUser.email || !newUser.password) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const user: UserData = {
      id: Date.now().toString(),
      ...newUser,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setUsers([...users, user]);
    setNewUser({
      fullName: '',
      login: '',
      email: '',
      phone: '',
      role: 'user',
      password: ''
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Пользователь создан",
      description: `Пользователь ${user.fullName} успешно добавлен`
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Пользователь удален",
      description: "Пользователь успешно удален из системы"
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: "Статус изменен",
      description: `Пользователь ${user?.fullName} ${user?.status === 'active' ? 'заблокирован' : 'разблокирован'}`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-pet-blue" />
            Управление пользователями
          </CardTitle>
          <CardDescription>
            Создание, редактирование и управление учетными записями пользователей
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Поиск и создание пользователя */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск пользователей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Создать пользователя
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Создание нового пользователя</DialogTitle>
                  <DialogDescription>
                    Заполните информацию для создания новой учетной записи
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">ФИО *</Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                      placeholder="Введите ФИО"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login">Логин *</Label>
                    <Input
                      id="login"
                      value={newUser.login}
                      onChange={(e) => setNewUser({...newUser, login: e.target.value})}
                      placeholder="Введите логин"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Введите email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Роль</Label>
                    <select
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'user'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="password">Пароль *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Введите пароль"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateUser} className="flex-1">
                      Создать
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Таблица пользователей */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">@{user.login}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-gray-500">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.role === 'admin' ? 'bg-yellow-500 text-yellow-900' : 'bg-blue-500 text-blue-100'}>
                        {user.role === 'admin' ? (
                          <>
                            <Crown size={12} className="mr-1" />
                            Администратор
                          </>
                        ) : (
                          <>
                            <User size={12} className="mr-1" />
                            Пользователь
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          <Shield size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.login === 'admin'}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-2 opacity-50" />
              <p>Пользователи не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
