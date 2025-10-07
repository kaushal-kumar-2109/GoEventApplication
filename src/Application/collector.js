import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {HomePage} from "./components/home";
import {VendorPage} from "./components/vendor";
import {UserPage} from "./components/user";
import { EventPage } from "./components/event";
import { SettingPage } from "./components/setting";
import { GETDATASETS, GETEVENTS,GETSAVED } from "../Database/Offline/oprations/Read";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { SavedPage } from "./components/saved";

export default function Application({ getAppData,setAppData }) {

  const [getPageStack,setPageStack] = useState("home");
  const [getEvents,setEvents] = useState(false);
  const [getDataSet,setDataSet] = useState({});

  // const GetDataSets = async () => {
  //   const rows = await GETEVENTS();
  //   // const getDataSet = await GETDATASETS.GET_DATA_SET(getUserData.getUserData.id);
  //   // console.log(getDataSet);
  //   setEvents(rows);
  // }

  // useEffect(()=>{
  //   GetDataSets();
  // },[])

  return (
    <>
      {getPageStack=="user" &&
        <UserPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></UserPage>
      }
      {getPageStack=="event" &&
        <EventPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></EventPage>
      }
      {getPageStack=="home" &&
        <HomePage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></HomePage>
      }
      {getPageStack=="vendor" &&
        <VendorPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></VendorPage>
      }
      {getPageStack=="setting" &&
        <SettingPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></SettingPage>
      }
      {getPageStack=='saved'&&
        <SavedPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></SavedPage>
      }
    </>
  );
}
