// Mailer API calls and route definitions.
import { APIs } from "./routers";
import { initDB } from "../private/database/offline/connect";
import { Create_Event_Invite_Offline } from "../private/database/offline/oprations/create";

/**
 * Invite User By Email.
 */
const Invite_User_By_Email = async (DB, data, eventData) => {
  try {
    const response = await fetch(`${APIs.sendInvitation}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: data, event: eventData }),
    });
    //https://www.shutterstock.com/shutterstock/photos/1551185741/display_1500/stock-vector-music-event-banner-design-template-for-digital-advertisement-media-and-print-modern-gradient-1551185741.jpg
    const text = await response.text();

    let alldata = JSON.parse(text); // try parsing as JSON first

    const newRes = await Create_Event_Invite_Offline(DB, alldata.QR_SEND_DATA);

    if (newRes.STATUS == 200) {
      console.log("Data stored offline successfully");
      return ({ STATUS: 200, DATA: alldata });
    } else {
      console.log("Failed to store data offline");
      return ({ STATUS: 500, DATA: alldata });
    }
  } catch (error) {
    console.log("Error sending invitations:", error);
    return { STATUS: false };
  }
};

export { Invite_User_By_Email };
