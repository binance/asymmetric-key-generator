# Asymmetric Key Generator

This simple tool can be used to generate an Ed25519 PKCS#8 and RSA key pairs (private and public key).

There's two methods to run the tool, you can either download or build from source code.

## Download

Prebuild apps can be found in [Releases](https://github.com/binance/asymmetric-key-generator/releases).

To verify the package's integrity, download both the app and the checksum file to the same directory:

```shell
-rw-r--r--@  1 john  staff   156M 18 Nov 17:02 AsymmetricKeyGenerator-0.5.0-universal.dmg
-rw-r--r--@  1 john  staff   102B 18 Nov 19:01 AsymmetricKeyGenerator-0.5.0-universal.dmg.CHECKSUM
```

Then run sha256 checksum:

```shell
sha256sum -c AsymmetricKeyGenerator-0.5.0-universal.dmg.CHECKSUM
```

If it passes the integrity check, it'll return `AsymmetricKeyGenerator-0.5.0-universal.dmg: OK`

## Build from source code

Obtain the source code locally and go through the following steps:

```javascript

// install package
npm install

// run locally
npm run start

// build packages locally into the "dist" folder.
npm run dist

```

## Command-Line Tool Usage

This tool can also be executed as a command-line interface (CLI) script. Here's how you can use it:

### Installation

1. Clone the repository or download the source code.

2. Install the necessary dependencies using npm:

```bash
npm install
```

### Key Pair Generation

To generate key pairs, run the following command:

```bash
npm run generate -- -k <key-type> -p <passphrase> -n <number-of-keys> -o <output>
```

#### Parameters:

- `-k, --key-type <type>`: The type of key to generate. Allowed values are:

  - `rsa-2048`

  - `rsa-4096`

  - `ed25519`

- `-p, --passphrase <passphrase>`: (Optional) A passphrase to encrypt the private key. If not provided, no passphrase is used.

- `-n, --num-keys <number>`: (Optional, default: 1) The number of key pairs to generate.

- `-o, --output <filename>`: (Optional) The output tar.gz file. If not provided, a default name is used `id_<key-type>-<i>.tar.gz`.

#### Example Usage:

1. Generate a single RSA-2048 key pair:

```bash
npm run generate -- -k rsa-2048 -o id_rsa.tar.gz
```

2. Generate 2 Ed25519 key pairs with passphrase:

```bash
npm run generate -- -k ed25519 -p mySecretPassphrase -n 2
```

This will generate:

- `id_rsa.tar.gz` consisting of one pair: `id_rsa` and `id_rsa.pub`

- `id_ed25519.tar.gz` consisting of two pairs `id_ed25519-{i}` and `id_ed25519-{i}.pub`

If you do not provide `-o` option, the default names `id_<key-type>-<i>` and `id_<key-type>-<i>.pub` will be used.

## UI Usage

1. Open the app;

2. Choose the key type; Recommend to keep the default value (`Ed25519`), then click the button `Generate Key Pair`;

3. Below on the left column is the `Private Key`, which should be stored in a secure location on your local disk (by using the `Save` button) and must never be shared with anyone;

4. The right column is the `Public Key`. Click `Save` button to save into local disk. This key can be shared with others to verify the `Private Key` signed data;

## Contribution

Contributions are welcome!
If you've found a bug within this project, please open an issue to discuss what you would like to change.

## License

MIT
