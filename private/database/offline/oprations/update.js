import { initDB } from "../connect";

const UPDATE_INVITE_OF_CUSTOMER = async (DB, memberemail, eventid, status, invitation_id) => {
  if (!DB) {
    DB = await initDB();
  }

  const allRows = await DB.runAsync(`UPDATE EVENT_INVITATION SET STATUS='${status}' WHERE MEMBER_EMAIL = '${memberemail}' AND EVENT_ID = '${eventid}';`);
  const updateRows = await DB.runAsync(`INSERT INTO LOG_DATA VALUES ('${Create_Id()}','EVENT_INVITATTION','${invitation_id}','UPDATE')`);
  if (allRows.changes == 1) {
    return ({ STATUS: 200, MES: "Updated Successfully" });
  } else {
    return ({ STATUS: 500, MES: "Error in updating" });
  }
}

export { UPDATE_INVITE_OF_CUSTOMER };


const Create_Id = () => {
  const serial = "1234567890qwertyuioplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPOIUYTREWQ";
  let id = "";

  for (let i = 0; i < 25; i++) {
    let index = Math.floor(Math.random() * serial.length);
    id += serial[index];
  }

  return id;
};