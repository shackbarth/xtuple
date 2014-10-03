/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require('underscore'),
  assert = require('chai').assert,
  path = require('path');

(function () {
  'use strict';
  describe('Test Share Users Access', function () {
    this.timeout(10 * 1000);

    var initSql = 'select xt.js_init(); ',
      loginData = require(path.join(__dirname, '../lib/login_data.js')).data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, '../../node-datasource/config.js')),
      creds = config.databaseServer,
      databaseName = loginData.org,
      records = {},
      utils = require('../../../xtuple/node-datasource/oauth2/utils');

/**
 * Add records to user durring tests and store reference ids in records object.
 */

    // Add Address.
    before(function (done) {
      var postAddressSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "data":{ \n' +
                            '    "line1":"1 Share Dr.", \n' +
                            '    "city":"Sharetown", \n' +
                            '    "state":"VA", \n' +
                            '    "postalCode":"12345", \n' +
                            '    "country":"United States" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        records.address = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address UUID.
    before(function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.address.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.address.uuid = results.obj_uuid;

        done();
      });
    });

    // Add Contact.
    before(function (done) {
      var postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Share", \n' +
                            '    "middleName":"Access", \n' +
                            '    "lastName":"User", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"shareuser@example.com", \n' +
                            '    "address":"' + records.address.id + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.contact = {
          'id': results.id
        };

        done();
      });
    });

    // Get Contact UUID.
    before(function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.contact.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.contact.uuid = results.obj_uuid;

        done();
      });
    });

    // Get Customer defaults.
    before(function (done) {
      var customerDefaultsSql = 'select xt.post($${ \n' +
                                '  "nameSpace":"XM", \n' +
                                '  "type":"Customer", \n' +
                                '  "dispatch":{ \n' +
                                '    "functionName":"defaults" \n' +
                                '  }, \n' +
                                '  "username":"admin" \n' +
                                '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + customerDefaultsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.customerDefults = results;

        done();
      });
    });

    // Add Customer which also creates a CRM Account.
    before(function (done) {
      var custNumber = utils.generateUUID(), // UUID as random Customer Number.
        data = _.clone(records.customerDefults);

      data.name = 'Share User';
      data.number = custNumber.toUpperCase();
      data.billingContact = records.contact.id;
      data.correspondenceContact = records.contact.id;

      // Add Ship To.
      data.shiptos = [
        {
        "number":"ship2",
        "name":"ship2",
        "isActive":true,
        "isDefault":false,
        "salesRep":"1000",
        "shipZone":null,
        "taxZone":null,
        "shipCharge":"ADDCHARGE",
        "contact":records.contact.id,
        "address":records.address.id,
        "commission":0.075,
        "shipVia":"UPS-GROUND-UPS Ground"
        }
      ];

      var postCustomerSql = 'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "data":' + JSON.stringify(data, null, 2) + ', \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.customer = {
          'id': results.id
        };

        done();
      });
    });

    // Get Customer UUID.
    before(function (done) {
      var getCustomerSql =  "select obj_uuid from custinfo where cust_number = '" + records.customer.id + "';";

      datasource.query(getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.customer.uuid = results.obj_uuid;

        done();
      });
    });

    // Get Ship To ID and UUID.
    before(function (done) {
      var getShiptoSql =  'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.shiptos[0].uuid);

        records.shipto = {
          'id': results.data.shiptos[0].number,
          'uuid': results.data.shiptos[0].uuid
        };

        done();
      });
    });

    // Add user.
    before(function (done) {
      var username = utils.generateUUID(), // UUID as random username.
        postUserAccountSQL =  'select xt.post($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "data":{ \n' +
                              '    "username": "' + username + '", \n' +
                              '    "properName": "Share User", \n' +
                              '    "useEnhancedAuth": true, \n' +
                              '    "disableExport": true, \n' +
                              '    "isActive": true, \n' +
                              '    "initials": "SU", \n' +
                              '    "email": "shareuser@example.com", \n' +
                              '    "organization": "' + creds.database + '", \n' +
                              '    "locale": "Default", \n' +
                              '    "isAgent": false ' +
                              '  }, \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;

      datasource.query(initSql + postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.username = username;
        records.user = {
          "id": results.id
        };

        done();
      });
    });

    // Grant user privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user privs MaintainPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user privs ViewPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.username + "', 'CRM', 'ViewPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user privs MaintainPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.username + "', 'CRM', 'MaintainPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user extension crm.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.username + "', 'crm');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant user extension sales.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.username + "', 'sales');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

