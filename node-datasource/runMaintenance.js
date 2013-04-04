#!/usr/bin/env node
/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global require:true, console:true */

(function () {
  "use strict";

  var request = require('request');
  request({url: 'http://localhost:442/maintenance?core=true',
    timeout: 1000 * 60 * 60 * 12}, // 12 hours

    function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var result = JSON.parse(body).data;

      if (!result) {
        console.log("Maintenance error", arguments);
      } else if (result.isError) {
        console.log("Maintenance error", result.errorLog || result.message);
      } else {
        console.log("Maintenance success!", result.commandLog);
      }
    } else {
      console.log("Cannot connect to server", error);
    }
  });

}());
