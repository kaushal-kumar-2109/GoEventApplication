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


export { fetchApi };
