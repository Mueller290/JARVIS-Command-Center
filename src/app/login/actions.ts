'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function safePath(value: FormDataEntryValue | null) {
  const path = typeof value === 'string' ? value : '/';
  return path.startsWith('/') && !path.startsWith('//') ? path : '/';
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function signIn(formData: FormData) {
  const email = formValue(formData, 'email');
  const password = formData.get('password');
  const next = safePath(formData.get('next'));

  if (!email || typeof password !== 'string' || !password) {
    redirect('/login?error=missing_fields');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect('/login?error=invalid_credentials');
  redirect(next);
}

export async function signUp(formData: FormData) {
  const email = formValue(formData, 'email');
  const password = formData.get('password');
  const displayName = formValue(formData, 'display_name');

  if (!email || typeof password !== 'string' || password.length < 10) {
    redirect('/login?error=signup_validation');
  }

  const supabase = await createSupabaseServerClient();
  const requestHeaders = await headers();
  const origin =
    requestHeaders.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${origin}/auth/callback?next=/`,
    },
  });

  if (error) redirect('/login?error=signup_failed');
  redirect('/login?message=check_email');
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login?message=signed_out');
}
