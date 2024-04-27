const canEncryptData = () => {
    return !!window?.crypto && !!window?.crypto?.subtle;
}

/**
 * Generates a random key based on the provided configuration.
 * 
 * @param {Object} config - The configuration object for generating the key.
 * @param {boolean} config.uppercase - Indicates if uppercase characters should be included.
 * @param {number} [config.minUppercase=1] - Minimum number of uppercase characters to include.
 * @param {boolean} config.lowercase - Indicates if lowercase characters should be included.
 * @param {number} [config.minLowercase=1] - Minimum number of lowercase characters to include.
 * @param {boolean} config.numbers - Indicates if numeric characters should be included.
 * @param {number} [config.minNumbers=1] - Minimum number of numeric characters to include.
 * @param {string[]} config.specialChars - Array of special characters to include.
 * @param {number} [config.minSpecialChars=1] - Minimum number of special characters to include.
 * @param {number} config.length - The total length of the key to be generated.
 * @returns {Object} An object with the status (true if successful, false if error) and the generated key or error message.
 *
 * @example
 * // Generate a 12-character key with minimum 2 uppercase, 3 lowercase, 2 numbers, and 1 special character
 * const result = generateRandomKey({ 
 *     uppercase: true, 
 *     lowercase: true, 
 *     numbers: true, 
 *     specialChars: ['!', '@', '#'],
 *     minUppercase: 2,
 *     minLowercase: 3,
 *     minNumbers: 2,
 *     minSpecialChars: 1,
 *     length: 12 
 * });
 */
const generateRandomKey = (config) => {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    let characters = '';
    let password = '';

    if(
        (!config?.uppercase && !config?.lowercase && !config?.numbers && (!config?.specialChars || config?.specialChars?.filter(el=>el!=='')?.length === 0))
        || (config?.minUppercase + config?.minLowercase + config?.minNumbers + config?.minSpecialChars === 0)
    ) return {
        status: false,
        error: 'Invalid configuration: At least one character type (uppercase, lowercase, numbers, or special characters) must be included.'
    };

    if(config?.minUppercase + config?.minLowercase + config?.minNumbers + config?.minSpecialChars > config.length) return {
        status: false,
        error: 'Invalid configuration: The total minimum required characters exceed the specified key length.'
    };
    

    // Function to add a specific number of random characters from a given set
    const addRandomChars = (charSet, count) => {
        for (let i = 0; i < count; i++) {
            password += charSet[Math.floor(Math.random() * charSet.length)];
        }
    };

    // Add the minimum required characters of each type
    if (config.uppercase && (config?.minUppercase ?? 0) > 0) {
        addRandomChars(upperCaseChars, config?.minUppercase ?? 1);
        characters += upperCaseChars;
    }
    if (config.lowercase  && (config?.minLowercase ?? 0) > 0) {
        addRandomChars(lowerCaseChars, config?.minLowercase ?? 1);
        characters += lowerCaseChars;
    }
    if (config.numbers  && (config?.minNumbers ?? 0) > 0) {
        addRandomChars(numberChars, config?.minNumbers ?? 1);
        characters += numberChars;
    }
    if (config.specialChars && Array.isArray(config.specialChars)  && (config?.minSpecialChars ?? 0) > 0) {
        addRandomChars(config.specialChars.join(''), config?.minSpecialChars ?? 1);
        characters += config.specialChars.join('');
    }

    // Fill the rest of the password length with random characters
    for (let i = password.length; i < config.length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    // Shuffle the password to mix the initially added characters
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return {
        status: true,
        password
    };
};

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

export {
    canEncryptData,
    generateAccessKey,
    readAccessKey,
    encryptData,
    decryptData,
    generateRandomKey,
};