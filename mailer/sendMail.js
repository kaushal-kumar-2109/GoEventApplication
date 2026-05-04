// Mailer API calls and route definitions.
import { APIs } from "./routers";

/**
 * Sends  email through an API call.
 */
const SendEmail = async (data) => {

  let response
  try {
    response = await fetch(APIs.sendOtpByEmail, {      //"https://goeventserver.onrender.com/goevent/user/account/login"
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        data
      )
    });
  } catch (error) {
    return ({ err: error, mes: 'There is Server Error', code: 500, status: false });
  }
  const res = await response.json();
  if (res.STATUS == 200) {
    return (res.OTP);
  } else {

    return false;
  }
}

export { SendEmail };