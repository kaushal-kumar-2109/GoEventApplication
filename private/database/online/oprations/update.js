// Online database communication helpers.
import { SUP_BASE } from "../connect";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs"; // make sure to install bcryptjs in your project

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
 * Hash Password.
 */
const hashPassword = async (password) => {
  const sha = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(sha, salt);
};


/**
 * Updates user data online in the database or local store.
 */
const Update_User_Data_Online = async (email, passord) => {

  const HASH_PASS = await hashPassword(passord);

  const { data, error } = await SUP_BASE
    .from("USER_DATA")
    .update(
      {
        USER_PASS: HASH_PASS,
        UPDATED_AT: new Date().toISOString()
      }
    )
    .eq("USER_EMAIL", email);

  if (error) {
    console.log("Error:", error);
    return ({ STATUS: 500 });
  } else {
    // console.log("Data:", data);
    return ({ STATUS: 200, DATA: data, UPASS: HASH_PASS });
  }
}

/**
 * UPDATE INVITE OF CUSTOMER ONLINE.
 */
const UPDATE_INVITE_OF_CUSTOMER_ONLINE = async (memberemail, eventid, status) => {
  const { data, error } = await SUP_BASE
    .from("EVENT_INVITATION")
    .update(
      {
        STATUS: status,
      }
    )
    .eq("MEMBER_EMAIL", memberemail)
    .eq("EVENT_ID", eventid);

  if (error) {
    console.log("Error:", error);
    return ({ STATUS: 500 });
  } else {
    // console.log("Data:", data);
    return ({ STATUS: 200 });
  }
}

/**
 * UPDATE BOOKING STATUS ONLINE.
 */
const UPDATE_BOOKING_STATUS_ONLINE = async (bookingId, status) => {
  const { data, error } = await SUP_BASE
    .from("BOOKINGS")
    .update(
      {
        STATUS: status,
      }
    )
    .eq("BOOKING_ID", bookingId);

  if (error) {
    console.log("Booking Update Error:", error);
    return ({ STATUS: 500 });
  } else {
    return ({ STATUS: 200 });
  }
}

export { Update_User_Data_Online, UPDATE_INVITE_OF_CUSTOMER_ONLINE, UPDATE_BOOKING_STATUS_ONLINE };