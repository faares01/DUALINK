const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('__DUALINK_DESKTOP__', Object.freeze({
  pickFolder: () => ipcRenderer.invoke('dualink:pick-folder'),
  listFolders: async ({ path }) => ipcRenderer.invoke('dualink:list-folders', path),
  approvedRoots: () => ipcRenderer.invoke('dualink:approved-roots'),
  saveMapping: mapping => ipcRenderer.invoke('dualink:save-mapping', mapping),
  notify: payload => ipcRenderer.invoke('dualink:notify', payload),
  deviceInfo: () => ipcRenderer.invoke('dualink:device-info')
}))
