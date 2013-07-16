/*jshint node:true, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, strict:true, trailing:true, white:false*/
//------Ignoring the indentation for better readability ---------
(function () {
  "use strict";
  var contactData = require('./contactData.js'),
  contactObj = require('./contactObj.js'),
  utils = require('./utils.js'),
  readContactObj;
  exports.deleteContact = function (browser, test, fname, callback) {
  readContactObj = contactObj.Obj.readContact_xpath + fname +  "')]";
  utils.pause(10000, function () {
  browser.elementByXPath(contactObj.Obj.crmlink_xpath, function (err, el1) {
  browser.clickElement(el1, function () {
  browser.waitForElementByXPath(contactObj.Obj.contactslink_xpath, 60000, function () {
  browser.elementByXPathOrNull(contactObj.Obj.contactslink_xpath, function (err, el2) {
  browser.clickElement(el2, function () {
  utils.results('**** Deleting the contact ****');
  utils.pause(4000,function () {
  browser.elementByXPath(contactObj.Obj.searchField_xpath, function (err, el27) {
  browser.type(el27, fname + "\uE007", function (err) {
  utils.pause(6000, function () {
  browser.elementByXPath(contactObj.Obj.deleteContactItem_xpath, function (err, itemEl) {
  browser.clickElement(itemEl, function () {
  utils.pause(6000, function () {
  browser.elementByXPath(contactObj.readObj1.deleteContactGearIcon_xpath,function (err,gearEl) {
  browser.clickElement(gearEl, function () {
  utils.pause(2000,function () {
  browser.elementByXPath(contactObj.Obj.deleteContactButton_xpath, function (err, el34) {
  browser.clickElement(el34, function () {
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.Obj.deleteOkButton_xpath, function (err, el35) {
  browser.clickElement(el35, function () {
  utils.pause(5000, function () {
  browser.hasElementByXPath(readContactObj, function (err, flag2) {
  if (flag2) {
    test.ok(false, 'Contact deletion failed');
    utils.results('Contact not deleted');
  }
  else {
    test.ok(true, 'contact deleted successfully');
    utils.results('contact deleted sucessfully');
  }
  utils.pause(2000, function () {
  callback(browser, test);
  });});});});});});});});});});});});});});});});});});});});});});});});};
}());


