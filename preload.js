const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('utils', {
  generate_keys: (bits) => ipcRenderer.invoke('generate_keys', bits),
  generate_public_key: (privateKey) => ipcRenderer.invoke('generate_public_key', privateKey),
  copy_key: (data) => ipcRenderer.invoke('copy_key', data),
  save_key: (keyType, key) => ipcRenderer.invoke('save_key', keyType, key),
})
