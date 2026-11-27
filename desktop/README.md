# JARVIS Desktop Companion

Target platforms: Windows 10/11 and macOS. The desktop companion will use a lightweight native shell around the existing JARVIS web application so the web and desktop experiences share one account and one backend.

## Phase 5 scope
1. Launch JARVIS in a dedicated desktop window.
2. Sign in using the existing JARVIS/Supabase account; never store passwords in the desktop app.
3. Request access to a local folder only when the owner chooses it through the operating-system folder picker.
4. Keep an explicit list of approved folders. Access is limited to those folders and can be revoked.
5. Start with read-only file browsing and preview. File creation, rename, move, overwrite, and deletion require a separate confirmation showing the exact path and action.
6. Never upload, email, publish, or share a local file unless the owner approves that specific action.
7. Keep secrets in the operating system's secure credential store; do not put API keys in the app bundle or browser storage.

## Safety boundaries
- No broad filesystem access, hidden background scanning, or automatic indexing.
- No access to the entire home directory by default.
- No destructive file operation without a just-in-time confirmation.
- No execution of downloaded files or scripts.
- A folder permission is not permission to send its contents to a cloud service.
- The desktop shell must not bypass server-side authentication or authorization.
- The app must show when local-folder access is active and provide a way to revoke it.

## Build and release status
This directory documents the approved product scope only. Native packaging, OS permissions, signing/notarization, installers, and auto-updates are not configured yet. The desktop app is not currently installable. Those steps require a confirmed production JARVIS URL and platform build/testing on Windows and macOS.

## Release checklist
- [ ] Native shell and secure navigation allowlist
- [ ] Windows build and installer tested
- [ ] macOS build and signed/notarized installer tested
- [ ] OS folder picker and per-folder permissions tested
- [ ] Read-only browsing and file previews tested
- [ ] Confirmations for every write/destructive operation
- [ ] Authentication, logout, and session-expiry tested
- [ ] No secrets embedded in installer
- [ ] Accessibility and update flow tested
