import { useState } from "react";

// importing user-build components 
import { ChooseCountry } from "./componetnts/chooseCountry";   // importing choosecountry page where use choose the country.
import { WelcomeScreen } from "./componetnts/welcome";   // importing the welcome page where user select for login and signup.
import { LoginPage } from "./componetnts/login";    // importing the login page where user input details for login.
import { SignupPage } from "./componetnts/signup";   // importing signup page where user create there account.
import { Verification } from "./componetnts/varification";

//importing functions 
const UserSetup = ({setMainPageStack}) => {
  const [getPageStack,setPageStack] = useState(["setCountry"]);

  if(getPageStack[getPageStack.length-1]==='done'){
    console.log('done');
    setMainPageStack(true);
  }

  return (
    <>
      {(getPageStack[getPageStack.length-1]==="setCountry")
        ? <ChooseCountry setPageStack={setPageStack} />
        : (getPageStack[getPageStack.length-1]==="welcome")
          ? <WelcomeScreen setPageStack={setPageStack} />
          :(getPageStack[getPageStack.length-1] === "login")
            ?(getPageStack[getPageStack.length-1] === "verification")
              ?<Verification setPageStack={setPageStack} setMainPageStack={setMainPageStack}></Verification>
              :<LoginPage setPageStack={setPageStack} />
            :(getPageStack[getPageStack.length-1] === "verification")
              ?<Verification setPageStack={setPageStack} setMainPageStack={setMainPageStack}></Verification>
              :<SignupPage setPageStack={setPageStack}/>
      }
    </>
  );
};

export {UserSetup};