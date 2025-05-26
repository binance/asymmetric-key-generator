const fs = require('fs');
const fsp = require('fs').promises;
const os = require('os');
const path = require('path');
const tar = require('tar');
const {
  generateKeyPairSync,
  createPublicKey,
  createPrivateKey,
} = require("crypto");

// Actions
async function generateKeys(keyType, passphrase) {
  if (keyType === "rsa-2048") {
    return generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        passphrase,
        cipher: passphrase ? "aes-256-cbc" : undefined,
      },
    });
  } else if (keyType === "rsa-4096") {
    return generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        passphrase,
        cipher: passphrase ? "aes-256-cbc" : undefined,
      },
    });
  } else {
    return generateKeyPairSync("ed25519", {
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        passphrase,
        cipher: passphrase ? "aes-256-cbc" : undefined,
      },
    });
  }
}

async function generatePublicKey(privateKey, passphrase) {
  try {
    const unencryptedPrivateKey = passphrase
      ? createPrivateKey({
          key: privateKey,
          passphrase,
        })
      : privateKey;
    const publickKeyObject = createPublicKey(unencryptedPrivateKey);
    return publickKeyObject.export({ format: "pem", type: "spki" });
  } catch (error) {
    if (error.code === "ERR_OSSL_BAD_DECRYPT")
      return "Wrong passphrase provided!";
    else return "";
  }
}

// Helper method to handle key file generation logic
function handleKeyFileGeneration(baseName, extension, suffix, dir) {
  // Create the full path with suffix before extension
  const filePath = path.resolve(dir, `${baseName}${suffix}${extension}`);

  // Ensure the directory exists
  fs.mkdirSync(dir, { recursive: true });

  return filePath;
}

async function saveKeys(keys, filePath) {
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "keys-"));

  // Save each key pair to individual files
  let addSuffix = keys.length > 1;
  let name = path.basename(filePath).split('.')[0];

  for (let i = 0; i < keys.length; i++) {
    const { privateKey, publicKey } = keys[i];
    const privPath = path.join(
      tempDir,
      `${name}${addSuffix ? `-${i + 1}` : ""}`
    );
    const pubPath = path.join(
      tempDir,
      `${name}${addSuffix ? `-${i + 1}` : ""}.pub`
    );
    await fsp.writeFile(privPath, privateKey, {
      encoding: "utf8",
      mode: 0o600,
    });
    await fsp.writeFile(pubPath, publicKey, {
      encoding: "utf8",
      mode: 0o600,
    });
  }

  // Create tar.gz archive
  await tar.c(
    {
      gzip: true,
      file: filePath,
      cwd: tempDir,
    },
    await fsp.readdir(tempDir) // Only add key files
  );
}

module.exports = { generateKeys, generatePublicKey, saveKeys };
