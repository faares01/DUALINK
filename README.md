# DUALINK

**Everything where you expect it.**

DUALINK is a low-overhead cross-platform workspace for Windows and Linux. It lets you map any two folders, send a file to a chosen destination on the other side, browse the other machine on demand, protect deletes, and keep a small shared note space.

Created by **FARES ALAMRI (FAA)**  
https://faaa.space

## Included in this starter

- Polished responsive web dashboard (PWA-ready) with local persistence.
- Folder mappings, sync queue, conflict choices, Send Across, Other Side browser, notes, and settings.
- PHP JSON API structure for Google-only authentication and account-scoped data.
- MySQL schema for phpMyAdmin import.
- Desktop sync-agent contract ready for a small Windows/Linux companion (Tauri/Electron or native daemon).

## Run locally

```bash
php -S localhost:8080
```

Then open `http://localhost:8080`.

The in-app **Guide & Wiki** contains the full deployment and dual-boot setup guide. After deployment, use the Server Status card to verify that the PHP API and MySQL database are reachable.

## Production architecture

DUALINK is a web application hosted on your server. The website is the control plane; the Windows/Linux app is a lightweight native shell that opens the same secured site and supplies optional operating-system permissions such as notifications, start-at-login, folder picker, and the right-click Send to DUALINK action. The website remains the single source of truth.

All sensitive material stays on the server: database credentials, Google OAuth secret, sessions, transfer records, storage credentials, and file signing keys. The browser and desktop shell only receive a secure, HttpOnly session cookie after Google login—never a database password or OAuth secret.

For dual-boot use, configure a server/object-storage relay—one OS cannot run a background service while it is powered off.

1. Import `api/schema.sql` using phpMyAdmin.
2. On your **server only**, copy `api/config.example.php` to `api/config.php` and set MySQL + Google OAuth credentials. Do not create or commit this file on your computer or in GitHub.
3. Serve this folder with PHP and point desktop agents to `/api`.

## Security

`api/config.php` exists only on the server and is ignored by Git. Set its permissions to owner-read only (`chmod 600 api/config.php`), keep it outside `public_html` when the host supports that, and restrict its database user to the DUALINK database only. Use HTTPS everywhere.

Never commit `api/config.php` or OAuth secrets.

## Credits

DUALINK is made by **FARES ALAMRI — FAA**. Visit [faaa.space](https://faaa.space/?utm_source=chatgpt.com).
