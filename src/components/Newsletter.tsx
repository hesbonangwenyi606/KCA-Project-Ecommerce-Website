import React, { useState } from 'react';
import { PROJECT_ID } from '@/lib/format';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await fetch(`https://famous.ai/api/crm/${PROJECT_ID}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer-signup', tags: ['newsletter'] })
      });
    } catch { /* noop */ }
    setStatus('done');
    setEmail('');
  };

  return (
    <section className="bg-[#FF6B6B] py-16 px-4">
      <div className="max-w-2xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-3">Join the LUMA Club</h2>
        <p className="mb-6 opacity-90">Get 10% off your first order plus early access to new drops and exclusive offers.</p>
        {status === 'done' ? (
          <p className="font-semibold text-lg">Thanks for subscribing! Check your inbox.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none" />
            <button type="submit" disabled={status === 'loading'}
              className="bg-[#2C2C2C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-60">
              {status === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
