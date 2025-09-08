import * as Realm from "realm";

const app = new Realm.App({ id: "goevent-abcde" }); // your Realm App ID

async function login() {
  try {
    // Create credentials
    const credentials = Realm.Credentials.emailPassword("user@example.com", "Password123");

    // Log in
    const user = await app.logIn(credentials);

    console.log("Logged in as:", user.id);

    // Now you can open a synced Realm
    const realm = await Realm.open({
      schema: [], // add your schemas here
      sync: {
        user: user,
        partitionValue: "myPartition",
      },
    });

    return realm;

  } catch (err) {
    console.error("Failed to log in", err);
  }
}

// Usage
login().then(realm => {
  console.log("Realm is ready to use!");
});
