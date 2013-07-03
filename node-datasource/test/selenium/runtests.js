/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
//----- Link file with driver to launch web driver for different environments ---------
(function () {
  "use strict";
  var webdriver = require('wd'),
    login = require('./lib/login.js'),
    loginData = require('../shared/login_data.js'),
    createContact_FFnC = require('./lib/createContactForFFnC.js'),
    createContact_Android = require('./lib/createContactForAndroid.js'),
    createContact_lowRes = require('./lib/createContactForFFonWin8.js'),
    createContact_Iphone = require('./lib/createContactForIphone.js'),
    readContact_Iphone = require('./lib/readContactForIphone.js'),
    readContact_FFnC = require('./lib/readContactForFFnC.js'),
    readContact_Android = require('./lib/readContactForAndroid.js'),
    readContact_lowRes = require('./lib/readContactForFFonWin8.js'),
    deleteContact_Android = require('./lib/deleteContactForAndroid.js'),
    time = require('./lib/utils.js'),
    sldriver = webdriver.remote(
      "ondemand.saucelabs.com",
      80,
      loginData.data.suname,
      loginData.data.sakey),
    //sldriver = webdriver.remote(),
    desiredcaps = require('./environments.js');
  sldriver.on('status', function (info) {
    time.getDate(function (date) {
      console.log(date);
      console.log('\x1b[36m%s\x1b[0m', info);
    });
  });

  /*sldriver.on('command', function (meth, path) {
    console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
  });*/
  module.exports = {
    'chrome on Windows 7' : function (test1) {
      console.log('starting first test on chrome');
      starttest(desiredcaps.caps[0], 'uname1', test1);
    },
    'Firefox on Windows 8' : function (test2) {
      console.log('starting second test on firefox');
      starttest(desiredcaps.caps[1], 'uname2', test2);
    },
    'Android on linux' : function (test3) {
      console.log('starting third test on Android');
      starttest(desiredcaps.caps[2], 'uname3', test3);
    },
    //Commenting the iphone environment because of the security dialog
    /*'iPhone on Mac 10.6' : function (test4) {
      console.log('starting test on iPhone');
      starttest(desiredcaps.caps[3], 'uname4', test4);
    },
    'Safari on Mac 10.6' : function (test5) {
      console.log('starting test on Safari');
      starttest(desiredcaps.caps[4], 'uname5', test5);
    },*/
    'Chrome on Linux' : function (test6) {
      console.log('starting test on chrome on linux');
      starttest(desiredcaps.caps[5], 'uname6', test6);
    }
  };
  var starttest = function (caps, fname, test) {
    try {
      if ((caps.platform === "Windows XP") || (caps.platform === "Windows 7") || (caps.platform === "Windows 2012")) {
        login.login(sldriver, caps, test, function (sldriver, test) {
          createContact_FFnC.createContact(sldriver, test, fname, function (sldriver, test) {
            readContact_FFnC.readContact(sldriver, test, fname, function (sldriver, test) {
              setTimeout(function () {
                sldriver.quit();
                setTimeout(function () {
                  test.done();
                }, 2000);
              }, 2000);
            });
          });
        });
      }
      else if (caps.platform === "Linux") {
        if (caps.browserName === "android") {
          login.login(sldriver, caps, test, function (sldriver, test) {
            createContact_Android.createContact(sldriver, test, fname, function (sldriver, test) {
              readContact_Android.readContact(sldriver, test, fname, function (sldriver, test) {
                setTimeout(function () {
                  sldriver.quit();
                  deleteContact(caps, fname, test);
                }, 2000);
              });
            });
          });
        }
        else {
          login.login(sldriver, caps, test, function (sldriver, test) {
            createContact_lowRes.createContact(sldriver, test, fname, function (sldriver, test) {
              readContact_lowRes.readContact(sldriver, test, fname, function (sldriver, test) {
                setTimeout(function () {
                  sldriver.quit();
                  setTimeout(function () {
                    test.done();
                  }, 2000);
                }, 2000);
              });
            });
          });
        }
      }
      else if ((caps.platform === "Mac 10.6") || (caps.platform === "Mac 10.8")) {
        if ((caps.browserName === "iphone") || (caps.browserName === "ipad")) {
          login.login(sldriver, caps, test, function (sldriver, test) {
            createContact_Iphone.createContact(sldriver, test, fname, function (sldriver, test) {
              readContact_Iphone.readContact(sldriver, test, fname, function (sldriver, test) {
                setTimeout(function () {
                  sldriver.quit();
                  setTimeout(function () {
                    test.done();
                  }, 2000);
                }, 2000);
              });
            });
          });
        }
        else {
          login.login(sldriver, caps, test, function (sldriver, test) {
            createContact_lowRes.createContact(sldriver, test, fname, function (sldriver, test) {
              readContact_lowRes.readContact(sldriver, test, fname, function (sldriver, test) {
                setTimeout(function () {
                  sldriver.quit();
                  setTimeout(function () {
                    test.done();
                  }, 2000);
                }, 2000);
              });
            });
          });
        }
      }
    }
    catch (e) {
      console.log('Exception in starting test' + e);
    }
  };
  var deleteContact = function (caps, fname, test) {
    caps = { browserName: 'firefox',
      version: '19',
      platform: 'Windows 2012',
      tags: ["delete contact"],
      name: "Delete contact on Firefox and Windows 8"
    };
    login.login(sldriver, caps, test, function (sldriver, test) {
      deleteContact_Android.deleteContact(sldriver, test, fname, function (sldriver, test) {
        setTimeout(function () {
          sldriver.quit();
          setTimeout(function () {
            test.done();
          }, 2000);
        }, 2000);
      });
    });
  };
}());


    
