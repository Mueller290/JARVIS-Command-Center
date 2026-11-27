import Link from 'next/link';
import { requestPasswordReset } from './actions';

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  const notice = params.message ? 'If that email is registered, a password reset link is on its way.' :
    params.error === 'missing_email' ? 'Enter your email address.' :
    params.error ? 'We could not start the reset. Check the email and try again.' : null;
  return <main style={shell}><section style={card}>
    <div style={brand}>JARVIS · COMMAND CENTER</div><h1 style={{fontSize:28}}>Reset password</h1>
    <p style={muted}>Enter the email address connected to your account.</p>
    {notice && <p role="status" style={noticeStyle}>{notice}</p>}
    <form action={requestPasswordReset} style={{display:'grid',gap:14}}>
      <input name="email" type="email" autoComplete="email" placeholder="Email address" required style={input}/>
      <button style={button}>Send reset link</button>
    </form>
    <p style={{marginTop:20}}><Link href="/login" style={{color:'#70dff4'}}>Back to sign in</Link></p>
  </section></main>;
}
const shell={minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#080d18',color:'#edf3ff'};
const card={width:'100%',maxWidth:420,padding:32,border:'1px solid #294057',borderRadius:16,background:'#0e1828'};
const brand={color:'#5ad9f5',letterSpacing:2,fontSize:11,fontWeight:700 as const};
const muted={color:'#91a0b8',fontSize:13};
const noticeStyle={padding:12,borderRadius:8,background:'#172b3d',color:'#a8e8f5',fontSize:13};
const input={width:'100%',padding:12,border:'1px solid #31445b',borderRadius:8,background:'#091321',color:'#edf3ff'};
const button={padding:13,border:0,borderRadius:8,background:'#17627a',color:'#effcff',fontWeight:700 as const};
