import * as Network from "expo-network";

async function checkInternet() {
  const state = await Network.getNetworkStateAsync();
  console.log("Is connected:", state.isConnected);   // true/false
  // console.log("Type:", state.type);                  // wifi, cellular, etc.

  if (state.isConnected) {
    return true;
  } else {
    alert("❌ No internet connection");
    return false;
  }
}


export {checkInternet}