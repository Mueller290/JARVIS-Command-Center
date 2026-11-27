# JARVIS Command Center

Responsive personal command-center foundation for Windows, macOS, iPhone, iPad, and Android/Samsung devices.

## Four core foundations
1. **AI chat connection:** authenticated server-side OpenAI chat endpoint. The API key stays on the server.
2. **Private memory:** Supabase memory is user-scoped with row-level security. Memory is OFF by default; the user must opt in, and can clear saved memory from the assistant screen.
3. **Approval foundation:** the database includes owner-scoped approval requests and a decision function. Recording approval does not execute an external action. No external action is currently connected.
4. **Voice:** browser speech recognition for voice input and speech synthesis for spoken replies. Availability depends on browser/device permissions.

## Setup
1. Use Node.js 20 or newer; run `npm install`.
2. Copy `.env.example` to `.env.local` and set the Supabase project URL and anon key.
3. Review and apply the SQL migrations in `supabase/migrations` in order to a fresh Supabase project. The repository currently has migration 0001 and 0003; there is no 0002 file, so confirm migration history before applying 0003 to an existing database.
4. Configure `OPENAI_API_KEY` only as a server-side Vercel environment variable if you choose to activate paid API usage. Never expose it in browser code.
5. Configure Supabase Auth email/password settings and redirect URLs for the deployed site.
6. Run `npm run lint` and `npm run build`, deploy to HTTPS, then test sign-up, sign-in, private data isolation, memory opt-in/clear, microphone permission, and spoken replies.

## Safety and privacy
- Never commit .env files or secrets. Never ask users to paste API keys or passwords into chat.
- Memory is opt-in and off by default. Clearing memory permanently deletes the signed-in user's rows from `jarvis_memory`.
- Approval status is not execution permission. Any future external action must check a fresh, user-specific approval server-side immediately before execution.
- No applications, bids, messages, purchases, publishing, or destructive actions are executed by this starter assistant.
- Do not store protected health information in this general-purpose workspace.

## Install on devices
After deployment to a public HTTPS address:
- Android/Samsung: open in Chrome and choose Install app or Add to Home screen.
- iPhone/iPad: open in Safari, Share, then Add to Home Screen.
- Windows/macOS: open in Edge/Chrome and choose Install when offered.

These are PWA installs, not native app-store packages. No production URL or native desktop installer is included yet.
