import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BackHandler } from "react-native";

import {HomePage} from "./components/home";
import {VendorPage} from "./components/vendor";
import {UserPage} from "./components/user";
import { EventPage } from "./components/event";
import { SettingPage } from "./components/setting";
import { GETDATASETS, GETEVENTS,GETSAVED } from "../Database/Offline/oprations/Read";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { SavedPage } from "./components/saved";

export default function Application({ getAppData,setAppData }) {

  const [getPageStack,setPageStack] = useState(["home"]);
  const [getEvents,setEvents] = useState(false);
  const [getDataSet,setDataSet] = useState({});

  console.log("page Stack ==>  ",getPageStack);

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
      {getPageStack[getPageStack.length - 1] == "user" &&
        <UserPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></UserPage>
      }
      {getPageStack[getPageStack.length - 1] == "event" &&
        <EventPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></EventPage>
      }
      {getPageStack[getPageStack.length - 1] == "home" &&
        <HomePage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></HomePage>
      }
      {getPageStack[getPageStack.length - 1] == "vendor" &&
        <VendorPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></VendorPage>
      }
      {getPageStack[getPageStack.length - 1] == "setting" &&
        <SettingPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></SettingPage>
      }
      {getPageStack[getPageStack.length - 1] == 'saved'&&
        <SavedPage getAppData={getAppData} setAppData={setAppData} setPageStack={setPageStack} getPageStack={getPageStack}></SavedPage>
      }
    </>
  );
}
