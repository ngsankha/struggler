// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('G5_YmBWtI792QfKN');
var express = require('express');
var app = express();

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);

app.get('/', function(req, res) {
    res.send("Express works!");
});
app.listen(port);
console.log("Listening on port: " + port);