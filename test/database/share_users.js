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
          "id": results.id
        };

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
          "id": results.id
        };

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
      var username = utils.generateUUID(), // UUID as random username.
        data = _.clone(records.customerDefults);

      data.name = "Share User";
      data.number = username.toUpperCase();
      data.billingContact = records.contact.id;
      data.correspondenceContact = records.contact.id;

      var postCustomerSql = 'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "data":' + JSON.stringify(data, null, 2) + ', \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postCustomerSql, creds, function (err, res) {
        var results;
console.log(JSON.stringify(err, null, 2));
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.username = username;
        records.customer = {
          "id": results.id
        };

        done();
      });
    });

// TODO: Add Ship To.

    // Add user.
    before(function (done) {
      creds.database = databaseName;

      var
        postUserAccountSQL =  'select xt.post($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "data":{ \n' +
                              '    "username": "' + records.username + '", \n' +
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

      datasource.query(initSql + postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        records.user = {
          "id": results.id
        };

        done();
      });
    });

// TODO: Set CRM Account user.

// Run all Share User Access tests.
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

// TODO: Ship To exists.

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

// Tear down after tests.

// TODO: Detete Ship To.

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
      var deleteAccountSql = 'select xt.delete($${ \n' +
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
