'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin'|'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const supabase = createSupabaseBrowserClient();
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
        if (error) throw error;
        setMessage(data.session ? 'Account created. You can open JARVIS now.' : 'Account created. Check your email for the confirmation link, then sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/assistant';
      }
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Account setup could not be completed.'); }
    finally { setBusy(false); }
  }

  return <main className="assistant-page"><header className="assistant-header"><Link href="/" className="back-link">← Command Center</Link><span className="assistant-online">JARVIS ACCOUNT</span></header><section className="assistant-chat"><div className="assistant-welcome"><div className="assistant-kicker">PRIVATE WORKSPACE</div><h1>{mode === 'signin' ? 'Welcome back.' : 'Create your account.'}</h1><p>Your account is managed by your connected Supabase project.</p></div><form className="assistant-composer" onSubmit={submit} style={{display:'grid',gap:12}}>{mode==='signup'&&<input required value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Display name"/>}<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address"/><input required type="password" minLength={8} autoComplete={mode==='signin'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (at least 8 characters)"/><button className="assistant-send" type="submit" disabled={busy}>{busy?'Please wait…':mode==='signin'?'Sign in':'Create account'}</button></form>{message&&<div className="assistant-alert">{message}</div>}<p style={{textAlign:'center'}}>{mode==='signin'?'Need an account?':'Already registered?'} <button type="button" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setMessage('');}}>{mode==='signin'?'Create one':'Sign in'}</button></p></section></main>;
}
