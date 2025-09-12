import { APIs } from "./routers";
const fetchApi = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();   // parse JSON
    if(data.length>0){
        return data;
    }
    else{
        return false;
    }
  } catch (err) {
    console.log("Error in fetching data:", err);
  }
};

const getUserByEmail = async (email,password) => {
  let res = await fetch(APIs.getUserByEmail_Password, {      //"https://goeventserver.onrender.com/goevent/user/account/login"
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      UserEmail:email,
      UserPassword:password
    })
  });
  
  res = await res.json();

  if(res.status){
    alert("Got Your Account!");
    return res.res;
  }
  else{
    alert('Check Email and Password again!');
    return false
  }
}

const updateUserByEmail = async (email,password) => {
  let res = await fetch(APIs.updateEmailPassword, {      //https://goeventserver.onrender.com/goevent/update/user/account
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      UserEmail:email,
      UserPassword:password
    })
  });
  
  res = await res.json();

  if(res.status){
    alert("Password Updated!");
    return res.res;
  }
  else{
    alert('Password Not Updated Technical err!');
    return false
  }
}


export { fetchApi, getUserByEmail, updateUserByEmail };
