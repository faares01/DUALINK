# Folder browsing contract

The hosted DUALINK website must never receive a raw, unrestricted filesystem permission. The desktop app injects one narrow bridge after the user selects an approved root folder:

```js
window.__DUALINK_DESKTOP__.listFolders({ platform: 'linux' | 'windows', path })
// => [{ name: 'Projects', path: '/home/fares/Projects' }]
```

The native shell must reject paths outside the folders approved by the user. The website uses this bridge only for the **New Folder Link** picker and does not persist or send its results until the person saves a folder link. The Electron companion implements this contract in `desktop/electron/src/preload.cjs`.
