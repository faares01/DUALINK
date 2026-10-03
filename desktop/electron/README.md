# DUALINK Desktop Companion

The companion is an Electron app for Windows and Linux. It loads the hosted DUALINK app from `https://faa2.online/app.html` but keeps filesystem permissions in the native process.

## What is real now

- Folder chooser is native (`showOpenDialog`).
- Approved roots are stored locally in the OS app-data directory with owner-only permissions where supported.
- Folder listing is blocked unless it is within an approved root.
- The website receives only a narrow preload bridge; it has no Node.js, shell, or unrestricted filesystem access.
- Notifications are native OS notifications.

## Run

```bash
cd desktop/electron
npm install
npm run start
```

## Package

Build on the target OS:

```bash
npm run dist
```

This produces NSIS/portable Windows artifacts and AppImage/DEB Linux artifacts. Cross-platform installers should be built by CI runners for their own platform.
