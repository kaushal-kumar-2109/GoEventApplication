const HOST_NETWORK_PATH = 'http://10.117.114.18:3000';
// http://localhost:3000/GoEvent/User

const APIs = {
    createUser : `${HOST_NETWORK_PATH}/goevent/create/user`,
    getUesrByEmail : `${HOST_NETWORK_PATH}/goevent/user/email`,
    sendOtpByEmail : `${HOST_NETWORK_PATH}/goevent/sendemail`,
    getUserByEmail_Password : `${HOST_NETWORK_PATH}/goevent/user/account/login`,
    updateEmailPassword : `${HOST_NETWORK_PATH}/goevent/update/user/account`
}

const EventApi = {
    getEvent : `${HOST_NETWORK_PATH}/goevent/events`,
}

export {APIs,EventApi};