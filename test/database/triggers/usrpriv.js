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
        metasql    = require(path.join(__dirname, "../../lib/metasql.js")),
        adminCred  = _.extend({}, config.databaseServer, {database: loginData.org}),
        otherCred  = _.extend({}, config.databaseServer,
                              { database: loginData.org,
                                user:     "manager",
                                password: "manager"
                              }),
        groupid    = -1,
        addPrivMql = "insert into usrpriv (" +
                        "  usrpriv_priv_id, usrpriv_username"   +
                        ") select priv_id, <? value('user') ?>" +
                        "    from priv where priv_name = <? value('priv') ?>;"
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
      var mql = "select grantprivgroup(<? value('grpid') ?>, priv_id) as ok" +
                "  from priv where priv_name = 'MaintainUsers';",
          sql = metasql.toSql(mql, { grpid: groupid });
      datasource.query(sql, adminCred, function (err, res) {
        assert.equal(res.rowCount, 1, "expected one priv to be granted");
        assert.isTrue(res.rows[0].ok, "expected successful priv granting");
        done();
      });
    });

    it("should create an unprivileged user", function (done) {
      var mql = "do $$ declare _res integer; begin "                    +
                "if not exists(select 1 from pg_user"                   +
                "              where usename=<? value('user') ?>) then" +
                "  _res := createUser(<? value('user') ?>, false);"     +
                "end if; end $$;",
          sql = metasql.toSql(mql, otherCred);
      datasource.query(sql, adminCred, done);       // ignore errors
    });

    it("should set the unprivileged user's password", function (done) {
      var mql = "alter user <? literal('user') ?>" +
                " with password <? value('password') ?>;",
          sql = metasql.toSql(mql, otherCred);
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err, "expect no error changing the user password");
        done();
      });
    });

    it("should add the unprivileged user to xtrole", function (done) {
      var mql = "alter group xtrole add user <? literal('user') ?>;",
          sql = metasql.toSql(mql, otherCred);
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err, "expect no error changing the user password");
        done();
      });
    });

    it("should prevent the unprivileged user from granting privs", function (done) {
      var sql = metasql.toSql(addPrivMql,
                              { user: otherCred.user, priv: 'CanApprove' });
      datasource.query(sql, otherCred, function (err, res) {
        assert.isNotNull(err, "expect an error adding a privilege");
        assert.isTrue(String(err).indexOf("modify") > 0);
        done();
      });
    });

    it("should grant the unprivileged user direct priv", function (done) {
      var mql = "select grantPriv(<? value('user') ?>, 'MaintainUsers') as ok;",
          sql = metasql.toSql(mql, otherCred);
      datasource.query(sql, adminCred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].ok, "user should get the priv");
        done();
      });
    });

    it("should allow the unprivileged user to grant privs", function (done) {
      var sql = metasql.toSql(addPrivMql,
                              { user: otherCred.user, priv: 'CanApprove' });
      datasource.query(sql, otherCred, function (err, res) {
        assert.isNull(err, "expect no error adding a privilege");
        done();
      });
    });

    it("should revoke the unprivileged user direct priv", function (done) {
      var mql = "select revokePriv(<? value('user') ?>, 'MaintainUsers') as ok;",
          sql = metasql.toSql(mql, otherCred);
      datasource.query(sql, adminCred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].ok, "the priv should be revoked");
        done();
      });
    });

    it("should prevent the unprivileged user from granting privs", function (done) {
      var sql = metasql.toSql(addPrivMql,
                              { user: otherCred.user, priv: 'CanApprove' });
      datasource.query(sql, otherCred, function (err, res) {
        assert.isNotNull(err, "expect an error adding a privilege");
        assert.isTrue(String(err).indexOf("modify") > 0);
        done();
      });
    });

    it("should grant the unprivileged user _indirect_ priv", function (done) {
      var mql = "select grantGroup(<? value('user') ?>, <? value('grpid') ?>) as ok;",
          sql = metasql.toSql(mql, { user: otherCred.user, grpid: groupid });
      datasource.query(sql, adminCred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].ok, "user should join the group");
        done();
      });
    });

    it("should allow the unprivileged user to grant privs", function (done) {
      var sql = metasql.toSql(addPrivMql,
                              { user: otherCred.user, priv: 'CanApprove' });
      datasource.query(sql, otherCred, function (err, res) {
        assert.isNull(err, "expect no error adding a privilege");
        done();
      });
    });

    it("should prevent granting an invalid priv", function (done) {
      var mql = "insert into usrpriv(usrpriv_priv_id, usrpriv_username" +
                ") values (-256, <? value('user') ?>);",
          sql = metasql.toSql(mql, otherCred);
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNotNull(err, "expect no error adding a privilege");
        assert.isTrue(String(err).indexOf("exist") > 0);
        done();
      });
    });

    after(function (done) {
      var mql = [ "select revokeGroup(<? value('user') ?>, <? value('grpid') ?>);",
		  "select revokePrivGroup(<? value('grpid') ?>, priv_id)" +
		  "  from priv where priv_name = 'MaintainUsers';",
                  "delete from grp        where grp_id = <? value('grpid') ?>;",
                  "delete from xt.usrlite where usr_username = <? value('user') ?>;",
                  "drop user <? literal('user') ?>;"
                ];
      datasource.query(metasql.toSql(mql.join(""),
                                     { user: otherCred.user, grpid: groupid }),
                       adminCred, done); // TODO: loop?
    });

  });
})();
