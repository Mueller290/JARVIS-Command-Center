'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, MicOff, Send, Volume2, VolumeX, Sparkles, Trash2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Message = { role: 'user' | 'assistant'; content: string };
type SpeechWindow = Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any };

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [remember, setRemember] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [error, setError] = useState('');
  const recognition = useRef<any>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const client = createSupabaseBrowserClient();
      client.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
      const w = window as SpeechWindow;
      const Speech = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (Speech) {
        const instance = new Speech();
        instance.lang = 'en-US'; instance.interimResults = false; instance.continuous = false;
        instance.onresult = (event: any) => setInput((old) => `${old}${old ? ' ' : ''}${event.results[0][0].transcript}`);
        instance.onerror = () => { setVoiceOn(false); setError('Voice input stopped. You can type your message instead.'); };
        instance.onend = () => setVoiceOn(false);
        recognition.current = instance;
      }
    } catch { setSignedIn(false); }
  }, []);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next); setInput(''); setBusy(true); setError('');
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(-20), remember }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to reach JARVIS.');
      const updated = [...next, { role: 'assistant' as const, content: data.reply }];
      setMessages(updated);
      if (speakReplies && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(data.reply));
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setBusy(false); }
  }

  async function clearMemory() {
    if (!window.confirm('Permanently clear your saved JARVIS memory? This cannot be undone.')) return;
    setError('');
    const response = await fetch('/api/assistant', { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError(data.error || 'Could not clear memory.');
    else setError('Your saved JARVIS memory has been cleared.');
  }

  function toggleVoice() {
    if (!recognition.current) { setError('Voice input is not supported in this browser. Try Chrome or type your message.'); return; }
    if (voiceOn) { recognition.current.stop(); setVoiceOn(false); }
    else { setError(''); recognition.current.start(); setVoiceOn(true); }
  }

  return <main className="assistant-page">
    <header className="assistant-header"><Link href="/" className="back-link"><ArrowLeft size={16}/> Command Center</Link><span className="assistant-online"><i/> JARVIS AI</span></header>
    <section className="assistant-chat">
      <div className="assistant-welcome"><div className="assistant-avatar"><Sparkles size={24}/></div><div className="assistant-kicker">PERSONAL AI ASSISTANT</div><h1>How can I help?</h1><p>Ask questions, plan projects, or work through your next steps. External actions always stay under your control.</p></div>
      {!signedIn && <div className="assistant-alert">Sign in to use private JARVIS chat. <Link href="/login">Open sign in</Link></div>}
      <div className="assistant-memory-controls"><label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Allow JARVIS to save conversation memory</label><button type="button" onClick={clearMemory} disabled={!signedIn}><Trash2 size={14}/> Clear saved memory</button></div>
      <p className="assistant-memory-note">Memory is off by default. Turn it on only when you want JARVIS to save conversation context. You can clear saved memory here.</p>
      <div className="assistant-messages">{messages.map((m,i)=><div key={i} className={`assistant-message ${m.role}`}><b>{m.role === 'user' ? 'YOU' : 'JARVIS'}</b><p>{m.content}</p></div>)}{busy && <div className="assistant-message assistant"><b>JARVIS</b><p>Thinking…</p></div>}<div ref={bottom}/></div>
      {error && <div className="assistant-alert">{error}</div>}
      <form className="assistant-composer" onSubmit={sendMessage}><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Message JARVIS…" rows={2}/><div className="assistant-composer-actions"><button type="button" className={voiceOn?'voice-active':'voice-button'} onClick={toggleVoice} aria-label="Voice input">{voiceOn?<MicOff size={17}/>:<Mic size={17}/>}</button><button type="button" className="voice-button" onClick={()=>setSpeakReplies(v=>!v)} aria-label="Toggle spoken replies">{speakReplies?<Volume2 size={17}/>:<VolumeX size={17}/>}</button><button className="assistant-send" type="submit" disabled={!input.trim()||busy||!signedIn}><Send size={16}/> Send</button></div></form>
      <div className="assistant-disclaimer">AI replies require your own configured OpenAI API key and may incur usage charges. Browser voice support varies. No external actions are connected in this build.</div>
    </section>
  </main>;
}
