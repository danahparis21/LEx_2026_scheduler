import { useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPanel() {
  const { isAdmin, login, logout } = useAdmin();

  if (!isAdmin) {
    return <AdminLogin onLogin={login} />;
  }

  return <AdminDashboard onLogout={logout} />;
}