/**
 * Run all Share User Access tests.
 *
 * 1. Check that all the records we just created exist.
 * 2. Check xt.share_users view for no matching UUID-to-username.
 * 3. Check xt.cache_share_users view for no matching UUID-to-username.
 * 4. Test access for new user without any Share User association.
 * 5. Set CRM Account user which will grant share user access.
 * 6. Check xt.share_users view for matching UUID-to-username.
 * 7. Check xt.cache_share_users view for matching UUID-to-username.
 * 8. Test access for new user with Share User association.
 * 9. Change Address and check access.
 * 10. Change Contact and check access.
 * 11.
// TODO: Add checks for all trigger logic.
 */

    // Address exists.
    it('Address should exist', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);
        done();
      });
    });

    // Contact exists.
    it('Contact should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);
        done();
      });
    });

    // Customer exists.
    it('Customer should exist', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);
        done();
      });
    });

    // Ship To exists.
    it('Ship To should exist', function (done) {
      var getShiptoSql = "select shipto_num from shiptoinfo where obj_uuid = '"  + records.shipto.uuid + "';";

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.shipto_num);
        done();
      });
    });

    // CRM Account exists.
    it('CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);
        done();
      });
    });

    // User exists.
    it('User should exist', function (done) {
      var getUserAccountSql = 'select xt.get($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "id":"' + records.user.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      datasource.query(initSql + getUserAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.username);
        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username.
    it('xt.share_users view should not have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select obj_uuid, username from xt.share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));
        done();
      });
    });

    // Check xt.cache_share_users table for matching UUID-to-username.
    it('xt.cache_share_users table should not have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select uuid, username from xt.cache_share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));
        done();
      });
    });

    // Test access to Addresses for new user without any Share User association.
    it('New user should not have access any Addresses', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(0, results.length, JSON.stringify(results));
        done();
      });
    });

    // Test access to Contacts for new user without any Share User association.
    it('New user should not have access any Contacts', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(0, results.length, JSON.stringify(results));
        done();
      });
    });

    // Test access to Customers for new user without any Share User association.
    it('New user should not have access any Customers', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "username":"' + records.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(0, results.length, JSON.stringify(results));
        done();
      });
    });

    // Set CRM Account user.
    it('can associate new user with new CRM Account', function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = '" + records.user.id + "' where crmacct_number = '" + records.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username.
    it('xt.share_users view should have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select obj_uuid, username from xt.share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));
        done();
      });
    });

    // Check xt.cache_share_users table for matching UUID-to-username.
    it('xt.cache_share_users table should have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select uuid, username from xt.cache_share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));
        done();
      });
    });

    // Test access to Addresses for new user with Share User association.
    it('New user should have access an Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(1, results.data.length, JSON.stringify(results.data));
        done();
      });
    });

    // Test access to Contacts for new user with Share User association.
    it('New user should have access a Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
console.log("Contact: ", JSON.stringify(results.data, null, 2));
        assert.equal(1, results.data.length, JSON.stringify(results.data));
        done();
      });
    });

    // Test access to Customers for new user with Share User association.
    it('New user should have access a Customer', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "username":"' + records.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(1, results.data.length, JSON.stringify(results.data));
        done();
      });
    });


// Setup Share User Access through CRM Account associations.
// Test xt.share_users view.
// Test xt.cache_share_users table.
// Test Access to objects.
// Change Share User Access assocations.
// Test xt.share_users view.
// Test xt.cache_share_users table.
// Test Access to objects.
// Test Owner.
// Test Rep.
// Test Parent.
// Test limited Ship To Contact access.

/**
 * Tear down after tests.
 */

    // Delete Customer.
    after(function (done) {
      var deleteCustomerSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.customer.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteCustomerSql, creds, function (err, res) {
        done();
      });
    });

    // Delete User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.user.id + "'; \n" +
                                  'drop role "' + records.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.customer.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Address.
    after(function (done) {
      var deleteAddreeeSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Address", \n' +
                              '  "id":"' + records.address.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

  });
}());
