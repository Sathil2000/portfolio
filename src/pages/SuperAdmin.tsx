import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function SuperAdmin() {
  const { state, dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === 'sathilhansiluofficial@gmail.com' && password === '@chuti2kolla') {
      dispatch({ type: 'LOGIN_STEP1' });
    } else {
      setError('Invalid credentials');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code === '234187') {
      dispatch({ type: 'LOGIN_COMPLETE' });
    } else {
      setError('Invalid verification code');
    }
  };

  if (state.isAuthenticated) {
    return <><Navbar /><AdminDashboard /></>;
  }

  const inputClass = "w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3.5 font-body text-sm text-foreground outline-none transition-all duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <AnimatePresence mode="wait">
        {!state.twoFactorPending ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground block mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} required />
              </div>
              {error && <p className="font-body text-sm text-destructive">{error}</p>}
              <button type="submit" className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display text-sm font-semibold hover:brightness-110 transition-all shadow-[0_4px_20px_hsl(var(--primary)/0.15)]">
                Continue →
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="2fa"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-10 w-full max-w-md mx-6 relative z-10"
          >
            <div className="text-center mb-8">
              <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-5 animate-pulse" />
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">Verification</h1>
              <p className="font-body text-sm text-muted-foreground">Enter the 6-digit code</p>
            </div>
            <form onSubmit={handleVerify} className="space-y-5">
              <input
                type="text" value={code} onChange={e => setCode(e.target.value)}
                maxLength={6}
                className={inputClass + ' text-center text-2xl tracking-[0.5em] font-mono'}
                required
              />
              {error && <p className="font-body text-sm text-destructive">{error}</p>}
              <button type="submit" className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display text-sm font-semibold hover:brightness-110 transition-all shadow-[0_4px_20px_hsl(var(--primary)/0.15)]">
                Verify →
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
