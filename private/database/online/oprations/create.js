// Online database communication helpers.
import { SUP_BASE } from "../connect";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs"; // make sure to install bcryptjs in your project
import { encryptData, decryptData } from "../../../../utils/Hash";

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

// hash non-password fields with SHA-256 twice (double hashing)
const hashField = async (value) => {
  if (typeof value !== "string") return value;
  const first = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    value
  );
  // second SHA on the hex output
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    first
  );
};

// hash password with SHA-256 first, then bcrypt (double hashing)
const hashPassword = async (password) => {
  const sha = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(sha, salt);
};

/**
 * Creates user online in the application data store.
 */
const Create_User_Online = async (udata) => {
  // extract raw values
  const rawEmail = udata[1][0];
  const rawName = udata[1][1];
  const rawNumber = udata[1][2];
  const rawPass = udata[1][3];
  const rawpic = 'null';

  // const rawEmail = udata[1];
  // const rawName = udata[0];
  // const rawNumber = udata[3];
  // const rawPass = udata[2];
  // const rawpic = udata[4];


  // hash/encrypt as requested (await each since hashField is async)
  const USER_EMAIL = await encryptData(rawEmail);
  const USER_NAME = await encryptData(rawName);
  const USER_NUMBER = await encryptData(rawNumber);
  const USER_HASH_EMAIL = await hashField(rawEmail);
  const USER_PASS = await hashPassword(rawPass);
  // you may choose to store a placeholder for PIC and encrypt separately when available
  const USER_PIC = await encryptData(rawpic);
  const USER_ID = Create_Id();

  const { data, error } = await SUP_BASE
    .from("USER_DATA")
    .insert([
      {
        // omit ID, let database assign a bigint/serial value
        USER_ID,
        CREATED_AT: new Date().toISOString(),
        USER_NAME,
        USER_EMAIL,
        UPDATED_AT: new Date().toISOString(),
        USER_PASS,
        USER_NUMBER,
        USER_STATUS: true,
        USER_PIC,
        USER_HASH_EMAIL,
      },
    ]);

  if (error) {
    console.log("Insert Error:", error);
    return ({ STATUS: 500, UID: USER_ID });
  } else {
    console.log("Inserted Successfully:");
    return ({ STATUS: 200, UID: USER_ID });
  }
};

/**
 * Creates event online in the application data store.
 */
const Create_Event_Online = async (udata) => {

  const EVENT_ID = udata[0];
  const USER_ID = udata[1];
  const EVENT_NAME = encryptData(udata[2]);
  const EVENT_DATE = encryptData(udata[3]);
  const EVENT_AMOUNT = encryptData(udata[4]);
  const EVENT_LOCATION = encryptData(udata[5]);
  const EVENT_TIME = encryptData(udata[6]);
  const EVENT_ABOUT = encryptData(udata[7]);
  const EVENT_HIGHLIGHT = encryptData(udata[8]);
  const EVENT_TYPE = encryptData(udata[9]);
  const EVENT_CREATED_AT = udata[10];
  const EVENT_BANNER = encryptData(udata[11]);
  const EVENT_CODE = udata[12];
  const EVENT_STATUS = udata[13];
  const UPDATED_AT = udata[14];

  const { data, error } = await SUP_BASE
    .from("EVENT_DATA")
    .insert([
      {
        // omit ID, let database assign a bigint/serial value
        EVENT_ID,
        USER_ID,
        EVENT_NAME,
        EVENT_DATE,
        EVENT_AMOUNT,
        EVENT_LOCATION,
        EVENT_TIME,
        EVENT_ABOUT,
        EVENT_HIGHLIGHT,
        EVENT_TYPE,
        EVENT_CREATED_AT,
        EVENT_BANNER,
        EVENT_CODE,
        EVENT_STATUS,
        UPDATED_AT
      },
    ]);

  if (error) {
    console.log("Insert Error:", error);
    return ({ STATUS: 500, UID: USER_ID });
  } else {
    console.log("Inserted Successfully:");
    return ({ STATUS: 200, UID: USER_ID });
  }
};

/**
 * Creates event invite online in the application data store.
 */
