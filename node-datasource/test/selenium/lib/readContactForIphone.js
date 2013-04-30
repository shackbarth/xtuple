/*jshint node:true, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, strict:true, trailing:true, white:false*/
//------Ignoring the indentation for better readability ---------
(function () {
  "use strict";
  var contactData = require('./contactData.js'),
  contactObj = require('./contactObj.js'),
  utils = require('./utils.js'),
  fcount = 0,
  readContactObj;
  exports.readContact = function (browser, test, fname, callback) {
  readContactObj = contactObj.readObj1.readContact_xpath + fname +  "')]";
  utils.results('*****Reading a Contact*****');
  utils.pause(10000, function () {
  browser.waitForElementByXPath(readContactObj, 2000, function () {
  browser.elementByXPath(readContactObj, function (err,el3) {
  browser.clickElement(el3, function () {
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.readObj1.overview_xpath, function (err, overviewEl) {
  browser.clickElement(overviewEl, function () {
  browser.waitForElementByXPath(contactObj.readObj1.heading_xpath, 10000, function (err1) {
  if (err1) {
  utils.results('Contact Heading incorrect');
  }
  else {
  utils.results('Contact Heading verified');
  }
  browser.elementByXPath(contactObj.readObj1.cfname_xpath, function (err,el4) {
  browser.getValue(el4, function (err,value) {
  if (value === fname) {
  utils.results('PASS: First name verified');
  }
  else {
  utils.results('FAIL: First name incorrect');
  fcount++;
  console.log(fcount);
  }
  browser.elementByXPath(contactObj.readObj1.cmname_xpath, function (err,el5) {
  browser.getValue(el5, function (err,value) {
  if (value === contactData.VARIABLES.contact_mname) {
  utils.results('PASS: Middle name verified');
  }
  else {
  utils.results('FAIL: Middle name incorrect');
  fcount++;
  }
  browser.elementByXPath(contactObj.readObj1.clname_xpath, function (err,el6) {
  browser.getValue(el6, function (err,value) {
  if (value === contactData.VARIABLES.contact_lname) {
  utils.results('PASS: Last name verified');
  }
  else {
  utils.results('FAIL: Last name incorrect');
  fcount++;
  }
  /*browser.elementByXPath(contactObj.readObj1.addressEditButton_xpath, function (err, el7) {
  browser.clickElement(el7, function () {
  browser.elementByXPath(contactObj.readObj1.addressLine1_xpath, function (err, el8) {
  browser.getValue(el8, function (err,value) {
  if (value === contactData.VARIABLES.contact_addressLine1) {
  utils.results('PASS: Address Line verified');
  }
  else {
  utils.results('FAIL: Address Line incorrect');
  fcount++;
  }
  browser.elementByXPath(contactObj.readObj1.addressDoneButton_xpath, function (err, el9) {
  browser.clickElement(el9, function () {
  browser.elementByXPath(contactObj.readObj1.jobtitle_xpath, function (err,el10) {
  browser.getValue(el10, function (err,value) {
  if (value === contactData.VARIABLES.contact_jobtitle) {
  utils.results('PASS: Job title Verified');
  }
  else {
  utils.results('FAIL: Job Title incorrect');
  fcount++;
  }
  browser.elementByXPath(contactObj.readObj1.email_xpath, function (err,el11) {
  browser.getValue(el11, function (err,value) {
  if (value === contactData.VARIABLES.contact_email) {
  utils.results('PASS: Email verified');
  }
  else {
  utils.results('FAIL: Email incorrect');
  fcount++;
  }
  browser.elementByXPath(contactObj.readObj1.phone_xpath, function (err,el11) {
  browser.getValue(el11, function (err,value) {
  if (value === contactData.VARIABLES.contact_phone) {
  utils.results('PASS: Phone No. verified');
  }
  else {
  utils.results('FAIL: Phone No. incorrect');
  fcount++;
  }
  browser.hasElementByXPath(contactObj.readObj1.charecRead_xpath, function (err,bool) {
  if (bool) {
  utils.results('PASS: Charecteristic verified');
  }
  else {
  utils.results('FAIL: Charecteristic. incorrect');
  fcount++;
  }
  browser.elementByXPath(contactObj.readObj1.cnotes_xpath, function (err,el11) {
  browser.moveTo(el11, function () {
  browser.getValue(el11, function (err,value) {
  if (value === contactData.VARIABLES.contact_notes) {
  utils.results('PASS: Contact notes verified');
  }
  else {
  utils.results('FAIL: Contact Notes incorrect');
  fcount++;
  }*/
  browser.elementByXPath(contactObj.readObj1.caccount_xpath, function (err,el11) {
  browser.getValue(el11, function (err,value) {
  if (value === contactData.VARIABLES.contact_account) {
  utils.results('PASS: Contact account verified');
  }
  else {
  utils.results('FAIL: Contact account incorrect');
  fcount++;
  }
  browser.elementByXPath(contactObj.readObj1.cowner_xpath, function (err,el11) {
  browser.getValue(el11, function (err,value) {
  if (value === contactData.VARIABLES.contact_owner) {
  utils.results('PASS: Contact owner verified');
  }
  else {
  utils.results('FAIL: Contact owner incorrect');
  fcount++;
  }
  utils.pause(4000, function () {
  if(fcount > 0) {
    test.ok(false, 'contact read failed');
  }
  else {
    test.ok(true, 'contact read successfully');
  }
  process.nextTick(function () {
  utils.results('***** Updating the contact *****');
  });
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.readObj1.cmname_xpath, function (err,el22) {
  browser.clear(el22, function () {
  browser.elementByXPath(contactObj.readObj1.cmname_xpath, function (err,el24) {
  browser.type(el24,contactData.VARIABLES.contact_newmname, function () {
  browser.elementByXPath(contactObj.readObj1.clname_xpath, function (err,el24) {
  browser.type(el24,' ', function () {
  browser.elementByXPathOrNull(contactObj.readObj1.saveToolBar_xpath, function (err, toolbarEl) {
  browser.clickElement(toolbarEl, function () {
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.readObj1.savebutton_xpath, function (err, el25) {
  browser.clickElement(el25, function () {
  utils.pause(4000, function () {
  //---- Verifying the contact Update -------------
  process.nextTick(function () {
  utils.results('***** Verifying the contact Update*****');
  });
  browser.elementByXPathOrNull(contactObj.readObj1.newToolBar_xpath, function (err, toolBarEl) {
  browser.clickElement(toolBarEl, function () {
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.readObj1.refreshButton_xpath, function (err, el26) {
  browser.clickElement(el26, function () {
  utils.pause(5000, function () {
  browser.elementByXPath(contactObj.readObj1.contactsHeading_xpath, function (err,headingEl) {
  browser.clickElement(headingEl, function () {
  browser.elementByXPath(readContactObj, function (err,contactEl) {
  browser.clickElement(contactEl, function () {
  utils.results('Opening the contact For verification');
  utils.pause(6000, function () {
  browser.elementByXPath(contactObj.readObj1.contactmname2_xpath, function (err,el30) {
  browser.getValue(el30, function (err,value) {
  if(value === contactData.VARIABLES.contact_newmname)  {
  test.ok(true, 'contact update successful');
  utils.results("Contact updated with new middle name");
  }
  else {
  test.ok(false, 'contact update failed');
  utils.results("Contact not updated with new middle name");
  }
  browser.elementByXPath(contactObj.readObj1.backButton_xpath, function (err, el31) {
  browser.clickElement(el31, function () {
  utils.results('**** Deleting the contact ****');
  utils.pause(6000, function () {
  browser.elementByXPath(contactObj.readObj1.deleteContactGearIcon_xpath,function (err,gearEl) {
  browser.clickElement(gearEl, function () {
  utils.pause(2000,function () {
  browser.elementByXPath(contactObj.readObj1.deleteContactButton_xpath, function (err, el34) {
  browser.clickElement(el34, function () {
  utils.pause(2000, function () {
  browser.elementByXPath(contactObj.readObj1.deleteOkButton_xpath, function (err, el35) {
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
  });
  });});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});
  });});});});});});});});});});});});});});});});});};/*});});});});});});});});});});});});});});});});};*/
}());


