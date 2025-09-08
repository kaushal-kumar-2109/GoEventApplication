// utils/styles.js
import { StyleSheet } from "react-native";

// const c = StyleSheet.create({
//     he:{
//         gi:89
//     }
// })

const CSS = {};

for (let i = 1; i <= 100; i++) {
  // Margin
  CSS[`m${i}`]={ margin: i };
  CSS[`mt${i}`] = { marginTop: i };
  CSS[`mb${i}`] = { marginBottom: i };
  CSS[`ml${i}`] = { marginLeft: i };
  CSS[`mr${i}`] = { marginRight: i };
  CSS[`mx${i}`] = { marginHorizontal: i };
  CSS[`my${i}`] = { marginVertical: i };

  // Padding
  CSS[`p${i}`] = { padding: i };
  CSS[`pt${i}`] = { paddingTop: i };
  CSS[`pb${i}`] = { paddingBottom: i };
  CSS[`pl${i}`] = { paddingLeft: i };
  CSS[`pr${i}`] = { paddingRight: i };
  CSS[`px${i}`] = { paddingHorizontal: i };
  CSS[`py${i}`] = { paddingVertical: i };

  // Font size
  CSS[`fs${i}`] = { fontSize: i };

}
for(let i = 0;i<10;i++){
  CSS[`fw${i}`] = { fontWeight:`${i*100}`};
}

StyleSheet.create(CSS);

export {CSS};
