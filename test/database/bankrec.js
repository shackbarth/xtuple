/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _    = require("underscore"),
  assert = require('chai').assert,
  path   = require('path');

(function () {
  "use strict";

  describe('test bank reconciliation functions', function () {

    var loginData = require("../lib/login_data.js").data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../node-datasource/config.js")),
      creds  = _.extend({}, config.databaseServer, {database: loginData.org}),
      bankaccnt,
      bankrec,
      trans1 = { amount: 98.76 },
      trans2 = { amount: 54.32 },
      bankRecItemSql = 'SELECT * FROM bankrecitem '             +
                       ' WHERE bankrecitem_bankrec_id=:brid'    +
                       '   AND bankrecitem_source_id=:srcid'    +
                       '   AND bankrecitem_source=:src;',
      toggleCheckSql = "SELECT toggleBankRecCleared(:bankrec_id,'A/R'"         +
                       ", gltrans_id, checkhead_curr_rate, checkhead_amount)"  +
                       "  AS result"                                           +
                       " FROM checkhead JOIN gltrans ON (gltrans_doctype='CK'" +
                       "                    AND gltrans_misc_id=checkhead_id)" +
                       " WHERE checkhead_id=:checkid;",
      checkCheckSql = "SELECT *,"
                      "       bankrecitem_amount/bankrecitem_curr_rate AS base"+
                      " JOIN bankrecitem ON (gltrans_id=bankrecitem_source_id)"+
                      " JOIN bankrec    ON (bankrecitem_bankrec_id=bankrec_id)"+
                      " WHERE gltrans_doctype='CK'"                            +
                      "   AND gltrans_misc_id=:checkid"                        +
                      "   AND bankrec_id=:bankrec_id;",
      bankAdjCheckSql = "SELECT *,"
                    " ABS(bankadj_amount / bankadj_curr_rate) AS baseamt"      +
                    "  FROM bankadj LEFT OUTER"                                +
                    "  JOIN bankaccnt ON (bankadj_bankaccnt_id=bankaccnt_id)"  +
                    "  LEFT OUTER"                                             +
                    "  JOIN gltrans   ON (bankaccnt_accnt_id=gltrans_accnt_id" +
                    "                 AND gltrans_doctype='AD'"                +
                    "                 AND gltrans_notes ~ bankadj_notes"       +
                    "                 AND gltrans_docnumber=bankadj_docnumber)"+
                    "  LEFT OUTER"                                             +
                    "  JOIN bankrecitem ON (bankrec_source='G/L' "             +
                    "                   AND bankrec_source_id=gltrans_id)"     +
                    " WHERE bankadj_id=:bankadjid;" // TODO: precise enough?
      ;

    it('looks for a bank account with no open reconciliations', function (done) {
      var sql = 'SELECT * FROM bankaccnt WHERE bankaccnt_id IN ('       +
                '   SELECT bankrec_bankaccnt_id FROM bankrec'           +
                '   GROUP BY bankrec_bankaccnt_id'                      +
                '   HAVING BOOL_AND(bankrec_posted)) LIMIT 1;'
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        bankaccnt = _.clone(res.rows[0]);
        assert.isNotNull(bankaccnt, 'we found a bank account');
        done();
      });
    });

    it('creates a new open bankrec to test with', function (done) {
      var sql = 'INSERT INTO bankrec (bankrec_bankaccnt_id,'    +
                '  bankrec_opendate, bankrec_openbal'           +
                ') SELECT bankrec_bankaccnt_id,'                +
                '         bankrec_enddate + 1, bankrec_endbal'  +
                '    FROM bankrec'                              +
                '   WHERE bankrec_bankaccnt_id=' + bankaccnt.bankaccnt_id +
                '     AND bankrec_posted'                       +
                '   ORDER BY bankrec_enddate DESC'              +
                '   LIMIT 1 RETURNING *;'
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        bankrec = _.clone(res.rows[0]);
        assert.isNotNull(bankrec,              'we have a bank rec');
        assert.isFalse(bankrec.bankrec_posted, 'we have an open bank rec');
        done();
      });
    });

    it('creates a check as the 1st transaction to reconcile', function (done) {
      var sql = "SELECT createCheck(" + bankaccnt.bankaccnt_id               +
                "'V', (SELECT MIN(vend_id) FROM vendinfo), '"                +
                bankrec.bankrec_opendate + "' + 1, " + trans1.amount + ", "  +
                bankaccnt.bankaccnt_curr_id + ", NULL, NULL, 'Bearer',"      +
                ", 'bankrec test 1', TRUE, NULL) RETURNING checkid;"
                ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.row[0].checkid > 0);
        trans1.checkid = res.row[0].checkid;
        done();
      });
    });

    it('posts the check', function (done) {
      var sql = 'SELECT postCheck(' + trans1.checkid + ', NULL) AS result;';
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.row[0].result > 0);
        trans1.journalNumber = res.row[0].result;
        done();
      });
    });

    it('marks the check as cleared', function (done) {
      var sql = _.clone(toggleCheckSql)
                 .replace(':bankrec_id', bankrec.bankrec_id)
                 .replace(':checkid',    trans1.checkid);
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].result);
        done();
      });
    });

    it('confirms the check was marked as cleared', function (done) {
      var sql = _.clone(bankRecItemSql)
                 .replace(':brid', bankrec.bankrec_id)
                 .replace(':src', 'A/R')
                 .replace('=:srcid',
                          " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                          " gltrans_doctype='CK' AND gltrans_misc_id=" +
                          trans1.checkid)
                 ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].bankrecitem_cleared);
        assert(res.row[0].bankrecitem_cleared);
        done();
      });
    });

    it('marks the check as /not/ cleared', function (done) {
      var sql = _.clone(toggleCheckSql)
                 .replace(':bankrec_id', bankrec.bankrec_id)
                 .replace(':checkid',    trans1.checkid);
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.row[0].result);
        done();
      });
    });

    it('confirms the check is no longer marked as cleared', function (done) {
      var sql = _.clone(bankRecItemSql)
                 .replace(':brid', bankrec.bankrec_id)
                 .replace(':src', 'A/R')
                 .replace('=:srcid',
                          " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                          " gltrans_doctype='CK' AND gltrans_misc_id=" +
                          trans1.checkid)
                 ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it('marks the check as cleared again', function (done) {
      var sql = _.clone(toggleCheckSql)
                .replace(':bankrec_id', bankrec.bankrec_id)
                .replace(':checkid',    trans1.checkid)
                ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].result);
        done();
      });
    });

    it('confirms that the check is marked as cleared again', function (done) {
      var sql = bankRecItemSql.replace(':brid', bankrec.bankrec_id)
                              .replace(':src', 'A/R')
                              .replace('=:srcid',
                                       " IN (SELECT gltrans_id FROM gltrans" +
                                       " WHERE gltrans_doctype='CK' AND "
                                       " gltrans_misc_id=" + trans1.checkid)
                              ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].bankrecitem_cleared);
        assert(res.row[0].bankrecitem_cleared);
        done();
      });
    });

    it('creates a bank adjustment as a second transaction', function (done) {
      var sql = "INSERT INTO bankadj ("                                      +
                " bankadj_bankaccnt_id, bankadj_bankadjtype_id,"             +
                " bankadj_date, bankadj_docnumber,"                          +
                " bankadj_amount, bankadj_notes, bankadj_curr_id"            +
                ") SELECT " + bankaccnt.bankaccnt_id + ", bankadjtype_id, '" +
                bankrec.bankrec_opendate + "' + 1, 'BankRecTest', "          +
                trans2.amount + ", 'Bank Rec Test Transaction 2', "          +
                bankaccnt.bankaccnt_curr_id                                  +
                "    FROM bankadjtype RETURNING *;"
                ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        _.extend(trans2, res.rows[0]);
        assert.isOk(trans2.bankadj_id, 'we have a bank adjustment');
        done();
      });
    });

    it('posts the reconciliation', function (done) {
      var sql = 'SELECT postBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;'
                ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.row[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the check was reconciled properly', function (done) {
      var sql = _.clone(checkCheckSql)
                 .replace(':checkid', trans1.checkid)
                 .replace(':bankrecid', bankrec.bankrec_id)
                 ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].gltrans_rec);
        assert.isTrue(res.row[0].bankrec_posted);
        done();
      });
    });

    // TODO: confirm the CashBasedTax reconciliation code worked

    it('confirms the bank adjustment was /not/ posted', function (done) {
      sql = _.clone(bankAdjCheckSql).replace(':bankadjid', trans2.bankadj_id);
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.row[0].bankadj_posted);
        assert.notOk(res.row[0].gltrans_id);
        assert.notOk(res.row[0].bankrecitem_id);
        done();
      });
    });

    it('reopens the reconcilation', function (done) {
      var sql = 'SELECT reopenBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;'
                ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.row[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the check was handled properly by the reopen', function (done) {
      var sql = _.clone(checkCheckSql)
                 .replace(':checkid', trans1.checkid)
                 .replace(':bankrecid', bankrec.bankrec_id)
                 ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.row[0].gltrans_rec);
        assert.isFalse(res.row[0].bankrec_posted);
        assert.closeTo(Math.abs(res.row[0].gltrans_amount), res.row[0].base,
                       0.001);
        done();
      });
    });

    // TODO: confirm the CashBasedTax reconciliation code worked

    it('marks the bank adjustment as cleared', function (done) {
      var sql = "SELECT toggleBankRecCleared(" + bankrec.bankrec_id         +
                ", 'G/L', gltrans_id, bankadj_curr_rate,"                   +
                "  bankadj_amount) AS result"                               +
                " FROM bankadj JOIN gltrans"                                +
                " ON (gltrans_doctype='AD' AND gltrans_misc_id=bankadj_id)" +
                " WHERE bankadj_id=" + trans2.bankadj_id + ";"
                ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].result);
        done();
      });
    });

    it('confirms the bank adjustment was /not/ posted but is cleared', function (done) {
      sql = _.clone(bankAdjCheckSql).replace(':bankadjid', trans2.bankadj_id);
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.row[0].bankadj_posted);
        assert(res.row[0].bankrecitem_id >= 0);
        done();
      });
    });

    it('posts the reconciliation again', function (done) {
      var sql = 'SELECT postBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;'
                ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.row[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the check was reconciled properly', function (done) {
      var sql = _.clone(checkCheckSql)
                 .replace(':checkid', trans1.checkid)
                 .replace(':bankrecid', bankrec.bankrec_id)
                 ;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].gltrans_rec);
        assert.isTrue(res.row[0].bankrec_posted);
        done();
      });
    });

    // TODO: confirm the CashBasedTax reconciliation code worked

    it('confirms the bank adjustment was cleared, posted, written to the GL', function (done) {
      sql = _.clone(bankAdjCheckSql).replace(':bankadjid', trans2.bankadj_id);
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.row[0].bankadj_posted);
        assert(res.row[0].bankadj_sequence >= 0);
        assert.isTrue(res.row[0].gltrans_rec);
        assert.closeTo(Math.abs(res.row[0].gltrans_amount), res.row[0].baseamt,
                       0.001);
        done();
      });
    });

    it('deletes the bankrec', function (done) {
      var sql = 'SELECT deleteBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;';
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.row[0].result >= 0);
        done();
      });
    });

    it('checks that the bankrec is really gone', function (done) {
      var sql = 'SELECT COUNT(*) FROM bankrec WHERE bankrec_id = ' +
                bankrec.bankrec_id;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.row[0].result === 0);
        done();
      });
    });

    it('checks that the bankrecitems are gone', function (done) {
      var sql = 'SELECT COUNT(*) FROM bankrecitem'
                ' WHERE bankrecitem_bankrec_id = ' + bankrec.bankrec_id;
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.row[0].result === 0);
        done();
      });
    });

    it('tries to delete a non-existent bankrec', function (done) {
      var sql = 'SELECT deleteBankReconciliation(-15) AS result;';
      datasource.query(sql, cred, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.row[0].result === 0); // no, it doesn't complain
        done();
      });
    });

  });
}());
