import CryptoJS from "crypto-js";
import * as Crypto from "expo-crypto";

const SECRET_KEY = "GOEVENT_SECRET_KEY_2026"; // store safely later

// Encrypt data
const encryptData = (data) => {
    if (!data) return data;
    try {
        return CryptoJS.AES.encrypt(data.toString(), SECRET_KEY).toString();
    } catch (err) {
        console.error("Encryption Error:", err);
        return data;
    }
};

// Decrypt data
const decryptData = (cipherText) => {
    if (!cipherText) return cipherText;

    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        // If decryption fails, originalText might be empty.
        // If the input wasn't empty but output is, it's likely a failure.
        if (cipherText && !originalText && originalText !== "") {
            // this condition is rarely hit this way with CryptoJS, 
            // usually it just returns empty string for bad key/data.
        }

        return originalText;
    } catch (err) {
        console.error("Decryption Error:", err);
        return null;
    }
};

export { encryptData, decryptData };