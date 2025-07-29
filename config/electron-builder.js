const os = require('os')
const fs = require('fs')
const path = require('path')
const { fileURLToPath } = require('url')
const { notarize } = require('@electron/notarize')

const config = {
  appId: 'asymmetric-key-generator',
  productName: 'AsymmetricKeyGenerator',
  mac: {
    target: {
      target: 'dmg',
      arch: ['universal']
    }
  },
  win: {
    target: 'nsis'
  },
  linux: {
    target: 'AppImage'
  },
  publish: [
    {
      provider: 'generic',
      url: '',
    },
  ],
  afterSign: async (context) => {
    const { electronPlatformName, appOutDir } = context
    if (electronPlatformName !== 'darwin') {
      return
    }

    if (
      !process.env.APP_STORE_CONNECT_API_KEY_ID ||
      !process.env.APP_STORE_CONNECT_API_ISSUER_ID ||
      !process.env.APP_STORE_CONNECT_API_KEY_CONTENT
    ) {
      console.log(
        'Skipping notarization because APP_STORE_CONNECT_API_KEY_ID, APP_STORE_CONNECT_API_ISSUER_ID or APP_STORE_CONNECT_API_KEY_CONTENT env variables are not set',
      )
      return
    }

    const appName = context.packager.appInfo.productFilename

    // @ts-ignore
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const tempFile = path.join(dirname, 'app-store-connect-api-key')
    fs.writeFileSync(tempFile, process.env.APP_STORE_CONNECT_API_KEY_CONTENT)

    return await notarize({
      appPath: `${appOutDir}/${appName}.app`,
      appleApiKeyId: process.env.APP_STORE_CONNECT_API_KEY_ID,
      appleApiKey: tempFile,
      appleApiIssuer: process.env.APP_STORE_CONNECT_API_ISSUER_ID,
    })
  }
}

if (os.platform() === 'win32' && process.env.WIN_CERTIFICATE_SUBJECT_NAME) {
  config.win.certificateSubjectName = process.env.WIN_CERTIFICATE_SUBJECT_NAME
}

module.exports = config
