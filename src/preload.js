const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('utils', {
  generateKeys: (keyType, passphrase) => ipcRenderer.invoke('generate_keys', keyType, passphrase),
  generatePublicKey: (privateKey, passphrase) => ipcRenderer.invoke('generate_public_key', privateKey, passphrase),
  copyKey: (data) => ipcRenderer.invoke('copy_key', data),
  saveKey: (keyType, key) => ipcRenderer.invoke('save_key', keyType, key),
  savePairs: (pairs, keyType, options) => ipcRenderer.invoke('save_pairs', pairs, keyType, options)
})
