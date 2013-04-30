/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
//---- Utils file containing the necessary utilities -----
(function () {
  "use strict";
  var fs = require('fs'),
    desiredcaps = require('../environments.js');
  //--------- To accept input text --------
  exports.input = function (callback) {
    var stdin = process.stdin,
      input;
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function (key) {
      input = key;
      input = input.substr(0, input.length - 2);
      callback(input);
    });
  };
  //----------- To write results to the results file
  exports.results = function (message) {
    /*fs.appendFile('./results.txt', '--' + message + '--\n', function (err) {
      if (err) throw err;
      
    });*/
    console.log(message);
  };
  // ---------- To return the current date and time ---------
  exports.getDate = function (callback) {
    var str = "",
    currentTime = new Date(),
    hours = currentTime.getHours(),
    minutes = currentTime.getMinutes(),
    seconds = currentTime.getSeconds(),
    dd = currentTime.getDate(),
    mm = currentTime.getMonth() + 1,
    yyyy = currentTime.getFullYear();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
      str += "PM";
    }
    else {
      str += "AM";
    }
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    str = mm + '/' + dd + '/' + yyyy + ' ' + str;
    callback(str);
  };
  //-----pause the execution --
  exports.pause = function (milliseconds, callback) {
    //console.log("waiting to load...");
    setTimeout(callback, milliseconds);
  };
  //------- wait For Displayed -----
  exports.waitForDisplayed = function (browser, xpath, time, callback) {
    var endTime = Date.now() + time,
    func = function () {
      browser.isDisplayed(xpath, function (err, displayed) {
        console.log('displayed value: ' + displayed);
        console.log('error: ' + err);
        if (displayed) {
          callback(true);
        }
        else {
          if (Date.now() > endTime) {
            callback(false);
          }
          else {
            setTimeout(func, 1000);
          }
        }
      });
    };
    func();
  };

}());
