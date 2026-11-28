'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Use your owner email to receive a secure sign-in link.');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('Sending your secure sign-in link…');
    try {
      const supabase = createSupabaseBrowserClient();
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
      const redirectTo = window.location.origin + '/auth/callback?next=' + encodeURIComponent(safeNext);
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo, shouldCreateUser: false } });
      if (error) throw error;
      setMessage('Check your email for the sign-in link. Return here after opening it.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to send the sign-in link. Check Supabase configuration.'); }
    finally { setBusy(false); }
  }
  return <main className="auth-shell"><section className="auth-card"><div className="auth-mark">⌘</div><div className="auth-eyebrow">OWNER ACCESS · SECURE SIGN-IN</div><h1>JARVIS</h1><p className="auth-subtitle">Command Center</p><p className="auth-copy">Your workspace is protected. Sign in with your owner email to continue.</p><form onSubmit={submit} className="auth-form"><label htmlFor="owner-email">Email address</label><input id="owner-email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><button type="submit" disabled={busy || !email.trim()}>{busy ? 'Sending…' : 'Email me a sign-in link'}</button></form><p className="auth-message" role="status">{message}</p><a className="auth-back" href="/">Return to preview</a></section></main>;
}
