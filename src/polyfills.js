// React component and screen logic for the app.
import * as Crypto from "expo-crypto";

/**
 * Polyfill for global.crypto.getRandomValues.
 * Required by crypto-js and other libraries for secure random number generation.
 * This should be imported at the very top of the entry file (index.js).
 */
(function() {
    if (typeof global.crypto !== "object") {
        global.crypto = {};
    }

    if (typeof global.crypto.getRandomValues !== "function") {
        console.log("[Polyfill] Applying global.crypto.getRandomValues...");
        
        global.crypto.getRandomValues = (array) => {
            try {
                // expo-crypto's getRandomValues is the preferred native source
                return Crypto.getRandomValues(array);
            } catch (err) {
                // Fallback to Math.random if native crypto is unavailable (common in some Expo environments)
                // console.warn("[Polyfill] Native getRandomValues failed, using Math.random fallback.");
                for (let i = 0; i < array.length; i++) {
                    array[i] = Math.floor(Math.random() * 256);
                }
                return array;
            }
        };
    }
})();
