/*jshint node:true, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, strict:true, trailing:true, white:false */
//------Ignoring the indentation for better readability ---------
//--------- This is the file for create contact scenario for Firefox and chrome browsers
(function () {
  "use strict";
  var contactData = require('./contactData.js'),
  contactObj = require('./contactObj.js'),
  readContactObj,
  utils = require('./utils.js');
  exports.createContact = function (browser, test, fname, callback) {
  readContactObj = contactObj.readObj1.readContact_xpath + fname +  "')]";
  utils.results('*****Creating a New Contact*****');
  utils.pause(60000, function () {
  browser.windowHandle(function (err, win) {
  browser.maximize(win, function (err) {
  utils.pause(4000, function () {
  browser.elementByXPath(contactObj.Obj.crmlink_xpath, function (err,el1) {
  browser.clickElement(el1, function (err) {
  browser.waitForElementByXPath(contactObj.Obj.contactslink_xpath, 60000, function (err) {
  browser.elementByXPathOrNull(contactObj.Obj.contactslink_xpath, function (err, el2) {
  browser.clickElement(el2, function (err) {
  utils.pause(4000, function () {
  browser.elementByXPathOrNull(contactObj.Obj.newbutton_xpath, function (err, el3) {
  browser.clickElement(el3, function (err) {
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.Obj.overview_xpath, function (err, overviewEl) {
  browser.clickElement(overviewEl, function (err) {
  browser.elementByXPath(contactObj.Obj.cfname_xpath, function (err, el4) {
  browser.type(el4, fname, function (err) {
  browser.elementByXPath(contactObj.Obj.cmname_xpath, function (err, el5) {
  browser.type(el5, contactData.VARIABLES.contact_mname, function (err) {
  browser.elementByXPath(contactObj.Obj.clname_xpath, function (err, el6) {
  browser.type(el6, contactData.VARIABLES.contact_lname, function (err) {
  browser.elementByXPath(contactObj.Obj.caccount_xpath, function (err, el15) {
  browser.type(el15, contactData.VARIABLES.contact_account + '\uE004', function () {
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.Obj.cowner_xpath, function (err, el16) {
  browser.clear(el16, function () {
  utils.pause(2000,function () {
  browser.type(el16, contactData.VARIABLES.contact_owner, function (err) {
  browser.type(el16, '\uE004', function () {
  utils.pause(2000,function () {
  browser.elementByXPath(contactObj.Obj.addressEditButton_xpath, function (err, el7) {
  browser.clickElement(el7, function (err) {
  browser.waitForElementByXPath(contactObj.Obj.addressLine1_xpath, 4000, function (err) {
  browser.elementByXPath(contactObj.Obj.addressLine1_xpath, function (err, el8) {
  //browser.type(el8,contactData.VARIABLES.contact_addressLine1, function (err) {
  browser.type(el8,fname, function (err) {
  browser.elementByXPath(contactObj.Obj.addressDoneButton_xpath, function (err, doneEl) {
  browser.clickElement(doneEl, function (err) {
  browser.elementByXPath(contactObj.Obj.jobtitle_xpath, function (err,el9) {
  browser.type(el9,contactData.VARIABLES.contact_jobtitle, function (err) {
  //browser.elementByXPath(contactObj.Obj.email_xpath, function (err, el10) {
  //browser.type(el10, contactData.VARIABLES.contact_email, function (err) {
  browser.elementByXPath(contactObj.Obj.phone_xpath, function (err, el11) {
  browser.type(el11, contactData.VARIABLES.contact_phone, function (err) {
  browser.elementByXPath(contactObj.Obj.cnotes_xpath, function (err, el14) {
  browser.type(el14, contactData.VARIABLES.contact_notes, function (err) {
  browser.elementByXPath(contactObj.Obj.charecnew_xpath, function (err, el12) {
  browser.clickElement(el12, function (err) {
  browser.waitForElementByXPath(contactObj.Obj.charecinput_xpath, 1000, function (err) {
  browser.elementByXPath(contactObj.Obj.charecinput_xpath, function (err, el13) {
  browser.type(el13,contactData.VARIABLES.contact_bday, function (err) {
  browser.elementByXPath(contactObj.Obj.caccount_xpath, function (err, el15) {
  utils.pause(2000,function () {
  browser.elementByXPathOrNull(contactObj.Obj.saveToolBar_xpath, function (err, toolbarEl) {
  browser.clickElement(toolbarEl, function () {
  utils.pause(4000, function () {
  browser.elementByXPath(contactObj.Obj.savebutton_xpath, function (err, el17) {
  browser.clickElement(el17, function (err) {
  utils.pause(4000,function () {
  browser.waitForElementByXPath(contactObj.readObj1.searchField_xpath, 5000, function (err) {
  browser.elementByXPath(contactObj.readObj1.searchField_xpath, function (err, el27) {
  browser.type(el27, fname + "\uE007", function (err) {
  utils.pause(6000,function () {
  browser.elementByXPath(contactObj.readObj1.contactsHeading_xpath, function (err, headingEl) {
  browser.clickElement(headingEl, function (err) {
  browser.waitForVisibleByXPath(readContactObj, 60000,function (err) {
  browser.elementByXPath(readContactObj, function (err, contactEl) {
  browser.isDisplayed(contactEl, function (err, displayed) {
  if (displayed) {
  console.log('Contact Saved');
  test.ok(displayed, 'contact saved');
  callback(browser,test);
  }
  else {
  test.ok(false, 'contact not saved');
  setTimeout(function () {
  browser.quit();
  setTimeout(function () {
  test.done();
  },2000);
  },2000);
  }
  //});});
  });});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});
  });});});});});});});});});});});});});};
}());