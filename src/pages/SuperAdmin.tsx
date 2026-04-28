import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function SuperAdmin() {
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError('Invalid credentials. Please try again.');
    } else {
      setIsAuthenticated(true);
      dispatch({ type: 'LOGIN_COMPLETE' });
    }
  };

  if (isAuthenticated) {
    return <><Navbar /><AdminDashboard /></>;
  }

  const inputClass =
    'w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3.5 font-body text-sm text-foreground outline-none transition-all duration-300';

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 w-full max-w-md mx-6 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-5" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Admin Access</h1>
          <p className="font-body text-sm text-muted-foreground">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputClass}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputClass}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display text-sm font-semibold hover:brightness-110 transition-all shadow-[0_4px_20px_hsl(var(--primary)/0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Continue →'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
