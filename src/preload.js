const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('utils', {
  generateKeys: (keyType) => ipcRenderer.invoke('generate_keys', keyType),
  generatePublicKey: (privateKey) => ipcRenderer.invoke('generate_public_key', privateKey),
  copyKey: (data) => ipcRenderer.invoke('copy_key', data),
  saveKey: (keyType, key) => ipcRenderer.invoke('save_key', keyType, key)
})
