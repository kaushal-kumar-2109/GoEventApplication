// decode.js - Utility function to decode hash values back to original values

/**
 * Decodes a base64 encoded hash value back to the original string.
 * @param {string} hash - The base64 encoded hash value to decode.
 * @returns {string} The original decoded value.
 */
function decodeValue(hash) {
    try {
        return Buffer.from(hash, 'base64').toString('utf8');
    } catch (error) {
        console.error('Error decoding hash:', error);
        return null;
    }
}

module.exports = { decodeValue };