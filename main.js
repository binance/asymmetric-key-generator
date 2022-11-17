const { app, BrowserWindow, ipcMain, clipboard, dialog } = require('electron')
const { generateKeyPairSync, createPublicKey } = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  CHANNEL_GENERATE_KEYS,
  CHANNEL_GENERATE_PUBLIC_KEYS,
  CHANNEL_COPY_KEY,
  CHANNEL_SAVE_KEY,
  GET_ALL_CHANNELS
} = require('./src/shared');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Events to Actions
  ipcMain.handle(CHANNEL_GENERATE_KEYS, async (event, ...args) => {
    let result = await generate_keys(...args)
    return result
  })

  ipcMain.handle(CHANNEL_GENERATE_PUBLIC_KEYS, async (event, ...args) => {
    let result = await generate_public_key(...args)
    return result
  })

  ipcMain.handle(CHANNEL_COPY_KEY, async (event, ...args) => {
    let result = await copy_key(...args)
    return result
  })

  ipcMain.handle(CHANNEL_SAVE_KEY, async (event, ...args) => {
    let result = await save_key(...args)
    return result
  })


  mainWindow.loadFile('index.html')

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
  GET_ALL_CHANNELS.map(channel => ipcMain.removeHandler(channel));
})


// Actions
async function generate_keys(bits) {
  return generateKeyPairSync('rsa', {
    modulusLength: bits,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    }
  });
}

async function generate_public_key(privateKey) {
  try {
    let publickKeyObject = createPublicKey(privateKey);
    return publickKeyObject.export({ format: 'pem', type: 'spki' });
  } catch (error) {
    return ""
  }
}

async function copy_key(data) {
  clipboard.writeText(data)
}

async function save_key(keyType, key) {
  var options = {
    title: `Save ${keyType}`,
    defaultPath: keyType,
    buttonLabel: "Save",

    filters: [
      { name: 'txt', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  };

  dialog.showSaveDialog(null, options).then(({canceled, filePath }) => {
    if (!canceled) {
      try {
        fs.writeFileSync(filePath, key, 'utf-8');
      } catch(err) {
        console.error(`Can not save file ${filePath}; ${err}`);
      }
    } else {
      console.warn("Save key dialog cancelled")
    }
  })
}
