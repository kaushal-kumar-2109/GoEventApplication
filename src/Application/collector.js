import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {HomePage} from "./components/home";
import {VendorPage} from "./components/vendor";
import {UserPage} from "./components/user";
import { EventPage } from "./components/event";
import { SettingPage } from "./components/setting";
import { GETEVENTS,GETSAVED } from "../Database/Offline/oprations/Read";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { SavedPage } from "./components/saved";

export default function Application( getUserData) {

  const [getPageStack,setPageStack] = useState("home");
  const [getEvents,setEvents] = useState(false);

  const GetEvents = async () => {
    const rows = await GETEVENTS();
    setEvents(rows);
  }
  

  useEffect(()=>{
    GetEvents();
  },[])

  return (
    <>
      {getPageStack=="user" &&
        <UserPage getUserData={getUserData} setPageStack={setPageStack} getPageStack={getPageStack}></UserPage>
      }
      {getPageStack=="event" &&
        <EventPage getUserData={getUserData} getEvents={getEvents} setPageStack={setPageStack} getPageStack={getPageStack}></EventPage>
      }
      {getPageStack=="home" &&
        <HomePage getUserData={getUserData} setPageStack={setPageStack} getPageStack={getPageStack}></HomePage>
      }
      {getPageStack=="vendor" &&
        <VendorPage getUserData={getUserData} setPageStack={setPageStack} getPageStack={getPageStack}></VendorPage>
      }
      {getPageStack=="setting" &&
        <SettingPage getUserData={getUserData} setPageStack={setPageStack} getPageStack={getPageStack}></SettingPage>
      }
      {getPageStack=='saved'&&
        <SavedPage getUserData={getUserData} setPageStack={setPageStack} getPageStack={getPageStack}></SavedPage>
      }
    </>
  );
}
