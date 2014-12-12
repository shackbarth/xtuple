/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require('underscore'),
  assert = require('chai').assert,
  path = require('path');

(function () {
  'use strict';
  describe('Test Share Users Access:', function () {
    this.timeout(10 * 1000);

    var initSql = 'select xt.js_init(); \n',
      loginData = require(path.join(__dirname, '../lib/login_data.js')).data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, '../../node-datasource/config.js')),
      creds = config.databaseServer,
      databaseName = loginData.org,
      records = {
        "rep": {},
        "owner": {},
        "share": {}
      },
      utils = require('../../../xtuple/node-datasource/oauth2/utils');


/**
 * Run all Share User Access tests.
 *
 * 1. Add records to use durring tests and store reference ids in records object.
 * 2. Check that all the records we just created exist.
 * 3. Check xt.share_users view for no matching UUID-to-username.
 * 4. Check xt.cache_share_users view for no matching UUID-to-username.
 * 5. Test access for Rep, Owner and New user without any Share User association.
 * 6. Set Customer Rep which will grant Rep user share user access.
 * 7. Set CRM Account Owner which will grant Owner user share user access.
 * 8. Set CRM Account user which will grant share user access.
 * 9. Check xt.share_users view for matching UUID-to-username.
 * 10. Check xt.cache_share_users view for matching UUID-to-username.
 * 11. Test access for new user with Share User association.
 * 12. Add a new Address and grant explicit access. Can access new Address.
 * 13. Delete an Address, no cache_share_users entry for it.
 * 14. Add a new Contact. Grant explicit access. Can access new Contact.
 * 15. Delete a Contact, no cache_share_users entry for it.
 * 16. Add a new Contact under CRM Account. Can access new Contact and it's Address.
 * 17. Change the Contact's Address. Cannot access old Address. Can access new Address.
 * 18. Change a Contact's CRM Account. Cannot access the Contact or Address any more.
 * 19. Change Customer's Billing Contact. Cannot access old Contact or Address. Can access new Contact and Address.
 * 20. Change Customer's Correspondence Contact. Cannot access old Contact or Address. Can access new Contact and Address.
 * 21. Add Ship To. Can access it and its Contact and Address.
 * 22. Change Ship To Address. Can access new Address. Cannot access old Address.
 * 23. Change Ship To Contact. Can access new Contact. Cannot access old Contact.
 * 24. Delete Ship To. Cannot access old Address. Cannot access old Contact.
 * 25. Add Sales Order for Customer. Can access it.
 * 26. Delete Sales Order. No cache_share_users entry for it.
 * 27. Add an Invoice for Customer. Can access it.
 * 28. Delete Invoice. No cache_share_users entry for it.
 * 29. Delete CRM Account. Cannot access Contacts or Addresses that were on it.
 * 30. Tear down after tests.
 */

/**
 * Add records to use durring tests and store reference ids in records object.
 *
 * 1. Sales Rep with CRM Account and User Account.
 * 2. Owner with CRM Account and User Account.
 * 3. Basic Share User with CRM Account, User Account, Customer, Ship To, Contact and Address.
 */

/**
 * Sales Rep with CRM Account and User Account.
 */
    // Add Sales Rep.
    before(function (done) {
      var username = utils.generateUUID(), // UUID as random Rep Number.
        postSalesRepSql =  'select xt.post($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesRep", \n' +
                          '  "data":{ \n' +
                          '    "isActive":true, \n' +
                          '    "commission":0.10, \n' +
                          '    "number":"' + username.toUpperCase() + '", \n' +
                          '    "postalCode":"12345", \n' +
                          '    "name":"Sales Rep" \n' +
                          '  }, \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postSalesRepSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.rep.salesRep = {
          'id': results.id
        };
        records.rep.account = {
          "id": results.id
        };
        records.rep.username = username;

        done();
      });
    });

    // Add Rep UserAccount which will also create a CRM Account.
    before(function (done) {
      var postUserAccountSQL =  'select xt.post($${ \n' +
                                '  "nameSpace":"XM", \n' +
                                '  "type":"UserAccount", \n' +
                                '  "data":{ \n' +
                                '    "username": "' + records.rep.username + '", \n' +
                                '    "properName": "Sales Rep", \n' +
                                '    "useEnhancedAuth": true, \n' +
                                '    "disableExport": true, \n' +
                                '    "isActive": true, \n' +
                                '    "initials": "SR", \n' +
                                '    "email": "rep@example.com", \n' +
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

        records.rep.user = {
          "id": results.id
        };

        done();
      });
    });

    // Grant Rep User privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User privs MaintainPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User privs ViewPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'ViewPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User privs MaintainPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'MaintainPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User extension crm.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.rep.username + "', 'crm');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Rep User extension sales.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.rep.username + "', 'sales');";

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
 * Owner with CRM Account and User Account.
 */
    // Add Owner UserAccount which will also create a CRM Account.
    before(function (done) {
      var username = utils.generateUUID(), // UUID as random Account Number.
        postUserAccountSQL =  'select xt.post($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "data":{ \n' +
                              '    "username": "' + username + '", \n' +
                              '    "properName": "Account Owner", \n' +
                              '    "useEnhancedAuth": true, \n' +
                              '    "disableExport": true, \n' +
                              '    "isActive": true, \n' +
                              '    "initials": "AO", \n' +
                              '    "email": "ownerp@example.com", \n' +
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

        records.owner.user = {
          "id": results.id
        };
        records.owner.account = {
          "id": results.id.toUpperCase()
        };
        records.owner.username = username;

        done();
      });
    });

    // Grant Owner User privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User privs MaintainPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User privs ViewPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'ViewPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User privs MaintainPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'MaintainPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User extension crm.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.owner.username + "', 'crm');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Owner User extension sales.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.owner.username + "', 'sales');";

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
 * Basic Share User with CRM Account, User Account, Customer, Ship To, Contact and Address.
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
        records.share.address = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address UUID.
    before(function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.share.address.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.address.uuid = results.obj_uuid;

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
                            '    "address":"' + records.share.address.id + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.contact = {
          'id': results.id
        };

        done();
      });
    });

    // Get Contact UUID.
    before(function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.share.contact.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.contact.uuid = results.obj_uuid;

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

        records.share.customerDefults = results;

        done();
      });
    });

    // Add Customer which also creates a CRM Account.
    before(function (done) {
      var custNumber = utils.generateUUID(), // UUID as random Customer Number.
        data = _.clone(records.share.customerDefults);

      data.name = 'Share User';
      data.number = custNumber.toUpperCase();
      data.billingContact = records.share.contact.id;
      data.correspondenceContact = records.share.contact.id;

      // Add Ship To.
      data.shiptos = [
        {
        "number":"ship2",
        "name":"ship2",
        "isActive":true,
        "isDefault":false,
        "salesRep":records.rep.salesRep.id,
        "shipZone":null,
        "taxZone":null,
        "shipCharge":"ADDCHARGE",
        "contact":records.share.contact.id,
        "address":records.share.address.id,
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

        records.share.customer = {
          'id': results.id
        };

        done();
      });
    });

    // Get Customer UUID.
    before(function (done) {
      var getCustomerSql =  "select obj_uuid from custinfo where cust_number = '" + records.share.customer.id + "';";

      datasource.query(getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.customer.uuid = results.obj_uuid;

        done();
      });
    });

    // Get Ship To ID and UUID.
    before(function (done) {
      var getShiptoSql =  'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.shiptos[0].uuid);

        records.share.shipto = {
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

        records.share.username = username;
        records.share.user = {
          "id": results.id
        };

        done();
      });
    });

    // Grant user privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

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
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

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
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'ViewPersonalContacts');";

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
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'MaintainPersonalContacts');";

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
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.share.username + "', 'crm');";

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
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.share.username + "', 'sales');";

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
 * Check that all the records just created exist.
 */
    // Rep exists.
    it('Rep CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesRep", \n' +
                          '  "id":"' + records.rep.salesRep.id + '", \n' +
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

    // Rep CRM Account exists.
    it('Rep CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.rep.account.id + '", \n' +
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

    // Owner CRM Account exists.
    it('Owner CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.owner.account.id + '", \n' +
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

    // Address exists.
    it('Address should exist', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address.id + '", \n' +
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
                          '  "id":"' + records.share.contact.id + '", \n' +
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
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Ship To exists.
    it('Ship To should exist', function (done) {
      var getShiptoSql = "select shipto_num from shiptoinfo where obj_uuid = '"  + records.share.shipto.uuid + "';";

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
                          '  "id":"' + records.share.customer.id + '", \n' +
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
                              '  "id":"' + records.share.user.id + '", \n' +
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
      var checkUserAccessSql = "select obj_uuid, username from xt.share_users where username = '"  + records.share.user.id + "';";

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
      var checkUserAccessSql = "select uuid, username from xt.cache_share_users where username = '"  + records.share.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Test access for Rep, Owner and New user without any Share User association.
 */
    // Test access to Addresses for Rep user without any Share User association.
    it('Rep user should not have access to any Addresses', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Test access to Contacts for Rep user without any Share User association.
    it('Rep user should not have access to any Contacts', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Test access to Customers for Rep user without any Share User association.
    it('Rep user should not have access to any Customers', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "username":"' + records.rep.username + '" \n' +
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

    // Test access to Addresses for Owner user without any Share User association.
    it('Owner user should not have access to any Addresses', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to Contacts for Owner user without any Share User association.
    it('Owner user should not have access to any Contacts', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to Customers for Owner user without any Share User association.
    it('Owner user should not have access to any Customers', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to Addresses for new user without any Share User association.
    it('New user should not have access to any Addresses', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
    it('New user should not have access to any Contacts', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
    it('New user should not have access to any Customers', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "username":"' + records.share.username + '" \n' +
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
 * Set Customer Rep which will grant Rep user share user access.
 */
    it('can associate Rep user with new Customer', function (done) {
      var associateUserSql = "update custinfo set \n" +
                             "  cust_salesrep_id = (select salesrep_id from salesrep where salesrep_number = '" + records.rep.salesRep.id + "') \n" +
                             "where cust_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Set CRM Account Owner which will grant Owner user share user access.
 */
    it('can associate Owner user with new CRM Account', function (done) {
      var associateUserSql = "update crmacct set crmacct_owner_username = '" + records.owner.user.id + "' where crmacct_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Set CRM Account user which will grant new user share user access.
 */
    it('can associate new user with new CRM Account', function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = '" + records.share.user.id + "' where crmacct_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Check xt.share_users view for matching UUID-to-username.
 */
    it('xt.share_users view should have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select obj_uuid, username from xt.share_users where username = '"  + records.share.user.id + "';";

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
      var checkUserAccessSql = "select uuid, username from xt.cache_share_users where username = '"  + records.share.user.id + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.notEqual(0, res.length, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Test access for new user with Share User association.
 */
    // Test access to Addresses for Rep user with Share User association.
    it('Rep user should have access to an Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Test access to Contacts for Rep user with Share User association.
    it('Rep user should have access to a Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Test access to Customers for Rep user with Share User association.
    it('Rep user should have access to a Customer', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "username":"' + records.rep.username + '" \n' +
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

    // Test access to Addresses for Owner user with Share User association.
    it('Owner user should have access an Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to Contacts for Owner user with Share User association.
    it('Owner user should have access a Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to Customers for Owner user with Share User association.
    it('Owner user should have access a Customer', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to Addresses for new user with Share User association.
    it('New user should have access an Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                          '  "username":"' + records.share.username + '" \n' +
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
                            '  "username":"' + records.share.username + '" \n' +
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
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        records.share.address2 = {
          'id': results.id
        };

        done();
      });
    });

    // Get the new Address UUID.
    it('Can get the new Address UUID', function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.share.address2.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.address2.uuid = results.obj_uuid;

        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username for new Address.
    it('xt.share_users view should have matching UUID-to-username association for new Address', function (done) {
      var checkUserAccessSql =  "select obj_uuid, username \n" +
                                "from xt.share_users \n" +
                                "where obj_uuid = '"  + records.share.address2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
                                "where uuid = '"  + records.share.address2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
                            '  "id":"' + records.share.address2.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
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
                              '  "id":"' + records.share.address2.id + '", \n' +
                              '  "username":"' + records.share.username + '" \n' +
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
                                "where obj_uuid = '"  + records.share.address2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
                                "where uuid = '"  + records.share.address2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.contact2 = {
          'id': results.id
        };

        done();
      });
    });

    // Get the new Contact UUID.
    it('Can get the new Contact UUID', function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.share.contact2.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.contact2.uuid = results.obj_uuid;

        done();
      });
    });

    // Check xt.share_users view for matching UUID-to-username for new Contact.
    it('xt.share_users view should have matching UUID-to-username association for new Contact', function (done) {
      var checkUserAccessSql =  "select obj_uuid, username \n" +
                                "from xt.share_users \n" +
                                "where obj_uuid = '"  + records.share.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
                                "where uuid = '"  + records.share.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
                            '  "id":"' + records.share.contact2.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
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
                              '  "id":"' + records.share.contact2.id + '", \n' +
                              '  "username":"' + records.share.username + '" \n' +
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
                                "where obj_uuid = '"  + records.share.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
                                "where uuid = '"  + records.share.contact2.uuid + "'  \n" +
                                "  and username = '"  + records.share.username + "';";

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
        records.share.address3 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address3 UUID.
    it('Can get the new Address3 UUID', function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.share.address3.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.address3.uuid = results.obj_uuid;

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
                            '    "address":"' + records.share.address3.id + '", \n' +
                            '    "account":"' + records.share.customer.id + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.contact3 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Contact UUID.
    it('Can get the new Contact3 UUID', function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.share.contact3.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.contact3.uuid = results.obj_uuid;

        done();
      });
    });

    // Test access to new Address for Rep user with Share User association.
    it('Rep user should have access to the new Address3', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.share.address3.id + '", \n' +
                            '  "username":"' + records.rep.username + '" \n' +
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

    // Test access to new Address for Owner user with Share User association.
    it('Owner user should have access to the new Address3', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.share.address3.id + '", \n' +
                            '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to new Address for new user with Share User association.
    it('New user should have access to the new Address3', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.share.address3.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
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

    // Test access to new Contact for Rep user with Share User association.
    it('Rep user should have access to the new Contact3', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.share.contact3.id + '", \n' +
                            '  "username":"' + records.rep.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.contact3.etag = results.etag;

        done();
      });
    });

    // Test access to new Contact for Owner user with Share User association.
    it('Owner user should have access to the new Contact3', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.share.contact3.id + '", \n' +
                            '  "username":"' + records.owner.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.contact3.etag = results.etag;

        done();
      });
    });

    // Test access to new Contact for new user with Share User association.
    it('New user should have access to the new Contact3', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.share.contact3.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.contact3.etag = results.etag;

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
        records.share.address4 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address4 UUID.
    it('Can get the new Address4 UUID', function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.share.address4.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.address4.uuid = results.obj_uuid;

        done();
      });
    });

    // Can change Address association from Contact3
    it('Can change Address association from Contact3', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.share.contact3.id + '", \n' +
                            '  "etag":"' + records.share.contact3.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/address", \n' +
                            '    "value":"' + records.share.address4.id + '" \n' +
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

    // Test access to new Address4 for Rep user with Share User association.
    it('Rep user should have access to the Contact3s new Address4', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.share.address4.id + '", \n' +
                            '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to new Address4 for Owner user with Share User association.
    it('Owner user should have access to the Contact3s new Address4', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.share.address4.id + '", \n' +
                            '  "username":"' + records.owner.username + '" \n' +
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

    // Test access to new Address4 for new user with Share User association.
    it('New user should have access to the Contact3s new Address4', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.share.address4.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
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

    // Test access to Address3 for Rep user without any Share User association.
    it('Rep user should not have access to Contact3s old Address3', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Test access to Address3 for Owner user without any Share User association.
    it('Owner user should not have access to Contact3s old Address3', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });


    // Test access to Address3 for new user without any Share User association.
    it('New user should not have access to Contact3s old Address3', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                            '  "id":"' + records.share.contact3.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.contact3.etag = results.etag;

        done();
      });
    });

    // Remove CRM Account association from Contact.
    it('Can remove CRM Account association from Contact3', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.share.contact3.id + '", \n' +
                            '  "etag":"' + records.share.contact3.etag + '", \n' +
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

    // Test access to Address for Rep user without any Share User association.
    it('Rep user should not have access to Address4', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Test access to Address for Owner user without any Share User association.
    it('Owner user should not have access to Address4', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Test access to Address for new user without any Share User association.
    it('New user should not have access to Address4', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Test access to Contact for Rep user without any Share User association.
    it('Rep user should not have access to Contact3', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Test access to Contact for Owner user without any Share User association.
    it('Owner user should not have access to Contact3', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
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
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
    // Get Customer's latest etag.
    it('Get Customer etag', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer's Billing Contact.
    it('Can change Customers Billing Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/billingContact", \n' +
                            '    "value":"' + records.share.contact3.id + '" \n' +
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

    // Rep user can access new Billing Contact's Address.
    it('Rep user should have access to Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Billing Contact's Address.
    it('Owner user should have access to Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // User can access new Billing Contact's Address.
    it('New user should have access to Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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

    // Rep user can access new Billing Contact.
    it('Rep user should have access to new Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Billing Contact.
    it('Owner user should have access to new Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // User can access new Billing Contact.
    it('New user should have access to new Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer's Billing Contact.
    it('Can change Customers Billing Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/billingContact", \n' +
                            '    "value":"' + records.share.contact.id + '" \n' +
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

    // Rep user cannot access old Billing Contact's Address.
    it('Rep user cannot access old Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access old Billing Contact's Address.
    it('Owner user cannot access old Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access old Billing Contact's Address.
    it('New user cannot access old Billing Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Rep user cannot access old Billing Contact.
    it('Rep User cannot access old Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access old Billing Contact.
    it('Owner User cannot access old Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access old Billing Contact.
    it('New User cannot access old Billing Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer's Correspondence Contact.
    it('Can change Customers Correspondence Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/correspondenceContact", \n' +
                            '    "value":"' + records.share.contact3.id + '" \n' +
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

    // Rep user can access new Correspondence Contact's Address.
    it('Rep user should have access to Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Correspondence Contact's Address.
    it('Owner user should have access to Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // New user can access new Correspondence Contact's Address.
    it('New user should have access to Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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

    // Rep user can access new Correspondence Contact.
    it('Rep user should have access to new Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Correspondence Contact.
    it('Owner user should have access to new Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // New user can access new Correspondence Contact.
    it('New user should have access to new Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer's Correspondence Contact.
    it('Can change Customers Correspondence Contact', function (done) {
      var patchContactSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/correspondenceContact", \n' +
                            '    "value":"' + records.share.contact.id + '" \n' +
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

    // Rep user cannot access old Correspondence Contact's Address.
    it('Rep user cannot access old Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access old Correspondence Contact's Address.
    it('Owner user cannot access old Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access old Correspondence Contact's Address.
    it('New user cannot access old Correspondence Contacts Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Rep user cannot access old Correspondence Contact.
    it('Rep user cannot access old Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access old Correspondence Contact.
    it('Owner user cannot access old Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access old Correspondence Contact.
    it('New user cannot access old Correspondence Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer to add a second Ship To.
    it('Can add a Customer Ship To', function (done) {
      var patchCustomerSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"add", \n' +
                            '    "path":"/shiptos/1", \n' +
                            '    "value":{ \n' +
                            '      "number":"SHIPTO2", \n' +
                            '      "name":"Ship To 2", \n' +
                            '      "isActive":true, \n' +
                            '      "isDefault":false, \n' +
                            '      "salesRep":"' + records.rep.salesRep.id + '", \n' +
                            '      "shipCharge":"ADDCHARGE", \n' +
                            '      "commission":0.075, \n' +
                            '      "shipVia":"UPS-GROUND-UPS Ground", \n' +
                            '      "contact":"' + records.share.contact3.id + '", \n' +
                            '      "address":"' + records.share.address4.id + '" \n' +
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
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.shiptos);
        assert.equal(2, results.data.shiptos.length, JSON.stringify(results.data.shiptos));
        assert.isDefined(results.data.shiptos[1].number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Rep user can access new Ship To's Address.
    it('Rep user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Ship To's Address.
    it('Owner user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // New user can access new Ship To's Address.
    it('New user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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

    // Rep user can access new Ship To's Contact.
    it('Rep user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Ship To's Contact.
    it('Owner user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // New user can access new Ship To's Contact.
    it('New user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
                            '  "patches":[ \n' +
                            '    { \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/contact", \n' +
                            '      "value":"' + records.share.contact.id + '" \n' +
                            '    },{ \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/address", \n' +
                            '      "value":"' + records.share.address.id + '" \n' +
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

    // Rep user cannot access Ship To's old Address.
    it('Rep user cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access Ship To's old Address.
    it('Owner user cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access Ship To's old Address.
    it('New user cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Rep user cannot access Ship To's old Contact.
    it('Rep user cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access Ship To's old Contact.
    it('Owner user cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access Ship To's old Contact.
    it('New user cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer to change second Ship To's Address and Contact.
    it('Can change a Customers Ship To Contact and Address', function (done) {
      var patchCustomerSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
                            '  "patches":[ \n' +
                            '    { \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/contact", \n' +
                            '      "value":"' + records.share.contact3.id + '" \n' +
                            '    },{ \n' +
                            '      "op":"replace", \n' +
                            '      "path":"/shiptos/1/address", \n' +
                            '      "value":"' + records.share.address4.id + '" \n' +
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

    // Rep user can access new Ship To's Address.
    it('Rep user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Ship To's Address.
    it('Owner user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // New user can access new Ship To's Address.
    it('New user should have access to new Ship To Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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

    // Rep user can access new Ship To's Contact.
    it('Rep user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
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

    // Owner user can access new Ship To's Contact.
    it('Owner user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
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

    // New user can access new Ship To's Contact.
    it('New user should have access to new new Ship To Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Patch Customer to change second Ship To's Address and Contact.
    it('Can delete a Customers Ship To', function (done) {
      var patchCustomerSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "etag":"' + records.share.customer.etag + '", \n' +
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

    // Rep user cannot access Ship To's old Address.
    it('Rep user cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access Ship To's old Address.
    it('Owner user cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access Ship To's old Address.
    it('New user cannot access Ship Tos old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Rep user cannot access Ship To's old Contact.
    it('Rep user cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user cannot access Ship To's old Contact.
    it('Owner user cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access Ship To's old Contact.
    it('New user cannot access Ship Tos old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
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
        "customer":records.share.customer.id,
        "terms":"2-10N30",
        "salesRep":records.rep.salesRep.id,
        "taxZone":"VA TAX",
        "billtoContact":records.share.contact.id,
        "shipto":records.share.shipto.uuid,
        "shiptoContact":records.share.contact.id,
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
      // Add Line Items.
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

        records.share.order = {
          'id': results.id
        };

        done();
      });
    });

    // Rep user can get the new Sales Order.
    it('Rep user can get the new Sales Order', function (done) {
      var getSalesOrderSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesOrder", \n' +
                          '  "id":"' + records.share.order.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getSalesOrderSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.order.etag = results.etag;

        done();
      });
    });

    // Owner user can get the new Sales Order.
    it('Owner user can get the new Sales Order', function (done) {
      var getSalesOrderSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesOrder", \n' +
                          '  "id":"' + records.share.order.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getSalesOrderSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.order.etag = results.etag;

        done();
      });
    });

    // New user can get the new Sales Order.
    it('New user can get the new Sales Order', function (done) {
      var getSalesOrderSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesOrder", \n' +
                          '  "id":"' + records.share.order.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getSalesOrderSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.order.etag = results.etag;

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
                            '  "id":"' + records.share.order.id + '", \n' +
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
 * Add an Invoice for Customer. Can access it.
 */
    // Can add an Invoice.
    it('can add an Invoice', function (done) {
      var data = {};

      data = {
        "invoiceDate":"2014-10-07T15:09:29.124Z",
        "isPosted":false,
        "isVoid":false,
        "isPrinted":false,
        "commission":0.075,
        "taxTotal":0.49,
        "miscCharge":0,
        "subtotal":9.8,
        "total":10.29,
        "authorizedCredit":0,
        "orderDate":"2014-10-07T15:09:29.124Z",
        "freight":0,
        "customer":records.share.customer.id,
        "currency":"USD",
        "terms":"2-10N30",
        "salesRep":records.rep.salesRep.id,
        "taxZone":"VA TAX",
        "number":"60117",
        "billtoName":"Tremendous Toys Incorporated",
        "billtoPhone":"703-931-4269",
        "billtoAddress1":"Tremendous Toys Inc.",
        "billtoAddress2":"101 Toys Place",
        "billtoAddress3":"",
        "billtoCity":"Walnut Hills",
        "billtoState":"VA",
        "billtoPostalCode":"22209",
        "billtoCountry":"United States",
        "outstandingCredit":2970,
        "orderNumber":""
      };
      // Add Line Items.
      data.lineItems = [
        {
          "site":"WH1",
          "isMiscellaneous":false,
          "item":"YTRUCK1",
          "taxes":[{"taxType":"Taxable","taxCode":"VATAX-A","uuid":"c76726c1-cfbf-4c6c-d23d-91c3f035c374","amount":0.49}],
          "salesCategory":null,
          "uuid":"508f5d31-0e9a-4470-eb98-33b1b9a8082a",
          "lineNumber":1,
          "taxType":"Taxable",
          "quantityUnit":"EA",
          "priceUnit":"EA",
          "priceUnitRatio":1,
          "extendedPrice":9.8,
          "quantityUnitRatio":1,
          "quantity":1,
          "billed":1,
          "price":9.8,
          "customerPrice":9.8,
          "taxTotal":0.49
        }
      ];

      var postInvoiceSql = 'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Invoice", \n' +
                            '  "data":' + JSON.stringify(data, null, 2) + ', \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postInvoiceSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.invoice = {
          'id': results.id
        };

        done();
      });
    });

    // Rep user can get the new Invoice.
    it('Rep user can get the new Invoice', function (done) {
      var getInvoiceSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Invoice", \n' +
                          '  "id":"' + records.share.invoice.id + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getInvoiceSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.invoice.etag = results.etag;

        done();
      });
    });

    // Owner user can get the new Invoice.
    it('Owner user can get the new Invoice', function (done) {
      var getInvoiceSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Invoice", \n' +
                          '  "id":"' + records.share.invoice.id + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getInvoiceSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.invoice.etag = results.etag;

        done();
      });
    });

    // New user can get the new Invoice.
    it('New user can get the new Invoice', function (done) {
      var getInvoiceSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Invoice", \n' +
                          '  "id":"' + records.share.invoice.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getInvoiceSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.invoice.etag = results.etag;

        done();
      });
    });

/**
 * Delete Invoice. No cache_share_users entry for it.
 */
    // Delete the new Invoice.
    it('Can delete the Invoice', function (done) {
      var deleteInvoiceSql =  'select xt.delete($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Invoice", \n' +
                            '  "id":"' + records.share.invoice.id + '", \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteInvoiceSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Delete CRM Account. Cannot access Contacts or Addresses that were on it.
 */
    // Delete Customer.
    it('Can delete the Customer', function (done) {
      var deleteCustomerSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.share.customer.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteCustomerSql, creds, function (err, res) {
        done();
      });
    });

    // Remove user from CRM Account so it can be deleted.
    it('Can remove CRM Account user', function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Delete CRM Account.
    it('Can delete the CRM Account', function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.share.customer.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // New user cannot access CRM Accounts's old Address.
    it('New user cannot access CRM Accounts old Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address4.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user cannot access CRM Accounts's old Contact.
    it('New user cannot access CRM Accounts old Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact3.id + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Tear down after tests.
 */
    // Delete New User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.share.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.share.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.share.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.share.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.share.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.share.user.id + "'; \n" +
                                  'drop role "' + records.share.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete the Sales Rep.
    after(function (done) {
      var deleteSalesRepSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"SalesRep", \n' +
                              '  "id":"' + records.rep.salesRep.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteSalesRepSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Rep User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.rep.user.id + "'; \n" +
                                  'drop role "' + records.rep.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Owner User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.owner.user.id + "'; \n" +
                                  'drop role "' + records.owner.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Rep CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.rep.account.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Owner CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.owner.account.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete New User CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.share.username.toUpperCase() + '", \n' +
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
                              '  "id":"' + records.share.contact.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact3.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.share.contact3.id + '", \n' +
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
                              '  "id":"' + records.share.address.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Address3.
    after(function (done) {
      var deleteAddreeeSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Address", \n' +
                              '  "id":"' + records.share.address3.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Address4.
    after(function (done) {
      var deleteAddreeeSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Address", \n' +
                              '  "id":"' + records.share.address4.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

  });
}());
