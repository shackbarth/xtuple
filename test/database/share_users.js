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
 * Add records to use durring tests and store reference ids in records object.
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
 * 9. Add a new Address and grant explicit access. Can access new Address.
 * 10. Delete an Address, no cache_share_users entry for it.
 * 11. Add a new Contact. Grant explicit access. Can access new Contact.
 * 12. Delete a Contact, no cache_share_users entry for it.
 * 13. Add a new Contact under CRM Account. Can access new Contact and it's Address.
 * 14. Change the Contact's Address. Cannot access old Address. Can access new Address.
 * 15. Change a Contact's CRM Account. Cannot access the Contact or Address any more.
 * 16. Change Customer's Billing Contact. Cannot access old Contact or Address. Can access new Contact and Address.
 * 17. Change Customer's Correspondence Contact. Cannot access old Contact or Address. Can access new Contact and Address.
 * 18. Add Ship To. Can access it and its Contact and Address.
 * 19. Change Ship To Address. Can access new Address. Cannot access old Address.
 * 20. Change Ship To Contact. Can access new Contact. Cannot access old Contact.
 * 21. Delete Ship To. Cannot access old Address. Cannot access old Contact.
 * 22. Add Sales Order for Customer. Can access it.
 * 23. Delete Sales Order. No cache_share_users entry for it.
 *
// TODO: Add checks for all trigger logic.
 *
 * TODO: For xDruple test: Change Ship To Customer. Can access new Customer. Cannot access old Customer.
 * TODO: For xDruple test: Test child CRM account Ship To Contact access.
 *
 * Add an Invoice for Customer. Can access it.
 * Delete Invoice. No cache_share_users entry for it.
 * Test Owner.
 * Test Rep.
 * Test Parent.
 * Delete CRM Account. Cannot access Contacts or Addresses that were on it.
 */