const Create_Event_Invite_Online = async (DATA) => {
  const USER_ID = DATA[1];
  const { data, error } = await SUP_BASE
    .from("EVENT_INVITATION")
    .insert([
      {
        // omit ID, let database assign a bigint/serial value
        INVITATION_ID: DATA[0],
        HOST_ID: DATA[1],
        MEMBER_EMAIL: DATA[2],
        EVENT_ID: DATA[3],
        STATUS: DATA[4],
        CREATED_AT: DATA[5]
      },
    ]);

  if (error) {
    console.log("Insert Error:", error);
    return ({ STATUS: 500, UID: USER_ID });
  } else {
    console.log("Inserted Successfully:");
    return ({ STATUS: 200, UID: USER_ID });
  }
}

/**
 * Creates app log online in the application data store.
 */
const Create_App_Log_Online = async (logData) => {
  const { data, error } = await SUP_BASE
    .from("APP_LOGS")
    .insert([
      {
        LOG_ID: logData.LOG_ID,
        USER_ID: logData.USER_ID,
        LOG_TIME: logData.LOG_TIME,
        LOG_TYPE: logData.LOG_TYPE,
        LOG_MESSAGE: logData.LOG_MESSAGE,
        LOG_DETAIL: logData.LOG_DETAIL
      },
    ]);

  if (error) {
    console.log("Online Log Error:", error);
    return { STATUS: 500, ERROR: error };
  }
  return { STATUS: 200 };
}

/**
 * Creates booking online in the application data store.
 */
const Create_Booking_Online = async (bookingData) => {
  const { data, error } = await SUP_BASE
    .from("BOOKINGS")
    .insert([
      {
        BOOKING_ID: bookingData.BOOKING_ID,
        USER_ID: bookingData.USER_ID,
        EVENT_ID: bookingData.EVENT_ID,
        ATTENDEE_NAME: bookingData.ATTENDEE_NAME,
        ATTENDEE_EMAIL: bookingData.ATTENDEE_EMAIL,
        ATTENDEE_NUMBER: bookingData.ATTENDEE_NUMBER,
        ATTENDEE_GENDER: bookingData.ATTENDEE_GENDER,
        BOOKING_TIME: bookingData.BOOKING_TIME,
        STATUS: bookingData.STATUS
      },
    ]);

  if (error) {
    console.log("Online Booking Error:", error);
    return { STATUS: 500, ERROR: error };
  }
  return { STATUS: 200 };
}

/**
 * Creates notification online in the application data store.
 */
const Create_Notification_Online = async (notifData) => {
  const { data, error } = await SUP_BASE
    .from("NOTIFICATIONS")
    .insert([
      {
        NOTIFICATION_ID: notifData.NOTIFICATION_ID,
        USER_ID: notifData.USER_ID,
        TITLE: notifData.TITLE,
        MESSAGE: notifData.MESSAGE,
        TIME: notifData.TIME,
        STATUS: notifData.STATUS
      },
    ]);

  if (error) {
    console.log("Online Notification Error:", error);
    return { STATUS: 500, ERROR: error };
  }
  return { STATUS: 200 };
}

export { Create_User_Online, random_USER, Create_Event_Online, random_EVENT, Create_Event_Invite_Online, Create_App_Log_Online, Create_Booking_Online, Create_Notification_Online };


/**
 * Generates a new unique identifier string for database records or logs.
 */
const Create_Id = () => {
  const serial = "1234567890qwertyuioplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPOIUYTREWQ";
  let id = "";

  for (let i = 0; i < 25; i++) {
    let index = Math.floor(Math.random() * serial.length);
    id += serial[index];
  }

  return id;
};

/**
 * Generates a new event code string for offline event creation.
 */
function Create_Code() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}


const users = [
  ['Rahul Sharma', 'rahul.sharma01@gmail.com', 'rahul@123', '9876543210', 'https://randomuser.me/api/portraits/men/11.jpg'],
  ['Priya Verma', 'priya.verma02@gmail.com', 'priya@123', '9812345670', 'https://randomuser.me/api/portraits/women/12.jpg'],
  ['Amit Kumar', 'amit.kumar03@gmail.com', 'amit@123', '9898765432', 'https://randomuser.me/api/portraits/men/13.jpg'],
  ['Sneha Patel', 'sneha.patel04@gmail.com', 'sneha@123', '9823456789', 'https://randomuser.me/api/portraits/women/14.jpg'],
  ['Vikram Singh', 'vikram.singh05@gmail.com', 'vikram@123', '9901234567', 'https://randomuser.me/api/portraits/men/15.jpg'],
  ['Ananya Gupta', 'ananya.gupta06@gmail.com', 'ananya@123', '9871203456', 'https://randomuser.me/api/portraits/women/16.jpg'],
  ['Rohan Mehta', 'rohan.mehta07@gmail.com', 'rohan@123', '9811122233', 'https://randomuser.me/api/portraits/men/17.jpg'],
  ['Neha Kapoor', 'neha.kapoor08@gmail.com', 'neha@123', '9890012345', 'https://randomuser.me/api/portraits/women/18.jpg']
];
/**
 * Random USER.
 */
