'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  ArrowLeft, ArrowUpRight, BadgeCheck, BriefcaseBusiness, Building2, CalendarDays,
  ExternalLink, Filter, Globe2, Link2, MapPin, Plus, Search, ShieldAlert,
  ShieldCheck, SlidersHorizontal, Sparkles, Trash2
} from 'lucide-react';
import Link from 'next/link';

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: string;
  location: string;
  url: string;
  deadline: string;
  notes: string;
  status: 'Needs review' | 'Saved';
};

const categories = ['All categories', 'Medical Assistant / CCMA', 'Phlebotomy', 'Mobile phlebotomy', 'Grants & funding', 'Government contracts', 'Graphic design', 'Data analytics', 'Web development', 'Education & content'];
type SavedRow = { id: string; title: string; organization_name: string; category: string | null; location: string | null; source_url: string; deadline: string | null; eligibility_notes: string | null; workflow_status: string; };

export default function OpportunityWatchPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [supabase] = useState(() => { try { return createSupabaseBrowserClient(); } catch { return null; } });
  const [storageState, setStorageState] = useState('loading');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [region, setRegion] = useState('Phoenix, AZ');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [url, setUrl] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [formCategory, setFormCategory] = useState(categories[1]);
  const [message, setMessage] = useState('Manual collection is ready. Add a listing URL to create a review record.');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadSaved() {
      if (!supabase) { setStorageState('unconfigured'); setMessage('Supabase project URL and anon key are not configured yet.'); return; }
      try {
        const auth = await supabase.auth.getUser();
        if (auth.error) throw auth.error;
        if (!auth.data.user) { setStorageState('signed-out'); setMessage('Sign in is required before saving private opportunities.'); return; }
        const result = await supabase.from('opportunities').select('id,title,organization_name,category,location,source_url,deadline,eligibility_notes,workflow_status').order('created_at', { ascending: false });
        if (result.error) throw result.error;
        if (cancelled) return;
        const rows = (result.data || []) as SavedRow[];
        setItems(rows.map(row => ({ id: row.id, title: row.title, organization: row.organization_name, category: row.category || 'Other', location: row.location || 'Location not specified', url: row.source_url, deadline: row.deadline || '', notes: row.eligibility_notes || '', status: row.workflow_status === 'saved' ? 'Saved' : 'Needs review' })));
        setStorageState('ready');
        setMessage('Private Supabase opportunity library connected.');
      } catch (error) { if (!cancelled) { setStorageState('error'); setMessage('Supabase could not load the opportunity library. Check project setup and database migration.'); } }
    }
    void loadSaved();
    return () => { cancelled = true; };
  }, [supabase]);

  const filtered = useMemo(() => items.filter(item => {
    const matchesText = [item.title, item.organization, item.location, item.notes].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All categories' || item.category === category;
    return matchesText && matchesCategory;
  }), [items, search, category]);

  function addOpportunity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !url.trim()) {
      setMessage('Please add a listing title and its original URL.');
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid protocol');
    } catch {
      setMessage('Enter a valid original web address beginning with https://');
      return;
    }
    const record: Opportunity = {
      id: Date.now(),
      title: title.trim(),
      organization: organization.trim() || 'Organization not entered',
      category: formCategory,
      location: region.trim() || 'Location not specified',
      url: parsed.toString(),
      deadline,
      notes: notes.trim(),
      status: 'Needs review'
    };
    setItems(current => [record, ...current]);
    setTitle(''); setOrganization(''); setUrl(''); setDeadline(''); setNotes('');
    setShowForm(false);
    setMessage('Listing added to this page for your review. Its details and legitimacy have not been independently verified.');
  }

  function removeOpportunity(id: number) {
    setItems(current => current.filter(item => item.id !== id));
    setMessage('The review record was removed from this page.');
  }

  return (
    <main className="opportunity-shell">
      <header className="opportunity-topbar">
        <Link href="/" className="back-link"><ArrowLeft size={16}/> Command dashboard</Link>
        <span className="preview-label"><i/> OPPORTUNITY WATCH · PREVIEW</span>
      </header>
      <div className="opportunity-content">
        <div className="opportunity-intro">
          <div>
            <div className="opportunity-eyebrow"><Sparkles size={14}/> DISCOVER · REVIEW · DECIDE</div>
            <h1>Opportunity Watch</h1>
            <p>Keep potential jobs, contracts, grants, and partnerships organized before you take action.</p>
          </div>
          <button className="add-opportunity-button" onClick={() => setShowForm(value => !value)}><Plus size={16}/> Add a listing</button>
        </div>

        <div className="opportunity-safety-note"><ShieldCheck size={18}/><div><b>You stay in control.</b><span>JARVIS will not apply, bid, contact an organization, accept terms, or spend money. Any future external action must be separately approved by you.</span></div></div>

        <section className="watch-controls">
          <div className="watch-search"><Search size={17}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search your saved listings…" aria-label="Search saved listings"/></div>
          <label className="watch-select"><Filter size={15}/><select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filter category">{categories.map(item => <option key={item}>{item}</option>)}</select></label>
          <label className="watch-region"><MapPin size={15}/><input value={region} onChange={event => setRegion(event.target.value)} aria-label="Search region" placeholder="Region"/></label>
        </section>

        {showForm && <form className="add-listing-form" onSubmit={addOpportunity}>
          <div className="form-heading"><div><h2>Add an opportunity for review</h2><p>Save the original listing details. This does not submit an application.</p></div><button type="button" className="close-form" onClick={() => setShowForm(false)}>Close</button></div>
          <div className="listing-fields">
            <label>Listing title *<input value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Medical Assistant — part time" required/></label>
            <label>Organization<input value={organization} onChange={event => setOrganization(event.target.value)} placeholder="Employer or funding organization"/></label>
            <label>Category<select value={formCategory} onChange={event => setFormCategory(event.target.value)}>{categories.slice(1).map(item => <option key={item}>{item}</option>)}</select></label>
            <label>Deadline (if listed)<input type="date" value={deadline} onChange={event => setDeadline(event.target.value)}/></label>
            <label className="wide-field">Original listing URL *<input type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://…" required/></label>
            <label className="wide-field">Notes<textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Pay, requirements, eligibility, contact details, or questions…" rows={3}/></label>
          </div>
          <div className="form-actions"><span>* Required fields</span><button type="submit" className="add-opportunity-button">Save for review <ArrowUpRight size={15}/></button></div>
        </form>}

        <div className="watch-message"><ShieldAlert size={16}/>{message}</div>

        <div className="watch-section-heading"><div><h2>Your opportunity library</h2><p>{filtered.length} saved {filtered.length === 1 ? 'record' : 'records'} · No live search is connected yet</p></div><span className="review-counter"><BriefcaseBusiness size={14}/>{items.length} saved</span></div>

        {filtered.length === 0 ? <section className="watch-empty">
          <div className="empty-search-icon"><Search size={24}/></div>
          <h3>{items.length === 0 ? 'Your watchlist is ready' : 'No matching listings'}</h3>
          <p>{items.length === 0 ? 'Add an opportunity you find online. Keep its original source link and review its requirements before deciding what to do.' : 'Try another search term or change the category filter.'}</p>
          {items.length === 0 && <button className="add-opportunity-button" onClick={() => setShowForm(true)}><Plus size={16}/> Add your first listing</button>}
        </section> : <div className="saved-opportunities">{filtered.map(item => <article className="saved-opportunity" key={item.id}>
          <div className="saved-opportunity-icon"><Building2 size={19}/></div>
          <div className="saved-opportunity-body"><div className="saved-opportunity-tags"><span>{item.category}</span><span className="unverified-tag">Not independently verified</span></div><h3>{item.title}</h3><p>{item.organization} · {item.location}</p>{item.notes && <p className="saved-notes">{item.notes}</p>}<div className="saved-meta">{item.deadline && <span><CalendarDays size={13}/> Deadline: {item.deadline}</span>}<span><Link2 size={13}/> Original source saved</span></div></div>
          <div className="saved-opportunity-actions"><a href={item.url} target="_blank" rel="noreferrer" className="source-link">Open source <ExternalLink size={13}/></a><button onClick={() => removeOpportunity(item.id)} className="remove-record" aria-label={`Remove ${item.title}`} title="Remove record"><Trash2 size={15}/></button></div>
        </article>)}</div>}

        <section className="future-work-panel"><div className="future-icon"><Globe2 size={19}/></div><div><b>Next connection: live opportunity discovery</b><p>Automated searches across trusted job, grant, and contracting sources require a server-side search provider and scheduled worker. Those connections are not enabled in this preview, so this page does not invent listings or claim to verify them.</p></div></section>
        <footer className="watch-footer"><span>JARVIS COMMAND CENTER · OPPORTUNITY WATCH</span><span><BadgeCheck size={13}/> Human approval required for external actions</span></footer>
      </div>
    </main>
  );
}