/**
 * Check that all the records we just created exist.
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

        records.customer.etag = results.etag;

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

/**
 * Check xt.share_users view for matching UUID-to-username.
 */
    it('xt.share_users view should not have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select obj_uuid, username from xt.share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Check xt.cache_share_users table for matching UUID-to-username.
 */
    it('xt.cache_share_users table should not have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select uuid, username from xt.cache_share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Test access for new user without any Share User association.
 */
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

/**
 * Set CRM Account user which will grant share user access.
 */
    it('can associate new user with new CRM Account', function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = '" + records.user.id + "' where crmacct_number = '" + records.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Check xt.share_users view for matching UUID-to-username.
 */
    it('xt.share_users view should have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select obj_uuid, username from xt.share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Check xt.cache_share_users table for matching UUID-to-username.
 */
    it('xt.cache_share_users table should have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select uuid, username from xt.cache_share_users where username = '"  + records.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Test access for new user with Share User association.
 */
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
        assert.isDefined(results.data);
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
        assert.isDefined(results.data);
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
        assert.isDefined(results.data);
        assert.equal(1, results.data.length, JSON.stringify(results.data));

        done();
      });
    });

/**
 * Add a new Address and grant explicit access. Can access new Address.
 */
    // Add a new Address as new user to create explicit access grant.
    it('New user can add a new Address', function (done) {
      var postAddressSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "data":{ \n' +
                            '    "line1":"2 Share Dr.", \n' +
                            '    "city":"Sharetown", \n' +
                            '    "state":"VA", \n' +
                            '    "postalCode":"22222", \n' +
                            '    "country":"United States" \n' +
                            '  }, \n' +
                            '  "username":"' + records.username + '" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        records.address2 = {
          'id': results.id
        };

        done();
      });
    });

    // Get the new Address UUID.
    it('Can get the new Address UUID', function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.address2.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.address2.uuid = results.obj_uuid;

        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username for new Address.
    it('xt.share_users view should have matching UUID-to-username association for new Address', function (done) {
      var checkUserAccessSql =  "select obj_uuid, username \n" +
                                "from xt.share_users \n" +
                                "where obj_uuid = '"  + records.address2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));

        done();
      });
    });

    // Check xt.cache_share_users table for matching UUID-to-username for new Address.
    it('xt.cache_share_users table should have matching UUID-to-username association for new Address', function (done) {
      var checkUserAccessSql =  "select uuid, username \n" +
                                "from xt.cache_share_users  \n" +
                                "where uuid = '"  + records.address2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));

        done();
      });
    });

    // Test access to new Address for new user with Share User association.
    it('New user should have access to the new Address', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.address2.id + '", \n' +
                            '  "username":"' + records.username + '" \n' +
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

/**
 * Delete an Address, no cache_share_users entry for it.
 */
    // Delete the new Address.
    it('New user can delete the new Address', function (done) {
      var deleteAddreeeSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Address", \n' +
                              '  "id":"' + records.address2.id + '", \n' +
                              '  "username":"' + records.username + '" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username for new Address.
    it('xt.share_users view should not have matching UUID-to-username association for new Address', function (done) {
      var checkUserAccessSql =  "select obj_uuid, username \n" +
                                "from xt.share_users \n" +
                                "where obj_uuid = '"  + records.address2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // Check xt.cache_share_users table for matching UUID-to-username for new Address.
    it('xt.cache_share_users table should not have matching UUID-to-username association for new Address', function (done) {
      var checkUserAccessSql =  "select uuid, username \n" +
                                "from xt.cache_share_users  \n" +
                                "where uuid = '"  + records.address2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Add a new Contact. Grant explicit access. Can access new Contact.
 */
    // Add a new Contact as new user to create explicit access grant.
    it('New user can add a new Contact', function (done) {
      var postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Share2", \n' +
                            '    "middleName":"Access2", \n' +
                            '    "lastName":"User2", \n' +
                            '    "suffix":"Sr.", \n' +
                            '    "primaryEmail":"shareuser2@example.com" \n' +
                            '  }, \n' +
                            '  "username":"' + records.username + '" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.contact2 = {
          'id': results.id
        };

        done();
      });
    });

    // Get the new Contact UUID.
    it('Can get the new Contact UUID', function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.contact2.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.contact2.uuid = results.obj_uuid;

        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username for new Contact.
    it('xt.share_users view should have matching UUID-to-username association for new Contact', function (done) {
      var checkUserAccessSql =  "select obj_uuid, username \n" +
                                "from xt.share_users \n" +
                                "where obj_uuid = '"  + records.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));

        done();
      });
    });

    // Check xt.cache_share_users table for matching UUID-to-username for new Contact.
    it('xt.cache_share_users table should have matching UUID-to-username association for new Contact', function (done) {
      var checkUserAccessSql =  "select uuid, username \n" +
                                "from xt.cache_share_users  \n" +
                                "where uuid = '"  + records.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));

        done();
      });
    });

    // Test access to new Contact for new user with Share User association.
    it('New user should have access to the new Contact', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.contact2.id + '", \n' +
                            '  "username":"' + records.username + '" \n' +
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

/**
 * Delete a Contact, no cache_share_users entry for it.
 */
    // Delete the new Contact.
    it('New user can delete the new Contact', function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact2.id + '", \n' +
                              '  "username":"' + records.username + '" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username for new Contact.
    it('xt.share_users view should not have matching UUID-to-username association for new Contact', function (done) {
      var checkUserAccessSql =  "select obj_uuid, username \n" +
                                "from xt.share_users \n" +
                                "where obj_uuid = '"  + records.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // Check xt.cache_share_users table for matching UUID-to-username for new Contact.
    it('xt.cache_share_users table should not have matching UUID-to-username association for new Contact', function (done) {
      var checkUserAccessSql =  "select uuid, username \n" +
                                "from xt.cache_share_users  \n" +
                                "where uuid = '"  + records.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.username + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Add a new Contact under CRM Account. Can access new Contact and it's Address.
 */
    // Add a new Address3.
    it('Can add a new Address3', function (done) {
      var postAddressSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "data":{ \n' +
                            '    "line1":"3 Share Dr.", \n' +
                            '    "city":"Sharetown", \n' +
                            '    "state":"VA", \n' +
                            '    "postalCode":"33333", \n' +
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
        records.address3 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address3 UUID.
    it('Can get the new Address3 UUID', function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.address3.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.address3.uuid = results.obj_uuid;

        done();
      });
    });

    // Add a new Contact.
    it('Can add a new Contact3', function (done) {
      var postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Share3", \n' +
                            '    "middleName":"Access3", \n' +
                            '    "lastName":"User3", \n' +
                            '    "primaryEmail":"shareuser@example.com", \n' +
                            '    "address":"' + records.address3.id + '", \n' +
                            '    "account":"' + records.customer.id + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.contact3 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Contact UUID.
    it('Can get the new Contact3 UUID', function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.contact3.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.contact3.uuid = results.obj_uuid;

        done();
      });
    });

    // Test access to new Address for new user with Share User association.
    it('New user should have access to the new Address3', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.address3.id + '", \n' +
                            '  "username":"' + records.username + '" \n' +
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

    // Test access to new Contact for new user with Share User association.
    it('New user should have access to the new Contact3', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.contact3.id + '", \n' +
                            '  "username":"' + records.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.contact3.etag = results.etag;

        done();
      });
    });

/**
 * Change the Contact's Address. Cannot access old Address. Can access new Address.
 */
    // Add a new Address4.
    it('Can add a new Address4', function (done) {
      var postAddressSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "data":{ \n' +
                            '    "line1":"4 Share Dr.", \n' +
                            '    "city":"Sharetown", \n' +
                            '    "state":"VA", \n' +
                            '    "postalCode":"44444", \n' +
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
        records.address4 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address4 UUID.
    it('Can get the new Address4 UUID', function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.address4.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.address4.uuid = results.obj_uuid;

        done();
      });
    });

    // Can change Address association from Contact3
    it('Can change Address association from Contact3', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.contact3.id + '", \n' +
                            '  "etag":"' + records.contact3.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/address", \n' +
                            '    "value":"' + records.address4.id + '" \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchContactSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // Test access to new Address4 for new user with Share User association.
    it('New user should have access to the Contact3s new Address4', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.address4.id + '", \n' +
                            '  "username":"' + records.username + '" \n' +
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

    // Test access to Address3 for new user without any Share User association.
    it('New user should not have access to Contact3s old Address3', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Change a Contact's CRM Account. Cannot access the Contact or Address any more.
 */
    // Get latest etag for Contact3.
    it('Get latest etag for Contact3', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.contact3.id + '", \n' +
                            '  "username":"' + records.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.contact3.etag = results.etag;

        done();
      });
    });

    // Remove CRM Account association from Contact.
    it('Can remove CRM Account association from Contact3', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.contact3.id + '", \n' +
                            '  "etag":"' + records.contact3.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/account", \n' +
                            '    "value":null \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchContactSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // Test access to Address for new user without any Share User association.
    it('New user should not have access to Address4', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Test access to Contact for new user without any Share User association.
    it('New user should not have access to Contact3', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Change Customer's Billing Contact. Cannot access old Contact or Address. Can access new Contact and Address.
 */
    // Patch Customer's Billing Contact.
    it('Can change Customers Billing Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/billingContact", \n' +
                            '    "value":"' + records.contact3.id + '" \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchContactSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User can access new Billing Contact's Address.
    it('New user should have access to Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

    // User can access new Billing Contact.
    it('New user should have access to new Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

    // Get Customer's new etag.
    it('Get Customers new etag', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer's Billing Contact.
    it('Can change Customers Billing Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/billingContact", \n' +
                            '    "value":"' + records.contact.id + '" \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchContactSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User cannot access old Billing Contact's Address.
    it('User cannot access old Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // User cannot access old Billing Contact.
    it('User cannot access old Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Change Customer's Correspondence Contact. Cannot access old Contact or Address. Can access new Contact and Address.
 */
    // Get Customer's new etag.
    it('Get Customers new etag', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer's Correspondence Contact.
    it('Can change Customers Correspondence Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/correspondenceContact", \n' +
                            '    "value":"' + records.contact3.id + '" \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchContactSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User can access new Correspondence Contact's Address.
    it('New user should have access to Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

    // User can access new Correspondence Contact.
    it('New user should have access to new Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

    // Get Customer's new etag.
    it('Get Customers new etag', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer's Correspondence Contact.
    it('Can change Customers Correspondence Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/correspondenceContact", \n' +
                            '    "value":"' + records.contact.id + '" \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchContactSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User cannot access old Correspondence Contact's Address.
    it('User cannot access old Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // User cannot access old Correspondence Contact.
    it('User cannot access old Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Add Ship To. Can access it and its Contact and Address.
 */
    // Get Customer's new etag.
    it('Get Customers new etag', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer to add a second Ship To.
    it('Can add a Customer Ship To', function (done) {
      var patchCustomerSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"add", \n' +
                            '    "path":"/shiptos/1", \n' +
                            '    "value":{ \n' +
                            '      "number":"SHIPTO2", \n' +
                            '      "name":"Ship To 2", \n' +
                            '      "isActive":true, \n' +
                            '      "isDefault":false, \n' +
                            '      "salesRep":"1000", \n' +
                            '      "shipCharge":"ADDCHARGE", \n' +
                            '      "salesRep":"1000", \n' +
                            '      "commission":0.075, \n' +
                            '      "shipVia":"UPS-GROUND-UPS Ground", \n' +
                            '      "contact":"' + records.contact3.id + '", \n' +
                            '      "address":"' + records.address4.id + '" \n' +
                            '    } \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchCustomerSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User can access new Ship To.
    it('New user should have access to new Ship To', function (done) {
      var getCustomerSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.shiptos);
        assert.equal(2, results.data.shiptos.length, JSON.stringify(results.data.shiptos));
        assert.isDefined(results.data.shiptos[1].number);

        records.customer.etag = results.etag;

        done();
      });
    });

    // User can access new Ship To's Address.
    it('New user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

    // User can access new Ship To's Contact.
    it('New user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

/**
 * Change Ship To Address. Can access new Address. Cannot access old Address.
 *
 * Change Ship To Contact. Can access new Contact. Cannot access old Contact.
 */
    // Patch Customer to change second Ship To's Address and Contact.
    it('Can change a Customers Ship To Contact and Address', function (done) {
      var patchCustomerSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[ \n' +
                            '    { \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/contact", \n' +
                            '      "value":"' + records.contact.id + '" \n' +
                            '    },{ \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/address", \n' +
                            '      "value":"' + records.address.id + '" \n' +
                            '    } \n' +
                            '  ], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchCustomerSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User cannot access Ship To's old Address.
    it('User cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // User cannot access Ship To's old Contact.
    it('User cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Delete Ship To. Cannot access old Address. Cannot access old Contact.
 */
    // Get Customer's new etag.
    it('Get Customers new etag', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer to change second Ship To's Address and Contact.
    it('Can change a Customers Ship To Contact and Address', function (done) {
      var patchCustomerSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[ \n' +
                            '    { \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/contact", \n' +
                            '      "value":"' + records.contact3.id + '" \n' +
                            '    },{ \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/address", \n' +
                            '      "value":"' + records.address4.id + '" \n' +
                            '    } \n' +
                            '  ], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchCustomerSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User can access new Ship To's Address.
    it('New user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

    // User can access new Ship To's Contact.
    it('New user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
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

    // Get Customer's new etag.
    it('Get Customers new etag', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.customer.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer to change second Ship To's Address and Contact.
    it('Can delete a Customers Ship To', function (done) {
      var patchCustomerSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.customer.id + '", \n' +
                            '  "etag":"' + records.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"remove", \n' +
                            '    "path":"/shiptos/1" \n' +
                            '  }], \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + patchCustomerSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // User cannot access Ship To's old Address.
    it('User cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.address4.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // User cannot access Ship To's old Contact.
    it('User cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Add Sales Order for Customer. Can access it.
 */

    // Can add a Sales Order.
    it('can add a Sales Order', function (done) {
      var data = {};

      data = {
        "wasQuote":false,
        "status":"O",
        "saleType":"CUST",
        "calculateFreight":true,
        "margin":7.68,
        "subtotal":9.8,
        "taxTotal":0.49,
        "freight":0,
        "miscCharge":0,
        "total":10.29,
        "site":"WH1",
        "currency":"USD",
        "orderDate":"2014-10-06T22:28:16.844Z",
        "customer":records.customer.id,
        "terms":"2-10N30",
        "salesRep":"1000",
        "taxZone":"VA TAX",
        "billtoContact":records.contact.id,
        "shipto":records.shipto.uuid,
        "shiptoContact":records.contact.id,
        "shipZone":"DOMESTIC1",
        "scheduleDate":"2014-10-06T00:00:00.000Z",
        "packDate":"2014-10-06T00:00:00.000Z",
        "commission":0.075,
        "freightWeight":3.75,
        "shipVia":"UPS-GROUND-UPS Ground",
        "billtoName":"Tremendous Toys Incorporated",
        "billtoContactFirstName":"Mike",
        "billtoContactLastName":"Farley",
        "billtoContactPhone":"703-931-4269",
        "billtoContactFax":"703-931-2212",
        "billtoAddress1":"Tremendous Toys Inc.",
        "billtoAddress2":"101 Toys Place",
        "billtoCity":"Walnut Hills",
        "billtoState":"VA",
        "billtoPostalCode":"22209",
        "billtoCountry":"United States",
        "shiptoName":"Olde Towne Store 1",
        "shiptoContactFirstName":"Jake",
        "shiptoContactLastName":"Sweet",
        "shiptoContactPhone":"800-321-5433",
        "shiptoContactFax":"703-931-2212",
        "shiptoAddress1":"Olde Towne Toys Store 1",
        "shiptoAddress2":"1 Duke Street",
        "shiptoCity":"Alexandria",
        "shiptoState":"VA",
        "shiptoPostalCode":"22201",
        "shiptoCountry":"United States"
      };
      // Add Ship To.
      data.lineItems = [
        {
          "firm": false,
          "quantityUnitRatio":1,
          "scheduleDate":"2014-10-06T00:00:00.000Z",
          "subNumber":0,
          "status":"O",
          "atShipping":0,
          "shipped":0,
          "item":"YTRUCK1",
          "site":"WH1",
          "lineNumber":1,
          "taxType":"Taxable",
          "quantityUnit":"EA",
          "priceUnit":"EA",
          "unitCost":2.1193,
          "price":9.8,
          "extendedPrice":9.8,
          "tax":0.49,
          "discount":0,
          "listPriceDiscount":0.10828,
          "markup":3.624168,
          "listPrice":10.99,
          "priceUnitRatio":1,
          "quantity":1,
          "basePrice":9.8,
          "customerPrice":9.8
        }
      ];

      var postSalesOrderSql = 'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"SalesOrder", \n' +
                            '  "data":' + JSON.stringify(data, null, 2) + ', \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postSalesOrderSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.order = {
          'id': results.id
        };

        done();
      });
    });

    // Get the new Sales Order
    it('can get the new Sales Order', function (done) {
      var getSalesOrderSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesOrder", \n' +
                          '  "id":"' + records.order.id + '", \n' +
                          '  "username":"' + records.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getSalesOrderSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.order.etag = results.etag;

        done();
      });
    });

/**
 * Delete Sales Order. No cache_share_users entry for it.
 */
    // Delete the new Sales Order.
    it('Can delete the Sales Order', function (done) {
      var deleteSalesOrderSql =  'select xt.delete($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"SalesOrder", \n' +
                            '  "id":"' + records.order.id + '", \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteSalesOrderSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

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
