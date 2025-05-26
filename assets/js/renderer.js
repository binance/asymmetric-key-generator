// Utils
function change_buttons_disabled_state(state) {
    document.getElementById('public-key-copy-button').disabled = state
    document.getElementById('public-key-save-button').disabled = state
    document.getElementById('private-key-copy-button').disabled = state
    document.getElementById('private-key-save-button').disabled = state
    document.getElementById('save-pair-button').disabled = state
}

function remove_label_text(label_id) {
    document.getElementById(label_id).innerText = "ㅤ"
    document.getElementById(label_id).classList = []
}

function togglePassphrase() {
    const passInput = document.getElementById("passphrase-input");
    const toggle = document.getElementById("toggle-password");
    passInput.type = toggle.checked ? "text" : "password";
}

// Actions
const generateKeys = async () => {
    keyType = document.getElementById('select-keyType').value
    let passphrase = document.getElementById('passphrase-input').value || undefined;
    let { privateKey, publicKey } = await window.utils.generateKeys(keyType, passphrase)
    document.getElementById('private-key-text-area').value = privateKey
    document.getElementById('public-key-text-area').value = publicKey

    //Enable buttons
    change_buttons_disabled_state(false)

}

const generatePublicKey = async () => {
    privateKey = document.getElementById('private-key-text-area').value
    let passphrase = document.getElementById('passphrase-input').value || undefined;
    let publicKey = await window.utils.generatePublicKey(privateKey, passphrase)
    document.getElementById('public-key-text-area').value = publicKey

    if (publicKey) {
        change_buttons_disabled_state(false)
    } else {
        change_buttons_disabled_state(true)
    }
}

const copyKey = async (input_key) => {
    let lower_input_key = input_key.toLowerCase()
    let data = document.getElementById(`${lower_input_key}-key-text-area`).value
    await window.utils.copyKey(data)

    // Display tooltip for 5s
    let label_id = `${lower_input_key}-key-text-area-tooltip`
    document.getElementById(label_id).classList.add('text-green-500');
    document.getElementById(label_id).innerText = `${input_key} Key copied`
    setTimeout(function () { remove_label_text(label_id) }, 5000);
}

const saveKey = async (input_key) => {
    let lower_input_key = input_key.toLowerCase();
    let key = document.getElementById(`${lower_input_key}-key-text-area`).value;
    result = await window.utils.saveKey(`${input_key}_key`, key);

    let label_id = `${lower_input_key}-key-text-area-tooltip`
    // Display error tooltip for 5s
    if (result.startsWith('Error')) {
        tip_color = 'text-red-500';
    } else if (result) {
        tip_color = 'text-green-500';
        result = `${input_key} Key saved`;
    } else {
        result = ""
    }

    if (result) {
        document.getElementById(label_id).classList.add(tip_color);
        document.getElementById(label_id).innerText = result;
        setTimeout(function () { remove_label_text(label_id) }, 5000);
    }
    
}

const savePairs = async () => {
    let count = parseInt(document.getElementById("key-count").value);
    keyType = document.getElementById('select-keyType').value;
    let passphrase = document.getElementById('passphrase-input').value || undefined;

    if (count > 1) {
      result = await window.utils.savePairs([], keyType, {count, passphrase});
    } else {
      let privateKey = document.getElementById("private-key-text-area").value;
      let publicKey = document.getElementById("public-key-text-area").value;
      result = await window.utils.savePairs(
        [{ privateKey, publicKey }],
        keyType,
        { count: 1, passphrase }
      );
    }
  
    let label_id = "public-key-text-area-tooltip";
    // Display error tooltip for 5s
    if (result.startsWith("Error")) {
      tip_color = "text-red-500";
    } else if (result) {
      tip_color = "text-green-500";
      result = count > 1 ? `${count} key pairs saved` : "Key pair saved";
    } else {
      result = "";
    }
  
    if (result) {
      document.getElementById(label_id).classList.add(tip_color);
      document.getElementById(label_id).innerText = result;
      setTimeout(function () {
        remove_label_text(label_id);
      }, 5000);
    }
  };

// Event listeners
const generateKeysButton = document.getElementById('generate-keys-button')
generateKeysButton.addEventListener('click', function () {
    generateKeys()
})

const privateKeyTextArea = document.getElementById('private-key-text-area')
privateKeyTextArea.addEventListener('input', function () {
    generatePublicKey()
})

const privateKeyCopyButton = document.getElementById('private-key-copy-button')
privateKeyCopyButton.addEventListener('click', function () {
    copyKey("Private")
})

const publicKeyCopyButton = document.getElementById('public-key-copy-button')
publicKeyCopyButton.addEventListener('click', function () {
    copyKey("Public")
})

const privateKeySaveButton = document.getElementById('private-key-save-button')
privateKeySaveButton.addEventListener('click', function () {
    saveKey("Private")
})

const publicKeySaveButton = document.getElementById('public-key-save-button')
publicKeySaveButton.addEventListener('click', function () {
    saveKey("Public")
})
const savePairButton = document.getElementById("save-pair-button");
savePairButton.addEventListener('click', function () {
    savePairs()
})

const togglePassword = document.getElementById("toggle-password");
togglePassword.addEventListener("click", function () {
    const passInput = document.getElementById("passphrase-input");
    const eyeOpen = document.getElementById("eye-open");
    const eyeClosed = document.getElementById("eye-closed");

    if (passInput.type === "password") {
        passInput.type = "text";
        eyeOpen.classList.remove("hidden");
        eyeClosed.classList.add("hidden");
    } else {
        passInput.type = "password";
        eyeOpen.classList.add("hidden");
        eyeClosed.classList.remove("hidden");
    }
});


const keyCountInput = document.getElementById("key-count");

function updateButtonLabel() {
    const count = parseInt(keyCountInput.value, 10);
    const isValid = !isNaN(count) && count > 0;
    savePairButton.textContent = isValid
      ? `SAVE ${count} PAIR${count > 1 ? "S" : ""}`
      : "SAVE PAIR";
      generateKeysButton.textContent = isValid
      ? `Generate ${count} Key Pair${count > 1 ? "s" : ""}`
      : "Generate Key Pair";
  }

keyCountInput.addEventListener("input", updateButtonLabel);