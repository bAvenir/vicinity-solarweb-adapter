const request = require('../../_classes/request');

/*
Mock of external API request service
*/

async function send(endpoint, url){
  let req = new request();
  req.setBody({test:true});
  req.setMethod("POST");
  req.setUri(endpoint, url);
  let uri = url + endpoint;
  try{
      let response = await new Promise(function(resolve, reject) { 
          return uri === "http://success" 
              ? resolve({error: false, msg: "success"}) 
              : reject({error: true, msg: "Problem fetching data"})
      });
      return response;
  } catch(err) {
      return Promise.reject("Missing URI");
  }
}

module.exports.send = send;