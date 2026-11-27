# JARVIS Desktop Local-File Permission Model

This is the required behavior for the future Windows/macOS companion.

## Default state
Local file access is OFF. JARVIS cannot browse or inspect files until the owner explicitly chooses a folder using the operating-system folder picker.

## Permission levels
- **Not connected:** no local files are visible.
- **Approved folder — read only:** JARVIS may list and preview files inside the selected folder.
- **One-time write approval:** JARVIS may perform one clearly described create, rename, or move operation after the owner confirms the exact source and destination.
- **One-time delete approval:** deletion requires a separate confirmation identifying the exact item. No bulk delete by default.

## Required safeguards
- Resolve and validate paths so symbolic links or parent-directory traversal cannot escape an approved folder.
- Do not follow links outside an approved folder.
- Do not access hidden/system folders unless separately selected.
- Do not upload or transmit file contents as a side effect of previewing them.
- Show a clear audit entry for local file changes.
- Re-check permission immediately before each operation; do not rely on an old approval.
- Provide a visible revoke control and clear remembered folder grants on logout if the owner chooses.

## Not included in the first release
- Whole-device search or indexing
- Background monitoring
- Automatic file cleanup
- Running scripts or executables
- Silent cloud backup or synchronization
