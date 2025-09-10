import * as Updates from 'expo-updates';

const RELOADAPP = async () => {
  try {
    await Updates.reloadAsync(); // reloads the whole app
  } catch (e) {
    console.log("Failed to reload app:", e);
  }
};

export {RELOADAPP};
