import * as Network from "expo-network";

async function CheckInternet() {
  const state = await Network.getNetworkStateAsync();
  console.log("Is connected:", state.isConnected);   // true/false
  // console.log("Type:", state.type);                  // wifi, cellular, etc.

  if (state.isConnected) {
    return state.isConnected;
  } else {
    alert("❌ No internet connection");
    return false;
  }
}


export { CheckInternet }