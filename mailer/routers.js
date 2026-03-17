const HOST_NETWORK_PATH = 'https://goeventserver.onrender.com';
// http://localhost:3000/GoEvent/User
// https://goeventserver.onrender.com

const APIs = {

    sendOtpByEmail: `${HOST_NETWORK_PATH}/goevent/sendemail`,






    getUserByEmail: `${HOST_NETWORK_PATH}/goevent/user`,
    getAllData: `${HOST_NETWORK_PATH}/goevent/all/data`,
    createUserOnline: `${HOST_NETWORK_PATH}/goevent/create/user`,

    // getUesrByEmail : `${HOST_NETWORK_PATH}/goevent/user/email`,

    getUserByEmail_Password: `${HOST_NETWORK_PATH}/goevent/user/account/login`,
    updateEmailPassword: `${HOST_NETWORK_PATH}/goevent/update/user/account`,

    // invitation 
    sendInvitation: `${HOST_NETWORK_PATH}/goevent/send/invitation`,
}

const EventApi = {
    getEvent: `${HOST_NETWORK_PATH}/goevent/events`,
}

export { APIs, EventApi };