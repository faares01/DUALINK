const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('__DUALINK_DESKTOP__', Object.freeze({
  pickFolder: () => ipcRenderer.invoke('dualink:pick-folder'),
  startLogin: () => ipcRenderer.invoke('dualink:start-login'),
  checkUpdates: () => ipcRenderer.invoke('dualink:check-updates'),
  pickFile: () => ipcRenderer.invoke('dualink:pick-file'),
  listFolders: async ({ path }) => ipcRenderer.invoke('dualink:list-folders', path),
  approvedRoots: () => ipcRenderer.invoke('dualink:approved-roots'),
  saveMapping: mapping => ipcRenderer.invoke('dualink:save-mapping', mapping),
  notify: payload => ipcRenderer.invoke('dualink:notify', payload),
  deviceInfo: () => ipcRenderer.invoke('dualink:device-info'),
  registerDevice: name => ipcRenderer.invoke('dualink:register-device', name),
  sendAcross: payload => ipcRenderer.invoke('dualink:send-across', payload),
  setStartAtLogin: enabled => ipcRenderer.invoke('dualink:set-start-at-login', enabled),
  getStartAtLogin: () => ipcRenderer.invoke('dualink:get-start-at-login')
}))
