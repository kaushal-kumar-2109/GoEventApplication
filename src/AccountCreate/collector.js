// importing libraries 
import { View, Text } from "react-native";
import { useState } from "react";

// importing the files 
import { ChooseCountry } from "./components/chooseCountry";
import { WelcomeScreen } from "./components/welcome";
import { SignupPage } from "./components/signup";
import { Verification } from "./components/varification";
import { LoginPage } from "./components/login";

const Account_Create_Collector = ({ getDB }) => {

    const [getPageStack, setPageStack] = useState(["setCountry"]);
    const [getUserData, setUserData] = useState([]);

    return (<>
        {(getPageStack[getPageStack.length - 1] === 'setCountry' && <ChooseCountry getDB={getDB} setPageStack={setPageStack} getUserData={getUserData} setUserData={setUserData}></ChooseCountry>)}
        {(getPageStack[getPageStack.length - 1] === 'welcome' && <WelcomeScreen setPageStack={setPageStack}></WelcomeScreen>)}
        {(getPageStack[getPageStack.length - 1] === 'login' && <LoginPage getDB={getDB} setPageStack={setPageStack} getUserData={getUserData} setUserData={setUserData}></LoginPage>)}
        {(getPageStack[getPageStack.length - 1] === 'verification' && <Verification getDB={getDB} getPageStak={getPageStack} setPageStack={setPageStack} getUserData={getUserData} setUserData={setUserData}></Verification>)}
        {(getPageStack[getPageStack.length - 1] === 'signup' && <SignupPage getDB={getDB} setPageStack={setPageStack} getUserData={getUserData} setUserData={setUserData}></SignupPage>)}

    </>)
}

export { Account_Create_Collector };