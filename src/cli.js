const { Command } = require("commander");
const { generateKeys, saveKeys } = require("./generate");
const program = new Command();
const path = require("path");
const fs = require("fs");

program
  .requiredOption(
    "-k, --key-type <type>",
    "Key type: rsa-2048, rsa-4096, or ed25519",
    (value) => {
      const validKeyTypes = ["rsa-2048", "rsa-4096", "ed25519"];
      if (!validKeyTypes.includes(value)) {
        throw new Error(
          `Invalid key type '${value}'. Allowed values are: ${validKeyTypes.join(
            ", "
          )}`
        );
      }
      return value;
    }
  )
  .option(
    "-p, --passphrase <pass>",
    "Passphrase to encrypt the private key (default: none)"
  )
  .option(
    "-n, --num-keys <number>",
    "Number of key pairs to generate (default: 1)",
    (val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed < 1) {
        throw new Error("n must be a positive integer");
      }
      return parsed;
    },
    1
  )
  .option(
    "-o, --output <filename>",
    "Output filtpath"
  )
  .option(
    "-v, --private-key-out <filename>",
    "Base name for output private key files"
  );

program.parse(process.argv);
const options = program.opts();

const { keyType, passphrase, numKeys, output } = options;

async function run() {
  const keys = [];

  for (let i = 0; i < numKeys; i++) {
    keys.push(await generateKeys(keyType, passphrase));
  }

  const algoSuffix = keyType.replace("-", "");
  saveKeys(keys, output || `id_${algoSuffix}.tar.gz`);
}

run().catch((e) => console.error(e));
