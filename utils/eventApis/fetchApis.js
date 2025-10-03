import { EventApi } from "../apis/routers";

const getEventsData = async () => {
  try {
    const response = await fetch("http://10.117.140.18:3000/goevent/events"); // 👈 replace with your PC IP

    if (!response.ok) {
      return {
        err: true,
        mes: `Server returned ${response.status}`,
        code: response.status,
        status: false,
      };
    }

    const res = await response.json();

    if (res.status === 200 && res.data) {
      return res.data; // success
    } 
    else {
      return {
        err: true,
        mes: res.mes || "Unexpected response",
        code: 400,
        status: false,
      };
    }
  } catch (error) {
    return {
      err: error,
      mes: "There is Server Error",
      code: 500,
      status: false,
    };
  }
};

export { getEventsData };
