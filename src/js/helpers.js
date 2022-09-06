import { async } from "regenerator-runtime";
import { TIME } from './config.js'
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

export const AJAX = async function(url, uploadData = undefined){
  try{
  const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'//data we will send is in the json format
      },
      body: JSON.stringify(uploadData),
    }) : fetch(url);

    const resp = await Promise.race([fetchPro, timeout(TIME)]); //Returns first promise to fulfill or reject
    const data = await resp.json();
    // Returns actual data
    if(!resp.ok) throw new Error(`${data.message} (${resp.status})`);
    return data;

  }catch(err){
    throw err;
  }
    
};