const express = require('express')
const bodyParser = require("body-parser");
const request = require("request");
require('../../config')


let validateCaptcha = (req, res) => {
  let token = req.body.recaptcha;
  const secretkey = process.env.SECRETKEYCAPTCHA;

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}&remoteip=${req.connection.remoteAddress}`

    if(token === null || token === undefined){
      res.status(201).send({success: false, message: "Token is empty or invalid"})
      return;
    }


    request(url, function(err, response, body){
      //the body is the data that contains success message
      body = JSON.parse(body);
      
      //check if the validation failed
      if(body.success !== undefined && !body.success){
           res.send({success: false, 'message': "recaptcha failed"});
       }
      
      //if passed response success message to client
       res.send({"success": true, 'message': "recaptcha passed"});
    
    })
}

module.exports = {
  validateCaptcha
}
