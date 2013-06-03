/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
//--------- function to login to the Mobile application -----
(function () {
  "use strict";
  var data1 = require('../../shared/login_data.js'),
    loginObj = require('./loginObj.js'),
    utils = require('./utils.js');
  exports.login = function (browser, desired, test, callback) {
    browser.init(desired, function () {
      browser.get(data1.data.webaddress, function () {
        browser.setImplicitWaitTimeout(10000, function () {
          utils.pause(10000, function () {
            browser.elementById(loginObj.obj.username_id, function (err, el) {
              browser.type(el, data1.data.username, function (err) {
                if (err) {
                  test.ok(false, 'Site not accessable');
                  test.done();
                }
                else {
                  browser.elementById(loginObj.obj.pwd_id, function (err, el2) {
                    browser.type(el2, data1.data.pwd, function () {
                      browser.elementByXPath(loginObj.obj.database_xpath + data1.data.org + "']", function (err, dbel) {
                        browser.clickElement(dbel, function () {
                          utils.pause(1000, function () {
                            browser.elementById(loginObj.obj.login_id, function (err, el3) {
                              browser.clickElement(el3, function () {
                                utils.pause(30000, function () {
                                  browser.waitForElementByXPath(loginObj.obj.welcome_xpath, 60000, function () {
                                    browser.elementsByXPath(loginObj.obj.welcome_xpath, function (err, el5) {
                                      browser.isVisible(el5, function (err, flag) {
                                        if (flag) {
                                          test.ok(flag, 'Site loaded successfully');
                                          console.log('site loaded successfully');
                                          callback(browser, test);
                                        }
                                        else {
                                          test.ok(false, 'Site loading failed or took more than expected time');
                                          setTimeout(2000, function () {
                                            browser.quit();
                                            setTimeout(1000, function () {
                                              test.done();
                                            }, 2000);
                                          }, 2000);
                                        }
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                }
              });
            });
          });
        });
      });
    });
  };
}());

