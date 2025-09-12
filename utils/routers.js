HOST_NETWORK_PATH = 'https://goeventserver.onrender.com';

const APIs = {
    getUesrByEmail : `${HOST_NETWORK_PATH}/goevent/user/email`,
    sendOtpByEmail : `${HOST_NETWORK_PATH}/goevent/sendemail`,
    getUserByEmail_Password : `${HOST_NETWORK_PATH}/goevent/user/account/login`,
    updateEmailPassword : `${HOST_NETWORK_PATH}/goevent/update/user/account`
}

export {APIs};