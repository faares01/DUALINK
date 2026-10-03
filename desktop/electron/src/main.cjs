const { app, BrowserWindow, dialog, ipcMain, Notification, shell, session } = require('electron')
const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')

const APP_URL = process.env.DUALINK_APP_URL || 'https://faa2.online/app.html'
const APP_ORIGIN = new URL(APP_URL).origin
const configPath = () => path.join(app.getPath('userData'), 'dualink-device.json')
const defaultState = () => ({ deviceId: crypto.randomUUID(), approvedRoots: [], mappings: [] })

async function readState() {
  try { return { ...defaultState(), ...JSON.parse(await fs.readFile(configPath(), 'utf8')) } }
  catch { return defaultState() }
}
async function writeState(state) { await fs.writeFile(configPath(), JSON.stringify(state, null, 2), { mode: 0o600 }) }
function isApproved(state, candidate) {
  const resolved = path.resolve(candidate)
  return state.approvedRoots.some(root => resolved === root || resolved.startsWith(root + path.sep))
}
function assertApproved(state, candidate) {
  if (!isApproved(state, candidate)) throw new Error('This folder is not approved. Choose it first from the desktop app.')
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 840, minWidth: 940, minHeight: 640, show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, sandbox: true, nodeIntegration: false }
  })
  win.once('ready-to-show', () => win.show())
  win.webContents.setWindowOpenHandler(({ url }) => { if (url.startsWith('https://')) shell.openExternal(url); return { action: 'deny' } })
  win.loadURL(APP_URL)
}
app.whenReady().then(async () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({ responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': ["default-src 'self' https://faa2.online; script-src 'self' https://faa2.online; style-src 'self' 'unsafe-inline' https://faa2.online https://fonts.googleapis.com; img-src 'self' data: https://faa2.online https://lh3.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://faa2.online; frame-src 'none'; object-src 'none'"] } })
  })
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })

ipcMain.handle('dualink:pick-folder', async () => {
  const result = await dialog.showOpenDialog({ title: 'Choose a folder for DUALINK', properties: ['openDirectory', 'createDirectory'] })
  if (result.canceled || !result.filePaths[0]) return null
  const folder = path.resolve(result.filePaths[0]); const state = await readState()
  if (!state.approvedRoots.includes(folder)) { state.approvedRoots.push(folder); await writeState(state) }
  return folder
})
ipcMain.handle('dualink:list-folders', async (_event, requestedPath) => {
  const state = await readState(); assertApproved(state, requestedPath)
  const entries = await fs.readdir(requestedPath, { withFileTypes: true })
  return entries.filter(entry => entry.isDirectory()).sort((a,b) => a.name.localeCompare(b.name)).map(entry => ({ name: entry.name, path: path.join(requestedPath, entry.name) }))
})
ipcMain.handle('dualink:approved-roots', async () => (await readState()).approvedRoots)
ipcMain.handle('dualink:save-mapping', async (_event, mapping) => {
  const state = await readState(); assertApproved(state, mapping.localPath)
  const item = { id: crypto.randomUUID(), localPath: path.resolve(mapping.localPath), remotePath: mapping.remotePath, direction: mapping.direction, createdAt: new Date().toISOString() }
  state.mappings.push(item); await writeState(state); return item
})
ipcMain.handle('dualink:notify', async (_event, payload) => {
  if (Notification.isSupported()) new Notification({ title: payload.title || 'DUALINK', body: payload.body || '' }).show()
  return true
})
ipcMain.handle('dualink:device-info', async () => ({ id: (await readState()).deviceId, platform: process.platform, appVersion: app.getVersion(), origin: APP_ORIGIN }))