const random_USER = async () => {
  for (let i = 0; i < users.length; i++) {
    let u = await Create_User_Online(users[i]);
  };
}

const events = [
  ['QHfKQMgC6o9EwAXjIZFTOc2iG', 'DJ Night Party', '2026-04-05', '499', 'Delhi Club Arena', '08:00 PM', 'A high energy DJ party with EDM and live lighting', 'music,dance,party,nightlife', 'PUBLIC', '2026-03-14T12:00:00.000Z', 'https://picsum.photos/seed/event1/800/400', 'EVT001', true],
  ['y567MQ3bP4vjTr8yZJillPhp2', 'Food Carnival', '2026-04-10', '199', 'Connaught Place', '05:00 PM', 'Explore street food and gourmet stalls from across India', 'food,festival,taste,fun', 'PUBLIC', '2026-03-14T12:01:00.000Z', 'https://picsum.photos/seed/event2/800/400', 'EVT002', true],
  ['g2M9c5viLMFiGcb6SFoXZgEtx', 'Live Music Concert', '2026-04-15', '799', 'Indira Gandhi Stadium', '07:30 PM', 'Top bands performing live rock and indie music', 'music,concert,live,band', 'PUBLIC', '2026-03-14T12:02:00.000Z', 'https://picsum.photos/seed/event3/800/400', 'EVT003', true],
  ['ywHroeKDSfSdgLL0x8fpKY5cz', 'Startup Networking', '2026-04-18', '99', 'Delhi Tech Hub', '04:00 PM', 'Meet entrepreneurs and investors for collaboration', 'networking,startup,business,innovation', 'PRIVATE', '2026-03-14T12:03:00.000Z', 'https://picsum.photos/seed/event4/800/400', 'EVT004', true],
  ['VPwDzcV16TqYA6NS3UYJIZJXu', 'College Dance Fest', '2026-04-20', '299', 'Delhi University Auditorium', '06:00 PM', 'Inter college dance battle and performances', 'dance,competition,fun,music', 'PUBLIC', '2026-03-14T12:04:00.000Z', 'https://picsum.photos/seed/event5/800/400', 'EVT005', true],
  ['wCbWUoLGT1IdR8myjiDZaxQ0y', 'Tech Conference 2026', '2026-04-25', '999', 'Pragati Maidan', '10:00 AM', 'Latest tech trends and innovation talks', 'technology,ai,networking,innovation', 'PRIVATE', '2026-03-14T12:05:00.000Z', 'https://picsum.photos/seed/event6/800/400', 'EVT006', true],
  ['QHfKQMgC6o9EwAXjIZFTOc2iG', 'Comedy Night', '2026-04-28', '399', 'Delhi Laugh Club', '08:30 PM', 'Standup comedy from famous comedians', 'comedy,fun,entertainment,laughter', 'PUBLIC', '2026-03-14T12:06:00.000Z', 'https://picsum.photos/seed/event7/800/400', 'EVT007', true],
  ['y567MQ3bP4vjTr8yZJillPhp2', 'Art Exhibition', '2026-05-02', '149', 'National Art Gallery', '11:00 AM', 'Paintings and sculptures from modern artists', 'art,painting,creative,culture', 'PUBLIC', '2026-03-14T12:07:00.000Z', 'https://picsum.photos/seed/event8/800/400', 'EVT008', true],
  ['g2M9c5viLMFiGcb6SFoXZgEtx', 'Fitness Bootcamp', '2026-05-05', '249', 'Lodhi Garden', '06:00 AM', 'Morning fitness training and yoga session', 'fitness,health,yoga,outdoor', 'PUBLIC', '2026-03-14T12:08:00.000Z', 'https://picsum.photos/seed/event9/800/400', 'EVT009', true],
  ['ywHroeKDSfSdgLL0x8fpKY5cz', 'Gaming Tournament', '2026-05-08', '299', 'Delhi Gaming Arena', '01:00 PM', 'Competitive esports tournament', 'gaming,esports,competition,fun', 'PUBLIC', '2026-03-14T12:09:00.000Z', 'https://picsum.photos/seed/event10/800/400', 'EVT010', true],
  ['VPwDzcV16TqYA6NS3UYJIZJXu', 'Photography Workshop', '2026-05-10', '199', 'Creative Studio Delhi', '03:00 PM', 'Learn professional photography techniques', 'photography,learning,creative,workshop', 'PUBLIC', '2026-03-14T12:10:00.000Z', 'https://picsum.photos/seed/event11/800/400', 'EVT011', true],
  ['wCbWUoLGT1IdR8myjiDZaxQ0y', 'Yoga Retreat', '2026-05-12', '299', 'Delhi Wellness Center', '07:00 AM', 'Relaxing yoga and meditation retreat', 'yoga,meditation,health,peace', 'PUBLIC', '2026-03-14T12:11:00.000Z', 'https://picsum.photos/seed/event12/800/400', 'EVT012', true],
  ['QHfKQMgC6o9EwAXjIZFTOc2iG', 'Fashion Show', '2026-05-15', '599', 'Delhi Fashion Arena', '07:00 PM', 'Latest fashion trends and runway show', 'fashion,style,models,design', 'PRIVATE', '2026-03-14T12:12:00.000Z', 'https://picsum.photos/seed/event13/800/400', 'EVT013', true],
  ['y567MQ3bP4vjTr8yZJillPhp2', 'Food Truck Festival', '2026-05-18', '249', 'India Gate Lawn', '05:00 PM', 'Best food trucks and street food', 'food,festival,streetfood,taste', 'PUBLIC', '2026-03-14T12:13:00.000Z', 'https://picsum.photos/seed/event14/800/400', 'EVT014', true],
  ['g2M9c5viLMFiGcb6SFoXZgEtx', 'Movie Screening Night', '2026-05-20', '199', 'Open Air Cinema Delhi', '08:00 PM', 'Outdoor movie screening with snacks', 'movie,entertainment,night,outdoor', 'PRIVATE', '2026-03-14T12:14:00.000Z', 'https://picsum.photos/seed/event15/800/400', 'EVT015', true],
  ['ywHroeKDSfSdgLL0x8fpKY5cz', 'Coding Hackathon', '2026-05-22', '149', 'Delhi Tech Campus', '09:00 AM', '24 hour coding challenge for developers', 'coding,hackathon,technology,innovation', 'PUBLIC', '2026-03-14T12:15:00.000Z', 'https://picsum.photos/seed/event16/800/400', 'EVT016', true],
  ['VPwDzcV16TqYA6NS3UYJIZJXu', 'Book Fair', '2026-05-25', '99', 'Delhi Book Market', '10:00 AM', 'Books from famous publishers and authors', 'books,reading,education,culture', 'PRIVATE', '2026-03-14T12:16:00.000Z', 'https://picsum.photos/seed/event17/800/400', 'EVT017', true],
  ['wCbWUoLGT1IdR8myjiDZaxQ0y', 'Cultural Festival', '2026-05-28', '399', 'Delhi Cultural Center', '06:30 PM', 'Dance music and cultural performances', 'culture,dance,music,festival', 'PRIVATE', '2026-03-14T12:17:00.000Z', 'https://picsum.photos/seed/event18/800/400', 'EVT018', true],
  ['QHfKQMgC6o9EwAXjIZFTOc2iG', 'Night Food Market', '2026-05-30', '199', 'Karol Bagh Market', '09:00 PM', 'Late night food and music experience', 'food,music,night,fun', 'PUBLIC', '2026-03-14T12:18:00.000Z', 'https://picsum.photos/seed/event19/800/400', 'EVT019', true],
  ['y567MQ3bP4vjTr8yZJillPhp2', 'Summer Pool Party', '2026-06-02', '699', 'Delhi Resort Pool', '04:00 PM', 'Poolside DJ party with drinks and dance', 'poolparty,music,dance,summer', 'PRIVATE', '2026-03-14T12:19:00.000Z', 'https://picsum.photos/seed/event20/800/400', 'EVT020', true],
]
/**
 * Random EVENT.
 */
const random_EVENT = async () => {
  for (let i = 0; i < events.length; i++) {
    let u = await Create_Event_Online(events[i]);
  };
}