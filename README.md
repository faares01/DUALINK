# DUALINK

**Everything where you expect it.**

DUALINK is a low-overhead cross-platform workspace for Windows and Linux. It keeps account data in one place and uses a small native companion to move selected files through a private server queue when the other dual-boot system is offline.

Created by **FARES ALAMRI (FAA)**  
https://faaa.space

## What works today

- Google-only sign-in, server-side session validation, and account-scoped MySQL data.
- Folder links and shared notes persisted through the PHP API.
- **Send Across**: choose a native file, select a linked destination, queue it for an enrolled device, then receive a native arrival notification when that device opens DUALINK.
- Private transfer storage: files live under server-side storage, are never publicly served, and require the signed-in account plus target device to download.
- Native installers for Windows and Linux from GitHub Releases: Windows installer/portable, AppImage, DEB, RPM, and Pacman.
- A responsive control dashboard, first-run onboarding, server health/statistics, and in-app setup guide.

## Run locally

```bash
php -S localhost:8080
```

Then open `http://localhost:8080`. For sign-in and transfers, create a server-only `api/config.php` with a real MySQL database and Google OAuth application first.

The in-app **Guide & Wiki** contains the full deployment and dual-boot setup guide. After deployment, use the Server Status card to verify that the PHP API and MySQL database are reachable.

## Install and connect two systems

1. Download the appropriate installer from [GitHub Releases](https://github.com/faares01/DUALINK/releases).
2. Install and open DUALINK on Linux, sign in with Google, and choose a file or folder when prompted. That choice explicitly grants local access.
3. Boot Windows, install and open DUALINK, and sign in with the **same** Google account. The device enrolls itself automatically.
4. In **Send Across**, choose a linked destination and send the file. It remains in your private queue while Windows is off.
5. The Windows companion polls only while running, writes the file into the chosen path, marks the transfer complete, and shows `DUALINK — file arrived`.

For Windows startup, enable the operating system's “start at login” setting in the companion. On Linux, add the installed app to your desktop environment’s Startup Applications if your distribution does not register it automatically.

## Production architecture

DUALINK is a web application hosted on your server. The website is the control plane; the Windows/Linux app is a lightweight native shell that opens the same secured site and supplies optional operating-system permissions such as notifications, start-at-login, folder picker, and the right-click Send to DUALINK action. The website remains the single source of truth.

All sensitive material stays on the server: database credentials, Google OAuth secret, sessions, transfer records, storage credentials, and file signing keys. The browser and desktop shell only receive a secure, HttpOnly session cookie after Google login—never a database password or OAuth secret.

For dual-boot use, DUALINK uses its server-side relay—one OS cannot run a background service while it is powered off. The native companion polls the signed-in queue every 30 seconds only while the app is open.

1. Import `api/schema.sql` using phpMyAdmin.
2. On your **server only**, copy `api/config.example.php` to `api/config.php` and set MySQL + Google OAuth credentials. Do not create or commit this file on your computer or in GitHub.
3. Serve this folder with PHP and point desktop agents to `/app.html`.

## Operational limits

- The first production transfer limit is **1 GB per file**. Configure PHP's `upload_max_filesize`, `post_max_size`, and storage quota above the files you intend to move.
- Transfers are delivered by the companion while it is running; the queue safely waits through a dual-boot restart.
- Folder links and the Other Side UI are account-controlled. Full continuous two-way file watching, conflict resolution, version restore, and remote file indexing are planned next; they are deliberately not represented as completed background sync in this release.

## Security

`api/config.php` exists only on the server and is ignored by Git. Set its permissions to owner-read only (`chmod 600 api/config.php`), keep it outside `public_html` when the host supports that, and restrict its database user to the DUALINK database only. Use HTTPS everywhere.

Never commit `api/config.php` or OAuth secrets.

## Credits

DUALINK is made by **FARES ALAMRI — FAA**. Visit [faaa.space](https://faaa.space/?utm_source=chatgpt.com).
