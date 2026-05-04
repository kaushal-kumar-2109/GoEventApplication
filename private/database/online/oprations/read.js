// Online database communication helpers.
import { SUP_BASE } from "../connect";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs";
import { encryptData, decryptData } from "../../../../utils/Hash";

// helper from create.js for hashing; must match exactly
const hashField = async (value) => {
  if (typeof value !== "string") return value;
  const first = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    value
  );
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    first
  );
};

// bcryptjs needs a source of randomness; provide expo-crypto fallback
bcrypt.setRandomFallback((len) => {
  const array = new Uint8Array(len);
  try {
    Crypto.getRandomValues(array);
  } catch (e) {
    for (let i = 0; i < len; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return array;
});

/**
 * Since user fields are stored as hashes, we cannot "reverse" them.
 * This function hashes the provided email and queries the table.
 * The returned record will still contain hashed values; you cannot
 * recover the plain text from SHA-256.
 * For passwords, compare using the same hash+bcrypt routine instead.
 */
const Read_From_Online_userdata = async (email) => {


  // To search for an encrypted email, we need to fetch all and decrypt, 
  // or use a deterministic hash for searching. 
  // For now, let's fetch all and filter to satisfy "original value" requirement.
  const { data, error } = await SUP_BASE
    .from("USER_DATA")
    .select("*");

  if (error) {
    console.log("Read Error:", error);
    return { STATUS: 500, DATA: error };
  }

  // Filter manually by decrypting stored emails
  const user = data.find(u => decryptData(u.USER_EMAIL) === email);

  if (user) {
    console.log("User Found");
    return { STATUS: 200, DATA: [user] };
  } else {
    console.log("User Not Found");
    return { STATUS: 404, DATA: [] };
  }
};

export { Read_From_Online_userdata };