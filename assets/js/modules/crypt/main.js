const canEncryptData = () => {
    return !!window?.crypto && !!window?.crypto?.subtle;
}

/**
         * Generates a random key based on the provided configuration.
         * 
         * @param {Object} config - The configuration object for generating the key.
         * @param {boolean} config.uppercase - Indicates if uppercase characters should be included.
         * @param {boolean} config.lowercase - Indicates if lowercase characters should be included.
         * @param {boolean} config.numbers - Indicates if numeric characters should be included.
         * @param {string[]} config.specialChars - Array of special characters to include.
         * @param {number} config.length - The length of the key to be generated.
         * @returns {string} The generated key.
         *
         * @example
         * // Generate a 12-character key with uppercase, lowercase, and numbers
         * generateRandomKey({ 
         *     uppercase: true, 
         *     lowercase: true, 
         *     numbers: true, 
         *     specialChars: [], 
         *     length: 12 
         * });
         */
const generateRandomKey = (config) => {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    let characters = '';
    let password = '';

    // Add at least one of each required type
    if (config.uppercase) {
        characters += upperCaseChars;
        password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    }
    if (config.lowercase) {
        characters += lowerCaseChars;
        password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    }
    if (config.numbers) {
        characters += numberChars;
        password += numberChars[Math.floor(Math.random() * numberChars.length)];
    }
    if (config.specialChars && Array.isArray(config.specialChars)) {
        characters += config.specialChars.join('');
        password += config.specialChars[Math.floor(Math.random() * config.specialChars.length)];
    }

    // Fill the rest of the password length with random characters
    for (let i = password.length; i < config.length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    // Shuffle the password to mix the initially added characters
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}

const generateMasterKey = (keyLength = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...Array(keyLength)]?.reduce(acc => (
        acc += chars[Math.floor(Math.random() * chars.length)]
    ), '');
}

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}

const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

const encryptData = async (password, masterKey) => {
    const passwordBytes = new TextEncoder().encode(password);
    const masterKeyBytes = new TextEncoder().encode(masterKey);
    const key = await crypto.subtle.importKey(
        "raw",
        masterKeyBytes,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
    );
    // Initialization vector
    const initialization_vector = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: initialization_vector },
        key,
        passwordBytes
    );
    return {
        encrypted: arrayBufferToBase64(
            new Uint8Array(encrypted)
        ),
        initialization_vector: arrayBufferToBase64(
            initialization_vector
        )
    };
}

const decryptData = async (encryptedData, masterKey, initialization_vector) => {
    const masterKeyBytes = new TextEncoder().encode(masterKey);
    const key = await crypto.subtle.importKey(
        "raw",
        masterKeyBytes,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: base64ToArrayBuffer(initialization_vector)
        },
        key,
        base64ToArrayBuffer(encryptedData)
    );
    return new TextDecoder().decode(decrypted);
}

const generateAccessKey = () => (
    btoa(`${generateMasterKey()}.${generateRandomKey({
        uppercase: false,
        lowercase: true,
        numbers: false,
        specialChars: [],
        length: 12
    })}.${generateRandomKey({
        uppercase: false,
        lowercase: true,
        numbers: false,
        specialChars: [],
        length: 12
    })}`)
);

const readAccessKey = (accesKey) => {
    if (!accesKey) {
        //handle error
    }
    const [
        master_key,
        database_name,
        store_name,
    ] = atob(accesKey)?.split('.');
    if (!master_key || !database_name || !store_name) {
        //handle error
    }
    return {
        master_key,
        database_name,
        store_name,
    }
}

export default {
    canEncryptData,
    generateAccessKey,
    readAccessKey,
    encryptData,
    decryptData,
};