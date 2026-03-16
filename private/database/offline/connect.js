// importing library 
import * as SQLite from "expo-sqlite";


async function initDB() {
    const db = await SQLite.openDatabaseAsync("GoEvent.db");
    // Create table if not exists
    try {
        const user = await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USER_DATA (
            USER_ID varchar(100) PRIMARY key ,
            CREATED_AT varchar(100) DEFAULT NULL,
            USER_NAME TEXT NOT NULL,
            USER_EMAIL varchar(500) NOT NULL unique,
            UPDATED_AT varchar(100) DEFAULT NULL,
            USER_PASS TEXT NOT NULL,
            USER_NUMBER TEXT NOT NULL,
            USER_HASH_EMAIL varchar(500) NOT NULL,
            USER_STATUS BOOLEAN DEFAULT true,
            USER_PIC TEXT DEFAULT NULL
        );`);

        // const user = await db.execAsync(`
        //     PRAGMA journal_mode = WAL;
        //     DROP TABLE USER_DATA;`);

        const eventdata = await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS EVENT_DATA (
            EVENT_ID TEXT PRIMARY KEY,
            USER_ID TEXT NOT NULL,
            EVENT_NAME TEXT NOT NULL,
            EVENT_DATE TEXT NOT NULL,
            EVENT_AMOUNT TEXT NOT NULL,
            EVENT_LOCATION TEXT NOT NULL,
            EVENT_TIME TEXT NOT NULL,
            EVENT_ABOUT TEXT NOT NULL,
            EVENT_HIGHLIGHT TEXT NOT NULL,
            EVENT_TYPE TEXT NOT NULL,
            EVENT_CREATED_AT TEXT NOT NULL,
            EVENT_BANNER TEXT NOT NULL,
            EVENT_CODE TEXT NOT NULL,
            EVENT_STATUS BOOLEAN DEFAULT true
        );`);

        // const eventdata = await db.execAsync(`
        //     PRAGMA journal_mode = WAL;
        //     DROP TABLE IF EXISTS EVENT_DATA;`);

        const logtable = await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS LOG_DATA (
            LOG_ID varchar(100) PRIMARY KEY,
            TABLE_NAME varchar(50) NOT NULL,
            DATA_ID varchar(100) NOT NULL,
            TASK varchar(20) NOT NULL
        );`);

        // const logtable = await db.execAsync(`
        //     PRAGMA journal_mode = WAL;
        //     DROP TABLE LOG_DATA;`);


        const invitetable = await db.execAsync(`
            CREATE TABLE IF NOT EXISTS EVENT_INVITATION (
            INVITATION_ID VARCHAR(100) PRIMARY KEY,
            HOST_ID VARCHAR(100) NOT NULL,
            MEMBER_EMAIL VARCHAR(200) NOT NULL,
            EVENT_ID VARCHAR(100) NOT NULL,
            STATUS varchar(20) DEFAULT 'PENDING',
            CREATED_AT varchar(100) NOT NULL
        );`);

        // const truncate = await db.execAsync(`
        //     DROP TABLE EVENT_INVITATION;
        // `);

        const vendordata = await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS vendordata (
            ID VARCHAR(100) PRIMARY KEY,
            USERID VARCHAR(100) NOT NULL,
            VENDORNAME TEXT NOT NULL,
            VENDOREMAIL varchar(500) NOT NULL UNIQUE,
            VENDORPHONE TEXT NOT NULL,
            VENDORADDRESS TEXT DEFAULT NULL,
            VENDORCITY TEXT DEFAULT NULL,
            VENDORSTATE TEXT DEFAULT NULL,
            VENDORCOUNTRY varchar(100) DEFAULT 'India',
            VENDORBANNER TEXT DEFAULT NULL,
            VENDORWEBSITE TEXT DEFAULT NULL,
            VENDORRATING varchar(10) DEFAULT '0',
            VENDORBIO TEXT,
            VENDORPRICE TEXT,
            CREATEDAT varchar(100) DEFAULT NULL
        );`);

        // const vendordata = await db.execAsync(`
        //     PRAGMA journal_mode = WAL;
        //     DROP TABLE vendordata;`);

        console.log("Database initialized ✅");
        return db;
    } catch (err) {
        console.log("Error in Database initialization.:", err);
        alert('Some Error Please Restart Your App❗');
        return false;
    }
}



export { initDB };

