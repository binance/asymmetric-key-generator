// Utils
function change_buttons_disabled_state(state) {
    document.getElementById('public-key-copy-button').disabled = state
    document.getElementById('public-key-save-button').disabled = state
    document.getElementById('private-key-copy-button').disabled = state
    document.getElementById('private-key-save-button').disabled = state
}

function remove_label_text(label_id) {
    document.getElementById(label_id).innerText = "ㅤ"
    document.getElementById(label_id).classList = []
}

// Actions
const generateKeys = async () => {
    bits = document.getElementById('select-bits').value
    let { privateKey, publicKey } = await window.utils.generateKeys(parseInt(bits))
    document.getElementById('private-key-text-area').value = privateKey
    document.getElementById('public-key-text-area').value = publicKey

    //Enable buttons
    change_buttons_disabled_state(false)

}

const generatePublicKey = async () => {
    privateKey = document.getElementById('private-key-text-area').value
    let publicKey = await window.utils.generatePublicKey(privateKey)
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
