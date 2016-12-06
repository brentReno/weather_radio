require('dotenv').config();
var express = require('express');
var app = express();
var port = process.env.PORT || 3080;
var path = require('path');

app.listen(port, function(){
  console.log('server up on:', port);
  console.log("these are process vars:", process.env.CLIENT_ID);
});
