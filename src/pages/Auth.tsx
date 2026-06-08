import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    setAuthMessage((location.state as { notice?: string } | null)?.notice || '');
  }, [location.state]);

  const heading = useMemo(() => (mode === 'signin' ? 'Sign in' : 'Create account'), [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMessage('');
    setAuthLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setAuthError('Passwords do not match.');
          return;
        }

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
          setAuthError(error.message);
          return;
        }

        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigate('/signin', { replace: true, state: { notice: 'Account created. Please sign in with your new credentials.' } });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
      } else {
        setEmail('');
        setPassword('');
        navigate('/', { replace: true });
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-[#FF6B6B]">Welcome</p>
            <h1 className="mt-2 text-3xl font-bold text-[#2C2C2C]">{heading}</h1>
            <p className="mt-2 text-sm text-gray-500">Use your email and password to continue.</p>
          </div>

          <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
            <button type="button" onClick={() => setMode('signin')} className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${mode === 'signin' ? 'bg-white text-[#2C2C2C] shadow-sm' : 'text-gray-500'}`}>
              Sign in
            </button>
            <button type="button" onClick={() => setMode('signup')} className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-white text-[#2C2C2C] shadow-sm' : 'text-gray-500'}`}>
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {mode === 'signup' && (
              <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            )}
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') : heading}
            </Button>
          </form>

          {authError && <p className="mt-3 text-sm text-[#FF6B6B]">{authError}</p>}
          {authMessage && <p className="mt-3 text-sm text-emerald-600">{authMessage}</p>}

          <p className="mt-4 text-center text-sm text-gray-500">
            Need help? <Link to="/" className="text-[#FF6B6B] hover:underline">Back to shop</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
