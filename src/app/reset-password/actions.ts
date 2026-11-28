'use server';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function updatePassword(formData: FormData) {
  const password=formData.get('password'), confirmation=formData.get('confirm_password');
  if(typeof password!=='string'||password.length<10||password!==confirmation) redirect('/reset-password?error=password_mismatch');
  const supabase=await createSupabaseServerClient();
  const {data:{claims}}=await supabase.auth.getClaims();
  if(!claims) redirect('/login?error=reset_session_expired');
  const {error}=await supabase.auth.updateUser({password});
  if(error) redirect('/reset-password?error=update_failed');
  redirect('/?message=password_updated');
}
