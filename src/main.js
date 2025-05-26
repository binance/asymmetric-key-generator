const { app, BrowserWindow, ipcMain, clipboard, dialog, nativeImage } = require('electron')
const { is } = require('electron-util')
const fs = require('fs');
const fsp = require('fs').promises;
const os = require('os');
const path = require('path');
const tar = require('tar');
const {
  CHANNEL_GENERATE_KEYS,
  CHANNEL_GENERATE_PUBLIC_KEYS,
  CHANNEL_COPY_KEY,
  CHANNEL_SAVE_KEY,
  CHANNEL_SAVE_KEY_PAIRS,
  GET_ALL_CHANNELS
} = require('./shared')
const { generateKeys, generatePublicKey, saveKeys } = require('./generate')

function createWindow () {
  let options = {
    width: 960,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  }

  if (is.linux) {
    options = { ...options, ...{ icon: nativeImage.createFromPath(path.join(__dirname, '../build/icons/256x256.png')) } }
  }

  const mainWindow = new BrowserWindow(options)

  // Events to Actions
  ipcMain.handle(CHANNEL_GENERATE_KEYS, async (event, ...args) => {
    const result = await generateKeys(...args)
    return result
  })

  ipcMain.handle(CHANNEL_GENERATE_PUBLIC_KEYS, async (event, ...args) => {
    const result = await generatePublicKey(...args)
    return result
  })

  ipcMain.handle(CHANNEL_COPY_KEY, async (event, ...args) => {
    const result = await copyKey(...args)
    return result
  })

  ipcMain.handle(CHANNEL_SAVE_KEY, async (event, ...args) => {
    const result = await promptSaveKey(...args)
    return result
  })

  ipcMain.handle(CHANNEL_SAVE_KEY_PAIRS, async (event, ...args) => {
    const result = await promptSaveKeyPairs(...args)
    return result
  })

  mainWindow.loadFile('assets/html/index.html')

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (!is.macos) app.quit()
  GET_ALL_CHANNELS.map(channel => ipcMain.removeHandler(channel))
})

async function copyKey (data) {
  clipboard.writeText(data)
}

async function promptSaveKey (keyType, key) {
  const options = {
    title: `Save ${keyType}`,
    defaultPath: keyType,
    buttonLabel: 'Save',

    filters: [
      { name: 'txt', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }

  const result = await dialog.showSaveDialog(null, options).then(({ canceled, filePath }) => {
    if (!canceled) {
      try {
        fs.writeFileSync(filePath, key, { encoding: 'utf8', mode: 0o600 })
        return 'Key saved'
      } catch (err) {
        return `Error. Can not save file ${filePath}`
      }
    } else {
      console.warn('Save key dialog cancelled')
    }
  })
  return result
}

async function promptSaveKeyPairs(
  keys = [],
  keyType,
  { count, passphrase } = {}
) {
  const options = {
    title: `Save key pairs`,
    defaultPath: `id_${keyType}.tar.gz`,
    buttonLabel: "Save",
    filters: [
      { name: "tar.gz", extensions: ["tar.gz"] },
      { name: "All Files", extensions: ["*"] },
    ],
  };

  count = count || 1;

  let remaining = count - keys.length;
  if (remaining > 0) {
    for (let i = 0; i < remaining; i++) {
      keys.push(await generateKeys(keyType, passphrase));
    }
  }

  const result = await dialog
    .showSaveDialog(null, options)
    .then(async ({ canceled, filePath }) => {
      if (!canceled) {
        try {
          await saveKeys(keys, filePath);
          return "Key pairs saved";
        } catch (err) {
          console.log(err);
          return `Error. Can not save file ${filePath}`;
        }
      } else {
        console.warn("Save key dialog cancelled");
      }
    });

  return result;
}
