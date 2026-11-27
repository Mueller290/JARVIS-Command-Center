'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity, AlertTriangle, ArrowUpRight, Bell, BriefcaseBusiness, CheckCircle2,
  ChevronRight, CircleHelp, Command, FileCheck2, FolderOpen, LayoutDashboard,
  LockKeyhole, Menu, Mic, Search, Send, Settings, ShieldCheck, Sparkles,
  Workflow, X
} from 'lucide-react';

type NavItem = { label: string; icon: typeof LayoutDashboard };
const nav: NavItem[] = [
  { label: 'JARVIS AI Assistant', icon: Sparkles },
  { label: 'Command Dashboard', icon: LayoutDashboard },
  { label: 'Opportunity Watch', icon: Search },
  { label: 'Verification Center', icon: ShieldCheck },
  { label: 'Opportunity Library', icon: FolderOpen },
  { label: 'Application Workshop', icon: BriefcaseBusiness },
  { label: 'Approval Center', icon: FileCheck2 }
];
const modules = [
  ['Executive HQ', 'Your central overview and priorities', 'EH'],
  ['Graphic Design Studio', 'Creative projects and brand assets', 'GD'],
  ['Data Analytics Lab', 'Reports, dashboards, and insights', 'DA'],
  ['Web & Digital Solutions', 'Websites and digital experiences', 'WD'],
  ['Client Management', 'Relationships, projects, and follow-ups', 'CM'],
  ['Business Operations', 'Processes, tasks, and administration', 'BO'],
  ['Marketing Center', 'Campaigns and content planning', 'MC'],
  ['Learning Academy', 'Skills, lessons, and study plans', 'LA']
];
const opportunities = [
  { title: 'Sample opportunity record', org: 'Example organization', status: 'Needs review', risk: 'Not verified', date: 'Demo record' },
  { title: 'Add your first opportunity', org: 'Paste an original listing URL to begin', status: 'Ready to add', risk: 'No assessment yet', date: '—' }
];

