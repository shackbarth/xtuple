/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, after: true, describe:true, it:true, require:true, __dirname:true, before:true, console:true */

var _      = require("underscore"),
    assert = require("chai").assert,
    path   = require("path");

(function () {
  "use strict";

  describe("usrpriv trigger test", function () {
    var loginData  = require("../../lib/login_data.js").data,
        datasource = require("../../../node-datasource/lib/ext/datasource").dataSource,
        config     = require(path.join(__dirname, "../../../node-datasource/config.js")),
        adminCred  = _.extend({}, config.databaseServer, {database: loginData.org}),
        otherCred  = _.extend({}, config.databaseServer,
                              { database: loginData.org,
                                user:     "manager",
                                password: "manager"
                              }),
        groupid    = -1,
        addPrivSql = "insert into usrpriv (" +
                     "  usrpriv_priv_id, usrpriv_username"   +
                     ") select priv_id, $1" +
                     "    from priv where priv_name = $2;"
    ;

    it("should create a group", function (done) {
      var sql = "insert into grp (grp_name, grp_descrip" +
                ") values ('manager', 'managers') returning grp_id;";
      datasource.query(sql, adminCred, function (err, res) {
        assert.equal(res.rowCount, 1, "expected one group to be created");
        groupid = res.rows[0].grp_id;
        assert.isTrue(groupid >= 0, "expected a real group id");
        done();
      });
    });

    it("should allow group members to maintain privileges", function (done) {
      var sql = "select grantprivgroup($1, priv_id) as ok" +
                "  from priv where priv_name = 'MaintainUsers';",
          admin = _.extend({}, adminCred, { parameters: [ groupid ]});
      datasource.query(sql, admin, function (err, res) {
        assert.equal(res.rowCount, 1, "expected one priv to be granted");
        assert.isTrue(res.rows[0].ok, "expected successful priv granting");
        done();
      });
    });

    it("should create an unprivileged user", function (done) {
      var sql = "select createUser($1, false);",
          admin = _.extend({}, adminCred, { parameters: [ otherCred.user ] });
      datasource.query(sql, admin, done);       // ignore errors
    });

    it("should set the unprivileged user's password", function (done) {
      var sql = "alter user "      + otherCred.user +
                " with password '" + otherCred.password + "';";
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err, "expect no error changing the user password");
        done();
      });
    });

    it("should add the unprivileged user to xtrole", function (done) {
      var sql = "alter group xtrole add user " + otherCred.user + ";";
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err, "expect no error changing the user password");
        done();
      });
    });

    it("should prevent the unprivileged user from granting privs", function (done) {
      var other = _.extend({}, otherCred,
                           { parameters: [ otherCred.user, 'CanApprove' ] });
      datasource.query(addPrivSql, other, function (err, res) {
        assert.isNotNull(err, "expect an error adding a privilege");
        assert.isTrue(String(err).indexOf("modify") > 0);
        done();
      });
    });

    it("should grant the unprivileged user direct priv", function (done) {
      var sql = "select grantPriv($1, 'MaintainUsers') as ok;",
          admin = _.extend({}, adminCred, { parameters: [ otherCred.user ] });
      datasource.query(sql, admin, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].ok, "user should get the priv");
        done();
      });
    });

    it("should allow the unprivileged user to grant privs", function (done) {
      var other = _.extend({}, otherCred,
                           { parameters: [ otherCred.user, 'CanApprove' ] });
      datasource.query(addPrivSql, other, function (err, res) {
        assert.isNull(err, "expect no error adding a privilege");
        done();
      });
    });

    it("should revoke the unprivileged user direct priv", function (done) {
      var sql = "select revokePriv($1, 'MaintainUsers') as ok;",
          admin = _.extend({}, adminCred, { parameters: [ otherCred.user ] });
      datasource.query(sql, admin, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].ok, "the priv should be revoked");
        done();
      });
    });

    it("should prevent the unprivileged user from granting privs", function (done) {
      var other = _.extend({}, otherCred,
                           { parameters: [ otherCred.user, 'CanApprove' ] });
      datasource.query(addPrivSql, other, function (err, res) {
        assert.isNotNull(err, "expect an error adding a privilege");
        assert.isTrue(String(err).indexOf("modify") > 0);
        done();
      });
    });

    it("should grant the unprivileged user _indirect_ priv", function (done) {
      var sql = "select grantGroup($1, $2) as ok;",
          admin = _.extend({}, adminCred,
                           { parameters: [ otherCred.user, groupid ] });
      datasource.query(sql, admin, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].ok, "user should join the group");
        done();
      });
    });

    it("should allow the unprivileged user to grant privs", function (done) {
      var other = _.extend({}, otherCred,
                           { parameters: [ otherCred.user, 'CanApprove' ] });
      datasource.query(addPrivSql, other, function (err, res) {
        assert.isNull(err, "expect no error adding a privilege");
        done();
      });
    });

    it("should prevent granting an invalid priv", function (done) {
      var sql = "insert into usrpriv(usrpriv_priv_id, usrpriv_username" +
                ") values (-256, $1);",
          admin = _.extend({}, adminCred, { parameters: [ otherCred.user ] });
      datasource.query(sql, admin, function (err, res) {
        assert.isNotNull(err, "expect no error adding a privilege");
        assert.isTrue(String(err).indexOf("exist") > 0);
        done();
      });
    });

    after(function (done) {
      var sql = "select revokeGroup($1, $2);",
          admin = _.extend({}, adminCred,
                           { parameters: [ otherCred.user, groupid ] });
      datasource.query(sql, admin, done);
    });

    after(function (done) {
      var sql = "select revokePrivGroup($1, priv_id)" +
		"  from priv where priv_name = 'MaintainUsers';",
          admin = _.extend({}, adminCred, { parameters: [ groupid ] });
      datasource.query(sql, admin, done);
    });

    after(function (done) {
      var sql = "delete from grp where grp_id = $1;",
          admin = _.extend({}, adminCred, { parameters: [ groupid ] });
      datasource.query(sql, admin, done);
    });

    after(function (done) {
      var sql = "delete from usrpriv where usrpriv_username = $1;",
          admin = _.extend({}, adminCred, { parameters: [ otherCred.user ] });
      datasource.query(sql, admin, done);
    });

    after(function (done) {
      var sql = "delete from xt.usrlite where usr_username = $1;",
          admin = _.extend({}, adminCred, { parameters: [ otherCred.user ] });
      datasource.query(sql, admin, done);
    });

    after(function (done) {
      var sql = "drop user " + otherCred.user + ";";
      datasource.query(sql, adminCred, done);
    });

  });
})();
