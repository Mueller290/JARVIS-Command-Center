import Link from 'next/link';
import { updatePassword } from './actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ResetPasswordPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params=await searchParams;
  const supabase=await createSupabaseServerClient();
  const {data:{claims}}=await supabase.auth.getClaims();
  return <main style={shell}><section style={card}>
    <div style={brand}>JARVIS · COMMAND CENTER</div><h1 style={{fontSize:28}}>Choose a new password</h1>
    {!claims?<><p style={muted}>Your reset link may have expired. Request a new one to continue.</p><Link href="/forgot-password" style={{color:'#70dff4'}}>Request another reset link</Link></>:<>
      {params.error&&<p role="alert" style={notice}>Passwords must match and contain at least 10 characters. Try again.</p>}
      <form action={updatePassword} style={{display:'grid',gap:14}}>
        <input name="password" type="password" minLength={10} autoComplete="new-password" placeholder="New password (10+ characters)" required style={input}/>
        <input name="confirm_password" type="password" minLength={10} autoComplete="new-password" placeholder="Confirm new password" required style={input}/>
        <button style={button}>Update password</button>
      </form></>}
  </section></main>;
}
const shell={minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#080d18',color:'#edf3ff'};
const card={width:'100%',maxWidth:420,padding:32,border:'1px solid #294057',borderRadius:16,background:'#0e1828'};
const brand={color:'#5ad9f5',letterSpacing:2,fontSize:11,fontWeight:700 as const};
const muted={color:'#91a0b8',fontSize:13};
const notice={padding:12,borderRadius:8,background:'#352522',color:'#ffd3b0',fontSize:13};
const input={width:'100%',padding:12,border:'1px solid #31445b',borderRadius:8,background:'#091321',color:'#edf3ff'};
const button={padding:13,border:0,borderRadius:8,background:'#17627a',color:'#effcff',fontWeight:700 as const};
