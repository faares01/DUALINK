# DUALINK Desktop Shell

The desktop app is intentionally a thin, native shell around the hosted DUALINK website. There is no second database, no embedded secret, and no copied account system.

It gives the hosted web application app-like behavior:

- native application window on Windows and Linux;
- start at login;
- system notifications for **project.zip arrived**;
- folder permissions selected by the user;
- file-manager integration for **Send to DUALINK**;
- a secure local bridge used only after the user signs in to the hosted site.

## Build later with Tauri 2

Install Rust and the Tauri prerequisites for Windows/Linux, then create the normal Tauri app files around `src-tauri/`. Point the shell to your production `https://` DUALINK domain. Do not load the hosted application over HTTP and do not put server credentials in `tauri.conf.json`.

The `src-tauri/capabilities/default.json` file documents the minimum permission boundary. Keep filesystem access limited to folders explicitly picked by the person using the app.
