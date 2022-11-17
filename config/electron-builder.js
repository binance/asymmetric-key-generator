const os = require('os')
const { notarize } = require('@electron/notarize')

const config = {
  appId: 'rsa-key-generator',
  icon: 'resources/icon.png',
  productName: 'RSAKeyGenerator',
  mac: {
    target: {
      target: 'dmg',
      arch: ['universal'],
    },
  },
  win: {
    target: 'nsis',
  },
  linux: {
    target: 'AppImage',
  },
  afterSign: async (context) => {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
      return;
    }

    if (
      !process.env.NOTARIZE_APPLE_ID ||
      !process.env.NOTARIZE_APPLE_PASSWORD
    ) {
      console.log(
        'Skip notarizing, cannot find NOTARIZE_APPLE_ID and NOTARIZE_APPLE_PASSWORD env'
      );
      return;
    }

    const appName = context.packager.appInfo.productFilename;

    return await notarize({
      appBundleId: 'com.binance.RSAKeyGenerator',
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.NOTARIZE_APPLE_ID,
      appleIdPassword: process.env.NOTARIZE_APPLE_PASSWORD,
      ascProvider: process.env.NOTARIZE_APPLE_TEAM_ID,
    });
  },
};

if (os.platform() === 'win32' && process.env.WIN_CERTIFICATE_SUBJECT_NAME) {
  config.win.certificateSubjectName = process.env.WIN_CERTIFICATE_SUBJECT_NAME;
}

module.exports = config;
