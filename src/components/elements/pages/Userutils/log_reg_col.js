// importing pri-build components
import { useState } from "react";
import { ScrollView,Text,TouchableOpacity,StyleSheet,View } from "react-native";

// importing userBuild Components
import { CSS } from "../../../styles/basicStyle";
import { display,felx,alignItem,justifyContent } from "../../../styles/constant";
import { Register } from "./log_and_reg/register";
import { Login } from "./log_and_reg/login";
const Log_Reg_col = () => {
    const [checkLogin, setCheckLogin] = useState(false);
    return (
    <ScrollView>
      <View style={[CSS["px5"], CSS["py30"], display.df, alignItem.ali_c, justifyContent.jc_c]}>
        
        <Text style={[{ fontSize: 30 }, CSS["fw6"]]}>{checkLogin ? "Login" : "Signup"}</Text>

        <View style={[display.df, felx.fd_r]}>
          <Text>{checkLogin ? "Don’t have an account?" : "Already have an account?"} </Text>
          <TouchableOpacity onPress={() => setCheckLogin(!checkLogin)}>
            <Text style={[CSS["fw8"], CSS["ml10"]]}>{checkLogin ? "Register" : "Login"}</Text>
          </TouchableOpacity>
        </View>

        <View style={[CSS["mt40"], { width: "100%" }, display.df, alignItem.ali_c]}>

          {/* Signup form */}
          {!checkLogin && (
            <>
            <Register></Register>
            </>
          )}

          {/* Login form */}
          {checkLogin && (
            <>
            <Login></Login>
            </>
          )}

          {/* Submit button */}
          {/* <View style={[{ marginTop: 40, width: "80%" }]}>
            {checkLogin ? 
            <TouchableOpacity
              style={[{ borderRadius: 10, width: "100%", backgroundColor: "#0d00fdff" }, CSS["p15"], display.df, alignItem.ali_c]}
              onPress={loginAccount}
            >
              <Text style={buttonText}>Login Account</Text>
            </TouchableOpacity>
            : 
            <TouchableOpacity
              style={[{ borderRadius: 10, width: "100%", backgroundColor: "#0d00fdff" }, CSS["p15"], display.df, alignItem.ali_c]}
              onPress={createAccount}
            >
              <Text style={buttonText}>Create Account</Text>
            </TouchableOpacity>
            }
            
          </View> */}
        </View>
      </View>
    </ScrollView>
  );
}

export {Log_Reg_col};