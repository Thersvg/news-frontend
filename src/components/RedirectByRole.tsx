import { Navigate } from 'react-router';
import { useAuthStore } from '../store/authStore';

export default function RedirectByRole() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'editor') return <Navigate to="/painel" />;

  return <Navigate to="/" />;
}