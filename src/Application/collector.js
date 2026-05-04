// React component and screen logic for the app.
import React, { useEffect, useState } from "react";
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
import { SettingPage } from "./components/setting";
import { NotificationPage } from "./components/notification";

/**
 * Application.
 */
export default function Application({ getDB, getUserData, setUserData }) {

  const [getPageStack, setPageStack] = useState(["home"]);

  useEffect(() => {
    /**
     * Back Action.
     */
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

  /**
   * Set Privious Page Stack.
   */
  const setPriviousPageStack = () => {
    setPageStack(prevStack => {
      if (prevStack.length > 1) {
        return prevStack.slice(0, -1);
      } else {
        BackHandler.exitApp();
        return prevStack;
      }
    });
  }

  const commonProps = {
    getDB,
    getUserData,
    setUserData,
    setPageStack,
    getPageStack
  };

  /**
   * Render Page.
   */
  const renderPage = () => {
    const current = getPageStack[getPageStack.length - 1];
    const base = current.split('.')[0];

    switch (base) {
      case "home":
        return <HomePage {...commonProps} />;
      case "event":
        return <EventPage {...commonProps} />;
      case "vendor":
        return <VendorPage {...commonProps} />;
      case "user":
        return <UserPage {...commonProps} />;
      case "setting":
        return <SettingPage {...commonProps} />;
      case "notification":
        return <NotificationPage {...commonProps} />;
      case "createEvent":
        return <CreateForm {...commonProps} />;
      case "invite":
        return <Invite_User {...commonProps} />;
      case "scan":
        return <QR_Scanner {...commonProps} />;
      case "eventDetails":
        return <Event_Details {...commonProps} />;
      case "vendorDetails":
        return <Vendor_Details {...commonProps} />;
      default:
        return <HomePage {...commonProps} />;
    }
  };

  return (
    <>
      {renderPage()}
    </>
  );
}
