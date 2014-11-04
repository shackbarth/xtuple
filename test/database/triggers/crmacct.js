/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _       = require("underscore"),
    assert  = require("chai").assert,
    path    = require("path");

(function () {
  "use strict";

  describe('crmacct triggers test', function () {

    var loginData  = require(path.join(__dirname, "../../lib/login_data.js")).data,
        datasource = require(path.join(__dirname, "../../../node-datasource/lib/ext/datasource")).dataSource,
        config     = require(path.join(__dirname, "../../../node-datasource/config.js")),
        metasql    = require(path.join(__dirname, "../../lib/metasql.js")),
        creds      = _.extend({}, config.databaseServer, {database: loginData.org}),
        unprivCreds= _.extend({}, config.databaseServer,
                              { database: loginData.org,
                                user:     "crmaccttest",
                                password: "crmaccttest" }),
        crmacctid  = -1;

    it("should create an unprivileged user", function (done) {
      var mql = "do $$ declare _res integer; begin "                    +
                "if not exists(select 1 from pg_user"                   +
                "              where usename=<? value('user') ?>) then" +
                "  _res := createUser(<? value('user') ?>, false);"     +
                "end if; end $$;",
          sql = metasql.toSql(mql, unprivCreds);
      datasource.query(sql, creds, done);       // ignore errors
    });

    it("should set the unprivileged user's password", function (done) {
      var mql = "alter user <? literal('user') ?>" +
                " with password <? value('password') ?>;",
          sql = metasql.toSql(mql, unprivCreds);
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err, 'expect no error changing the user password');
        done();
      });
    });

    it("should add the unprivileged user to xtrole", function (done) {
      var mql = "alter group xtrole add user <? literal('user') ?>;",
          sql = metasql.toSql(mql, unprivCreds);
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err, 'expect no error changing the user password');
        done();
      });
    });

    it("should allow unprivileged to maintain cust", function (done) {
      var mql = "select grantPriv(<? value('user') ?>, 'MaintainCustomerMasters') as c," +
                "       grantPriv(<? value('user') ?>, 'MaintainAllCRMAccounts') as a;",
          sql = metasql.toSql(mql, unprivCreds);
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].c, 'user should get customer priv');
        assert.isTrue(res.rows[0].a, 'user should get crm account priv');
        done();
      });
    });

    it("unprivileged user should create a Customer", function (done) {
      var sql = "insert into api.customer ("            +
                "  customer_number, customer_name"      +
                ") values ("                            +
                "  'TESTY', 'Test CRM Account'"  +
                ");";
      datasource.query(sql, unprivCreds, function (err, res) {
        assert.isNull(err, 'user should be able to create a Customer');
        done();
      });
    });

    it("should verify the crm account exists", function (done) {
      var sql = "select crmacct_id from crmacct where crmacct_number = 'TESTY';";
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1, 'there should be a new CRM Account, too');
        crmacctid = res.rows[0].crmacct_id;
        assert.isTrue(crmacctid >= 0, 'the new CRM Account should have an id');
        done();
      });
    });

    it("unprivileged user should change the crm account name", function (done) {
      var mql = "update crmacct set crmacct_name = crmacct_name || ' Change'" +
                " where crmacct_id = <? value('id') ?> returning crmacct_id;",
          sql = metasql.toSql(mql, { id: crmacctid });
      datasource.query(sql, unprivCreds, function (err, res) {
        assert.equal(res.rowCount, 1, 'one crmaccount should change names');
        done();
      });
    });

    it("should verify the account and customer changed", function (done) {
      var mql = "select crmacct_name, cust_name"                            +
                "  from crmacct join custinfo on crmacct_cust_id = cust_id" +
                " where crmacct_id = <? value('id') ?>;",
          sql = metasql.toSql(mql, { id: crmacctid });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].cust_name, res.rows[0].crmacct_name, 'names should match after the change');
        assert.equal(res.rows[0].cust_name, 'Test CRM Account Change', 'both names should have the new value');
        done();
      });
    });

    it("should create a vendor for this crm account", function (done) {
      var sql = "insert into api.vendor ("                              +
                "  vendor_number, vendor_name, vendor_type"             +
                ") values ("                                            +
                "  'TESTY', 'Test CRM Account Change', 'STANDARD'"      +
                ");";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err, 'expect no error creating the vendor');
        done();
      });
    });

    it("unprivileged user should fail changing the crm account name", function (done) {
      var mql = "update crmacct set crmacct_name = 'Test CRM Account Trigger'" +
                " where crmacct_id = <? value('id') ?> returning crmacct_id;",
          sql = metasql.toSql(mql, { id: crmacctid });
      datasource.query(sql, unprivCreds, function (err, res) {
        assert.isNotNull(err, 'the user should get a Vendor error changing the CRM Account now');
        done();
      });
    });

    it("should grant MaintainVendors to unprivileged user", function (done) {
      var mql = "select grantPriv(<? value('user') ?>, 'MaintainVendors') as v;",
          sql = metasql.toSql(mql, unprivCreds);
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].v, 'the user should now have MaintainVendors');
        done();
      });
    });

    it("unprivileged user should change the crm account name", function (done) {
      var mql = "update crmacct set crmacct_name = 'Test CRM Account Trigger'" +
                " where crmacct_id = <? value('id') ?> returning crmacct_id;",
          sql = metasql.toSql(mql, { id: crmacctid });
      datasource.query(sql, unprivCreds, function (err, res) {
        assert.isNull(err, 'the user should now be able to change the CRM Account');
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].crmacct_id, crmacctid);
        done();
      });
    });

    it("should verify the account, cust, vend all changed", function (done) {
      var mql = "select crmacct_name, cust_name, vend_name"     +
                "  from crmacct"                                +
                "  join custinfo on crmacct_cust_id = cust_id"  +
                "  join vendinfo on crmacct_vend_id = vend_id"  +
                " where crmacct_id = <? value('id') ?>;",
          sql = metasql.toSql(mql, { id: crmacctid });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1, 'the CRM Account should be matched with both Customer and Vendor');
        assert.equal(res.rows[0].crmacct_name, res.rows[0].cust_name, 'the Customer name should match');
        assert.equal(res.rows[0].crmacct_name, res.rows[0].vend_name, 'the Vendor name should match');
        assert.equal(res.rows[0].crmacct_name, 'Test CRM Account Trigger', 'the shared name should be the new one');
        done();
      });
    });

    after(function (done) {
      var mql = [ "delete from vendinfo where vend_number    = 'TESTY';",
                  "delete from custinfo where cust_number    = 'TESTY';",
                  "delete from crmacct  where crmacct_number = 'TESTY';",
                  "select revokePriv(<? value('user') ?>, 'MaintainCustomerMasters')," +
                  "       revokePriv(<? value('user') ?>, 'MaintainAllCRMAccounts'),"  +
                  "       revokePriv(<? value('user') ?>, 'MaintainVendors');",
                  "delete from xt.usrlite where usr_username = <? value('user') ?>;",
                  "drop user <? literal('user') ?>;",
                ];
      datasource.query(metasql.toSql(mql.join(""), unprivCreds),
                       creds, done); // TODO: loop?
    });

  });
}());

