// Utils
function change_buttons_disabled_state(state) {
    document.getElementById('public-key-copy-button').disabled = state
    document.getElementById('public-key-save-button').disabled = state
    document.getElementById('private-key-copy-button').disabled = state
    document.getElementById('private-key-save-button').disabled = state
}

function remove_label_text(label_id) {
    document.getElementById(label_id).innerText = "ㅤ"
}

// Actions
const generate_keys = async () => {
    bits = document.getElementById('select-bits').value
    let { privateKey, publicKey } = await window.utils.generate_keys(parseInt(bits))
    document.getElementById('private-key-text-area').value = privateKey
    document.getElementById('public-key-text-area').value = publicKey

    //Enable buttons
    change_buttons_disabled_state(false)

}

const generate_public_key = async () => {
    privateKey = document.getElementById('private-key-text-area').value
    let publicKey = await window.utils.generate_public_key(privateKey)
    document.getElementById('public-key-text-area').value = publicKey

    if (publicKey) {
        change_buttons_disabled_state(false)
    } else {
        change_buttons_disabled_state(true)
    }
}

const copy_key = async (input_key) => {
    let lower_input_key = input_key.toLowerCase()
    let data = document.getElementById(`${lower_input_key}-key-text-area`).value
    await window.utils.copy_key(data)

    // Display tooltip for 3s
    let label_id = `${lower_input_key}-key-text-area-tooltip`
    document.getElementById(label_id).innerText = `${input_key} Key copied`
    setTimeout(function () { remove_label_text(label_id) }, 3000);
}

const save_key = async (input_key) => {
    let lower_input_key = input_key.toLowerCase()
    let key = document.getElementById(`${lower_input_key}-key-text-area`).value
    await window.utils.save_key(`${input_key}_key`, key)
}

// Event listeners
const generateKeysButton = document.getElementById('generate-keys-button')
generateKeysButton.addEventListener('click', function () {
    generate_keys()
})

const privateKeyTextArea = document.getElementById('private-key-text-area')
privateKeyTextArea.addEventListener('input', function () {
    generate_public_key()
})

const privateKeyCopyButton = document.getElementById('private-key-copy-button')
privateKeyCopyButton.addEventListener('click', function () {
    copy_key("Private")
})

const publicKeyCopyButton = document.getElementById('public-key-copy-button')
publicKeyCopyButton.addEventListener('click', function () {
    copy_key("Public")
})

const privateKeySaveButton = document.getElementById('private-key-save-button')
privateKeySaveButton.addEventListener('click', function () {
    save_key("Private")
})

const publicKeySaveButton = document.getElementById('public-key-save-button')
publicKeySaveButton.addEventListener('click', function () {
    save_key("Public")
})

