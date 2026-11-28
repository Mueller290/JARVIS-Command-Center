'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, Bell, BriefcaseBusiness, CheckCircle2,
  ChevronRight, CircleHelp, Command, FileCheck2, FolderOpen, LayoutDashboard,
  LockKeyhole, Menu, Search, Send, Settings, ShieldCheck, Sparkles, Workflow, X,
  Building2, Wallet, Globe2, BookOpen, Plus, Trash2
} from 'lucide-react';

type ModuleKey = 'Business HQ' | 'Financial Command' | 'Website Command' | 'Company Knowledge' | 'Approval Center';
type RecordItem = { id: string; module: ModuleKey; title: string; detail: string; status: string; createdAt: string };
const nav = [
  { label: 'Command Dashboard', icon: LayoutDashboard },
  { label: 'Business HQ', icon: Building2 },
  { label: 'Financial Command', icon: Wallet },
  { label: 'Website Command', icon: Globe2 },
  { label: 'Company Knowledge', icon: BookOpen },
  { label: 'Approval Center', icon: FileCheck2 }
] as const;
const modules: {key: ModuleKey; description: string; code: string; icon: typeof Building2; fields: string; placeholder: string}[] = [
  {key:'Business HQ',description:'Divisions, projects, priorities, and operating tasks',code:'HQ',icon:Building2,fields:'Company, division, project, task, or priority',placeholder:'Describe the project, task, owner, or next step…'},
  {key:'Financial Command',description:'Revenue, expenses, budgets, and targets',code:'$',icon:Wallet,fields:'Financial item or transaction note',placeholder:'Example: $250 software expense — planned, not paid'},
  {key:'Website Command',description:'Digital properties, domains, ownership, and site checks',code:'WEB',icon:Globe2,fields:'Website or digital property',placeholder:'Add site, domain, platform, registrar, or issue…'},
  {key:'Company Knowledge',description:'Approved operating notes and company reference material',code:'KB',icon:BookOpen,fields:'Knowledge title',placeholder:'Add company policy, process, or reference note…'},
  {key:'Approval Center',description:'Owner decisions and sensitive-action requests',code:'OK',icon:ShieldCheck,fields:'Action requiring your decision',placeholder:'Describe the exact action, scope, cost, and destination…'}
];

