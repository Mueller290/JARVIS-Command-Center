'use client';
import { signOut } from '@/app/login/actions';
export function LogoutButton(){return <form action={signOut}><button type="submit" style={{border:'1px solid #31445b',borderRadius:7,background:'#101c2c',color:'#a9bed4',padding:'7px 10px',fontSize:11}}>Sign out</button></form>}
