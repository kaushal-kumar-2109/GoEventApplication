import React, { useEffect, useState } from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BackHandler } from "react-native";

import { HomePage } from "./components/home";
import { VendorPage } from "./components/vendor";
import { UserPage } from "./components/user";
import { EventPage } from "./components/event";
import CreateForm from "./components/Event_Create/Create_Form";
import { Invite_User } from "./components/Event_Create/InviteUser";
import { QR_Scanner } from "./components/Event_Create/scanQR";
import { Event_Details } from "./components/event_details";
import { Vendor_Details } from "./components/vendor_detail";
// import { SettingPage } from "./components/setting";
// import { SavedPage } from "./components/saved";

export default function Application({ getDB, getUserData, setUserData }) {

  const [getPageStack, setPageStack] = useState(["home"]);

  useEffect(() => {
    const backAction = () => {
      setPriviousPageStack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const setPriviousPageStack = () => {
    setPageStack(prevStack => {
      if (prevStack.length > 1) {
        return prevStack.slice(0, -1); // Go back one page
      } else {
        BackHandler.exitApp(); // Exit app if on home screen
        return prevStack;
      }
    });
  }

  return (
    <>
      {getPageStack[getPageStack.length - 1] == "user" &&
        <UserPage getDB={getDB} getUserData={getUserData} setUserData={setUserData} setPageStack={setPageStack} getPageStack={getPageStack}></UserPage>
      }
      {getPageStack[getPageStack.length - 1] == "event" &&
        <EventPage getDB={getDB} getUserData={getUserData} setUserData={setUserData} setPageStack={setPageStack} getPageStack={getPageStack}></EventPage>
      }
      {getPageStack[getPageStack.length - 1] == "home" &&
        <HomePage getDB={getDB} getUserData={getUserData} setUserData={setUserData} setPageStack={setPageStack} getPageStack={getPageStack}></HomePage>
      }
      {getPageStack[getPageStack.length - 1] == "vendor" &&
        <VendorPage getDB={getDB} getUserData={getUserData} setUserData={setUserData} setPageStack={setPageStack} getPageStack={getPageStack}></VendorPage>
      }
      {getPageStack[getPageStack.length - 1] == "setting" &&
        <SettingPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></SettingPage>
      }
      {getPageStack[getPageStack.length - 1] == 'saved' &&
        <SavedPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></SavedPage>
      }
      {getPageStack[getPageStack.length - 1] == 'createEvent' &&
        <CreateForm getDB={getDB} getUserData={getUserData} setUserData={setUserData} setPageStack={setPageStack} getPageStack={getPageStack}></CreateForm>
      }
      {getPageStack[getPageStack.length - 1].split('.')[0] == 'invite' &&
        <Invite_User getDB={getDB} getPageStack={getPageStack} setPageStack={setPageStack}></Invite_User>
      }
      {getPageStack[getPageStack.length - 1].split('.')[0] == 'scan' &&
        <QR_Scanner getDB={getDB} getPageStack={getPageStack} setPageStack={setPageStack}></QR_Scanner>
      }
      {getPageStack[getPageStack.length - 1].split('.')[0] == 'eventDetails' &&
        <Event_Details getDB={getDB} getUserData={getUserData} setUserData={setUserData} getPageStack={getPageStack} setPageStack={setPageStack}></Event_Details>
      }
      {getPageStack[getPageStack.length - 1].split('.')[0] == 'vendorDetails' &&
        <Vendor_Details getDB={getDB} getUserData={getUserData} setUserData={setUserData} getPageStack={getPageStack} setPageStack={setPageStack}></Vendor_Details>
      }
    </>
  );
}