export default function Home() {
  const [active, setActive] = useState<string>('Command Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [status, setStatus] = useState('Planned');
  const [notice, setNotice] = useState('JARVIS foundation workspace. Records entered here are saved in this browser only until secure account authentication is connected.');
  const activeModule = modules.find(m => m.key === active);
  const filteredModules = useMemo(() => modules.filter(m => (m.key+' '+m.description).toLowerCase().includes(query.toLowerCase())), [query]);
  const moduleRecords = records.filter(r => r.module === active);
  useEffect(() => {
    try { const saved = window.localStorage.getItem('jarvis-workspace-records-v1'); if (saved) setRecords(JSON.parse(saved) as RecordItem[]); } catch { setNotice('Local workspace data could not be loaded.'); }
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem('jarvis-workspace-records-v1', JSON.stringify(records)); } catch { /* Browser storage may be unavailable. */ }
  }, [records]);
  const addRecord = () => {
    if (!activeModule || !title.trim()) return;
    const item: RecordItem = {id: crypto.randomUUID(),module:activeModule.key,title:title.trim(),detail:detail.trim(),status,createdAt:new Date().toISOString()};
    setRecords(prev => [item,...prev]); setTitle(''); setDetail(''); setNotice('Saved in this browser. This is not yet synced to Supabase.');
  };
  const deleteRecord = (id:string) => setRecords(prev => prev.filter(r => r.id !== id));
  const submitCommand = () => {
    if (!commandText.trim()) return;
    setNotice('Command captured as a note. AI command execution and external integrations are not connected yet.');
    setCommandText('');
  };
  const choose = (label:string) => { setActive(label); setMobileOpen(false); };
  const count = (key:ModuleKey) => records.filter(r=>r.module===key).length;

  return <main className="shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Command size={21}/></div><div><strong>JARVIS</strong><span>COMMAND CENTER</span></div><button className="mobile-close icon-button" onClick={()=>setMobileOpen(false)} aria-label="Close menu"><X/></button></div>
      <div className="workspace-label">OPERATING SYSTEM</div>
      <nav>{nav.map(item=>{const Icon=item.icon;return <button key={item.label} className={`nav-item ${active===item.label?'selected':''}`} onClick={()=>choose(item.label)}><Icon size={18}/><span>{item.label}</span>{active===item.label&&<span className="nav-dot"/>}</button>;})}</nav>
      <div className="sidebar-bottom"><div className="secure-card"><LockKeyhole size={17}/><div><b>Owner-controlled workspace</b><span>Cloud authentication pending</span></div></div><button className="nav-item" onClick={()=>setNotice('Security setup is pending Supabase project configuration and authentication testing.')}><Settings size={18}/>Settings & Security</button><div className="profile"><div className="avatar">A</div><div><b>Workspace owner</b><span>Development branch</span></div><ChevronRight size={16}/></div></div>
    </aside>
    {mobileOpen&&<button className="scrim" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"/>}
    <section className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={()=>setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">JARVIS <ChevronRight size={14}/><b>{active}</b></div><div className="top-actions"><span className="system-status"><i/> DEVELOPMENT BUILD</span><button className="icon-button" aria-label="Help" onClick={()=>setNotice('JARVIS is being built in stages. Browser-saved records are local to this device.') }><CircleHelp size={18}/></button><button className="icon-button" aria-label="Notifications" onClick={()=>choose('Approval Center')}><Bell size={18}/></button></div></header>
      <div className="content">
        <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> PERSONAL COMMAND ENVIRONMENT</div><h1>{active==='Command Dashboard'?'Good evening.':active}</h1><p className="muted">{active==='Command Dashboard'?'Your business command overview.':activeModule?.description}</p></div><div className="date-chip"><Activity size={16}/> Phase 1 · Core systems</div></div>
        <div className="notice"><AlertTriangle size={17}/><span>{notice}</span></div>
        {active==='Command Dashboard' ? <>
          <section className="assistant-panel"><div className="assistant-orb"><Command size={25}/></div><div className="assistant-copy"><div className="assistant-title">JARVIS <span>DEVELOPMENT BUILD</span></div><h2>What would you like to work on?</h2><p>Capture a command or open one of your five operating systems.</p></div><div className="command-box"><input value={commandText} onChange={e=>setCommandText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitCommand()} placeholder="Type a command or note…" aria-label="Command input"/><button className="send-button" onClick={submitCommand} aria-label="Save command"><Send size={17}/></button></div></section>
          <div className="section-heading"><div><h2>Operating overview</h2><p className="muted">Records currently saved in this browser</p></div><span className="subtle-tag">LOCAL WORKSPACE</span></div>
          <div className="stats-grid">{modules.slice(0,4).map(m=><button key={m.key} className="stat-card stat-click" onClick={()=>choose(m.key)}><div className="stat-icon blue"><m.icon/></div><span>{m.key}</span><strong>{count(m.key)}</strong><small>Saved records · Open module</small></button>)}</div>
          <div className="two-column"><section className="panel"><div className="panel-heading"><div><h2>Business divisions</h2><p className="muted">Planned company structure</p></div><button className="text-button" onClick={()=>choose('Business HQ')}>Open HQ <ArrowUpRight size={15}/></button></div>{['Starlight Dust Studios','West Valley Mobile Phlebotomy','Retail & E-Commerce','Starlight Learning','JARVIS Command Center'].map((d,i)=><div className="opportunity" key={d}><div className="opportunity-symbol">{['✦','◈','◇','✧','⌘'][i]}</div><div className="opportunity-main"><b>{d}</b><span>{i===0?'Creative services and Data & Analytics':i===1?'Subject to applicable licensing and compliance':i===2?'Online retail and store operations':i===3?'Educational content and learning resources':'Internal operating platform'}</span></div><small>Planned</small></div>)}<div className="panel-foot">Crowned by Grace Photography remains separate and excluded.</div></section>
          <section className="panel approval-panel"><div className="panel-heading"><div><h2>Approval Center</h2><p className="muted">You retain final authority</p></div><div className="approval-icon"><LockKeyhole size={18}/></div></div><div className="approval-empty"><div className="empty-check"><CheckCircle2 size={25}/></div><b>{count('Approval Center')} saved requests</b><p>Approval records entered in this development build are notes only. No external action can be executed from them.</p></div><button className="outline-button" onClick={()=>choose('Approval Center')}>Open approval center <ChevronRight size={15}/></button></section></div>
          <section className="modules-section"><div className="section-heading"><div><h2>Your five core systems</h2><p className="muted">Open a module to add and manage its working records</p></div><label className="module-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a system…"/></label></div><div className="modules-grid">{filteredModules.map(m=><button className="module-card" key={m.key} onClick={()=>choose(m.key)}><span className="module-code">{m.code}</span><span className="module-text"><b>{m.key}</b><small>{m.description}</small></span><ArrowUpRight size={16}/></button>)}</div></section>
        </> : activeModule ? <>
          <section className="panel module-workspace"><div className="panel-heading"><div><div className="eyebrow">CORE OPERATING SYSTEM</div><h2>{activeModule.key}</h2><p className="muted">{activeModule.description}</p></div><div className="approval-icon"><activeModule.icon size={19}/></div></div>
            <div className="record-form"><label>{activeModule.fields}<input value={title} onChange={e=>setTitle(e.target.value)} placeholder={activeModule.fields}/></label><label>Details<textarea value={detail} onChange={e=>setDetail(e.target.value)} placeholder={activeModule.placeholder}/></label><div className="form-bottom"><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{['Idea','Planned','In progress','Pending approval','Active / verified','Paused','Completed'].map(s=><option key={s}>{s}</option>)}</select></label><button className="primary-action" onClick={addRecord} disabled={!title.trim()}><Plus size={16}/> Add record</button></div></div>
          </section>
          <div className="section-heading records-heading"><div><h2>Saved records</h2><p className="muted">{moduleRecords.length} record{moduleRecords.length===1?'':'s'} · Stored in this browser</p></div><span className="subtle-tag">LOCAL ONLY</span></div>
          <section className="panel records-list">{moduleRecords.length===0?<div className="approval-empty"><div className="empty-check"><FolderOpen size={22}/></div><b>No records yet</b><p>Add your first item above. It will remain on this browser until cloud sync is implemented.</p></div>:moduleRecords.map(r=><article className="saved-record" key={r.id}><div className="record-copy"><b>{r.title}</b><p>{r.detail||'No additional details.'}</p><div className="record-meta"><span>{r.status}</span><span>{new Date(r.createdAt).toLocaleString()}</span></div></div><button className="delete-record" onClick={()=>deleteRecord(r.id)} aria-label={`Delete ${r.title}`}><Trash2 size={16}/></button></article>)}</section>
        </> : <section className="panel"><h2>Choose a system</h2><p className="muted">Select one of the core systems from the navigation.</p></section>}
        <footer><span>JARVIS COMMAND CENTER · DEVELOPMENT BUILD</span><span><LockKeyhole size={12}/> Local records only · No external actions enabled</span></footer>
      </div>
    </section>
  </main>;
}
