import { useState } from 'react';
import { Shield, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => boolean;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center pt-12"
    >
      <div className="gradient-hero p-4 rounded-2xl mb-4 shadow-lg">
        <Shield size={32} className="text-primary-foreground" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-1">Admin Access</h2>
      <p className="text-xs text-muted-foreground mb-6">Enter your credentials</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        <button
          type="submit"
          className="w-full gradient-pink text-primary-foreground py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
        >
          <LogIn size={16} /> Sign In
        </button>
      </form>
    </motion.div>
  );
}
