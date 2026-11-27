import Link from 'next/link';
import { signIn, signUp } from './actions';

const messages: Record<string, string> = {
  missing_fields: 'Enter your email and password.',
  invalid_credentials: 'Email or password is incorrect.',
  signup_validation: 'Use a valid email and a password with at least 10 characters.',
  signup_failed: 'We could not create the account. Check the email and try again.',
  auth_not_configured: 'The app is not connected to Supabase yet. Add its environment variables.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const params = await searchParams;
  const notice = params.error ? messages[params.error] : params.message === 'check_email'
    ? 'Check your inbox to confirm your email address before signing in.'
    : params.message === 'signed_out' ? 'You have been signed out.' : null;

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'radial-gradient(ellipse at 50% 0%, #18334c, #080d18 65%)', color: '#edf3ff' }}>
      <section style={{ width: '100%', maxWidth: 440, padding: 32, border: '1px solid #294057', borderRadius: 18, background: '#0e1828', boxShadow: '0 24px 80px #0008' }}>
        <div style={{ color: '#5ad9f5', letterSpacing: 3, fontSize: 11, fontWeight: 700 }}>JARVIS · COMMAND CENTER</div>
        <h1 style={{ fontSize: 30, margin: '14px 0 6px' }}>Secure access</h1>
        <p style={{ color: '#91a0b8', marginBottom: 24 }}>Sign in to open your private workspace, or create your account.</p>
        {notice && <p role="status" style={{ padding: 12, borderRadius: 8, background: '#172b3d', color: '#a8e8f5', fontSize: 13 }}>{notice}</p>}
        <form action={signIn} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6, color: '#b9c7da', fontSize: 12 }}>Email address
            <input name="email" type="email" autoComplete="email" required style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: 6, color: '#b9c7da', fontSize: 12 }}>Password
            <input name="password" type="password" autoComplete="current-password" required style={inputStyle} />
          </label>
          <input type="hidden" name="next" value={params.next || '/'} />
          <button type="submit" style={buttonStyle}>Sign in</button>
        </form>
        <div style={{ borderTop: '1px solid #24364c', margin: '24px 0 18px' }} />
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Create an account</h2>
        <form action={signUp} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6, color: '#b9c7da', fontSize: 12 }}>Display name
            <input name="display_name" type="text" autoComplete="name" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: 6, color: '#b9c7da', fontSize: 12 }}>Email address
            <input name="email" type="email" autoComplete="email" required style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: 6, color: '#b9c7da', fontSize: 12 }}>Password (10 characters minimum)
            <input name="password" type="password" minLength={10} autoComplete="new-password" required style={inputStyle} />
          </label>
          <button type="submit" style={secondaryButtonStyle}>Create account</button>
        </form>
        <p style={{ marginTop: 18, fontSize: 12, color: '#91a0b8' }}><Link href="/forgot-password" style={{ color: '#70dff4' }}>Forgot your password?</Link></p>
      </section>
    </main>
  );
}

const inputStyle = { width: '100%', padding: '12px 13px', border: '1px solid #31445b', borderRadius: 8, background: '#091321', color: '#edf3ff', outlineColor: '#5ad9f5' };
const buttonStyle = { padding: '13px', border: 0, borderRadius: 8, background: '#17627a', color: '#effcff', fontWeight: 700, cursor: 'pointer' };
const secondaryButtonStyle = { ...buttonStyle, background: '#1a2940', border: '1px solid #3b536e' };