export default function Home() {
  const [active, setActive] = useState('Command Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [notice, setNotice] = useState('This is a starter dashboard. Connect the backend to enable saved data and live actions.');
  const [query, setQuery] = useState('');
  const visibleModules = useMemo(() => modules.filter(m => m[0].toLowerCase().includes(query.toLowerCase())), [query]);
  const submitCommand = () => {
    if (!commandText.trim()) return;
    setNotice(`Command received: “${commandText.trim()}”. Live assistant actions are not connected yet.`);
    setCommandText('');
  };

  return <main className="shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Command size={21}/></div><div><strong>JARVIS</strong><span>COMMAND CENTER</span></div><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{nav.map(item => { const Icon = item.icon; const selected = active === item.label; return item.label === 'Opportunity Watch' ? <Link key={item.label} href="/opportunities" className="nav-item"><Icon size={18}/><span>{item.label}</span></Link> : item.label === 'JARVIS AI Assistant' ? <Link key={item.label} href="/assistant" className="nav-item"><Icon size={18}/><span>{item.label}</span></Link> : <button key={item.label} className={`nav-item ${selected ? 'selected' : ''}`} onClick={() => {setActive(item.label);setMobileOpen(false);}}><Icon size={18}/><span>{item.label}</span>{selected && <span className="nav-dot"/>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="secure-card"><LockKeyhole size={17}/><div><b>Private workspace</b><span>Security setup pending</span></div></div><button className="nav-item"><Settings size={18}/>Settings & Security</button><div className="profile"><div className="avatar">A</div><div><b>Workspace owner</b><span>Local preview</span></div><ChevronRight size={16}/></div></div>
    </aside>
    {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation"/>}
    <section className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/> <b>{active}</b></div><div className="top-actions"><span className="system-status"><i/> FOUNDATION PREVIEW</span><button className="icon-button" aria-label="Help"><CircleHelp size={18}/></button><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button></div></header>
      <div className="content">
        <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> PERSONAL COMMAND ENVIRONMENT</div><h1>Good evening.</h1><p className="muted">Your workspace is taking shape. Here’s your command overview.</p></div><div className="date-chip"><Activity size={16}/> System foundation · Phase 1</div></div>
        <div className="notice"><AlertTriangle size={17}/><span>{notice}</span></div>
        <section className="assistant-panel"><div className="assistant-orb"><Command size={25}/></div><div className="assistant-copy"><div className="assistant-title">JARVIS <span>LOCAL PREVIEW</span></div><h2>What would you like to work on?</h2><p>Enter a note or command. External actions will require a connected service and your approval.</p></div><div className="command-box"><input value={commandText} onChange={e => setCommandText(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitCommand()} placeholder="Type a command or ask a question…" aria-label="Command input"/><button className="mic-button" title="Voice input is not connected" aria-label="Voice input unavailable"><Mic size={18}/></button><button className="send-button" onClick={submitCommand} aria-label="Send command"><Send size={17}/></button></div></section>
        <div className="section-heading"><div><h2>Command overview</h2><p className="muted">Your key work areas at a glance</p></div><span className="subtle-tag">DEMO DATA</span></div>
        <div className="stats-grid"><div className="stat-card"><div className="stat-icon purple"><Workflow/></div><span>Active workflows</span><strong>—</strong><small>Connect services to begin</small></div><div className="stat-card"><div className="stat-icon blue"><ShieldCheck/></div><span>Verified opportunities</span><strong>0</strong><small>No listings verified yet</small></div><div className="stat-card"><div className="stat-icon gold"><FileCheck2/></div><span>Awaiting your approval</span><strong>0</strong><small>Nothing needs a decision</small></div><div className="stat-card"><div className="stat-icon green"><CheckCircle2/></div><span>Completed tasks</span><strong>0</strong><small>Ready when you are</small></div></div>
        <div className="two-column"><section className="panel"><div className="panel-heading"><div><h2>Opportunity Watch</h2><p className="muted">Track listings before taking action</p></div><Link href="/opportunities" className="text-button">Open watch <ArrowUpRight size={15}/></Link></div><div className="opportunity-list">{opportunities.map((o,i)=><div className="opportunity" key={o.title}><div className="opportunity-symbol">{i===0?'◈':'＋'}</div><div className="opportunity-main"><b>{o.title}</b><span>{o.org}</span><div className="opportunity-meta"><span>{o.status}</span><span>{o.risk}</span></div></div><small>{o.date}</small></div>)}</div><div className="panel-foot">No live listings are being monitored in this preview.</div></section>
        <section className="panel approval-panel"><div className="panel-heading"><div><h2>Approval Center</h2><p className="muted">You stay in control of important actions</p></div><div className="approval-icon"><LockKeyhole size={18}/></div></div><div className="approval-empty"><div className="empty-check"><CheckCircle2 size={25}/></div><b>Nothing awaiting approval</b><p>Before sending messages, submitting applications, publishing, spending money, or deleting data, JARVIS will ask for your approval.</p></div><button className="outline-button" onClick={() => setActive('Approval Center')}>View approval center <ChevronRight size={15}/></button></section></div>
        <section className="modules-section"><div className="section-heading"><div><h2>Your business modules</h2><p className="muted">One workspace for your growing projects</p></div><label className="module-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a module…"/></label></div><div className="modules-grid">{visibleModules.map(m=><button className="module-card" key={m[0]} onClick={() => setNotice(`${m[0]} is planned for a future build phase.`)}><span className="module-code">{m[2]}</span><span className="module-text"><b>{m[0]}</b><small>{m[1]}</small></span><ArrowUpRight size={16}/></button>)}</div></section>
        <footer><span>JARVIS COMMAND CENTER · FOUNDATION PREVIEW</span><span><LockKeyhole size={12}/> Private by design. External actions require approval.</span></footer>
      </div>
    </section>
  </main>;
}
