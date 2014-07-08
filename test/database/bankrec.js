/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

/* note: much of this test consists of set up for testing tax handling */

// TODO: add cash receipt
// TODO: add use of sltrans as well as gltrans
var _    = require("underscore"),
  assert = require('chai').assert,
  path   = require('path');

(function () {
  "use strict";

  // TODO: implement a real metasql parser; this one is stupid and minimal
  var mqlToSql = function (query, params) {
    var result = _.clone(query);
    _.each(params, function (value, key) {
      var valueRE = new RegExp("<\\? *value\\(['\"]"   + key + "['\"]\\) *\\?>", "g"),
        literalRE = new RegExp("<\\? *literal\\(['\"]" + key + "['\"]\\) *\\?>", "g");
      result = result.replace(valueRE,   "'" + value + "'");
      result = result.replace(literalRE, value);
    });
    return result;
  };

  describe('test bank reconciliation functions', function () {

    var loginData = require("../lib/login_data.js").data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../node-datasource/config.js")),
      creds  = _.extend({}, config.databaseServer, {database: loginData.org}),
      bankaccnt,
      bankrec,
      po,
      poitem,
      recvid,
      voucher,
      voJournal,
      wasCashBasedTax,
      trans1 = { amount: 98.76 },       // Note: amounts for the two must differ
      trans2 = { amount: 54.32 },
      bankRecItemSql = 'SELECT * FROM bankrecitem '             +
                       ' WHERE bankrecitem_bankrec_id=<? value("brid") ?>'   +
                       '   AND bankrecitem_source=<? value("src") ?>'        +
                       '   AND bankrecitem_source_id <? literal("srcid") ?>;',
      toggleCheckSql = "SELECT toggleBankRecCleared(<? value('bankrecid') ?>,'GL'," +
                       "  gltrans_id, checkhead_curr_rate, checkhead_amount)"  +
                       "  AS result"                                           +
                       " FROM checkhead JOIN gltrans ON (gltrans_doctype='CK'" +
                       "                    AND gltrans_misc_id=checkhead_id)" +
                       " WHERE checkhead_id=<? value('checkid') ?> AND gltrans_amount > 0;",
      checkCheckSql = "SELECT *,"                                              +
                     "       bankrecitem_amount/bankrecitem_curr_rate AS base" +
                     " FROM gltrans"                                           +
                     " JOIN bankrecitem ON (gltrans_id=bankrecitem_source_id)" +
                     " JOIN bankrec    ON (bankrecitem_bankrec_id=bankrec_id)" +
                     " WHERE gltrans_doctype='CK'"                             +
                     "   AND gltrans_misc_id=<? value('checkid') ?>"                        +
                     "   AND bankrec_id=<? value('bankrecid') ?>;",
      bankAdjCheckSql = "SELECT *,"                                           +
                  " ROUND(bankadj_amount / bankadj_curr_rate, 2) AS baseamt," +
                  " CASE WHEN gltrans_id IS NULL AND bankrecitem_id IS NULL"  +
                  "      THEN 0"                                              +
                  "      WHEN gltrans_id IS NULL OR bankrecitem_id IS NULL"   +
                  "      THEN 1"                                              +
                  "      ELSE 2 END AS preferred"                             +
                  "  FROM bankadj LEFT OUTER"                                 +
                  "  JOIN gltrans   ON (gltrans_doctype='AD'"                 +
                  "                 AND gltrans_misc_id=bankadj_id)"          +
                  "  LEFT OUTER"                                              +
                  "  JOIN bankrecitem ON (bankrecitem_source='AD'"            +
                  "                   AND bankrecitem_source_id=bankadj_id)"  +
                  "                   OR (bankrecitem_source='GL'"            +
                  "                   AND bankrecitem_source_id=gltrans_id)"  +
                  " WHERE bankadj_id=<? value('bankadjid') ?>"                +
                  " ORDER BY preferred DESC LIMIT 1;"
    ;

    it('looks for a bank account to work with', function (done) {
      var sql = 'SELECT * FROM bankaccnt WHERE bankaccnt_id IN ('       +
                '   SELECT bankrec_bankaccnt_id FROM bankrec'           +
                '   GROUP BY bankrec_bankaccnt_id'                      +
                '   HAVING BOOL_AND(bankrec_posted)) LIMIT 1;'
                ;
      datasource.query(sql, creds, function (err, res) {
        if (res.rowCount === 1) {
          bankaccnt = _.clone(res.rows[0]);
          assert.isNotNull(bankaccnt, 'we found a bank account');
          bankrec = "create";
          done();
        } else {
          var sql = 'SELECT * FROM bankaccnt WHERE bankaccnt_id IN ('       +
                    '   SELECT bankrec_bankaccnt_id FROM bankrec'           +
                    '    WHERE bankrec_opendate IN'                         +
                    '      (SELECT MAX(bankrec_opendate) FROM bankrec'      +
                    '        WHERE NOT bankrec_posted)'                     +
                    ') LIMIT 1;'
                    ;
          datasource.query(sql, creds, function (err, res) {
            assert.equal(res.rowCount, 1);
            bankaccnt = _.clone(res.rows[0]);
            assert.isNotNull(bankaccnt, 'we found a bank account');
            bankrec = "select";
            done();
          });
        }
      });
    });

    it('gets an open bankrec to test with', function (done) {
      var sql;
      if (bankrec === "create") {
        sql = 'INSERT INTO bankrec (bankrec_bankaccnt_id,'    +
              '  bankrec_opendate, bankrec_openbal'           +
              ') SELECT bankrec_bankaccnt_id,'                +
              '         bankrec_enddate + 1, bankrec_endbal'  +
              '    FROM bankrec'                              +
              '   WHERE bankrec_bankaccnt_id=' + bankaccnt.bankaccnt_id +
              '     AND bankrec_posted'                       +
              '   ORDER BY bankrec_enddate DESC'              +
              '   LIMIT 1 RETURNING *;'
              ;
      } else if (bankrec === "select") {
        sql = 'SELECT * FROM bankrec'                                    +
              ' WHERE bankrec_bankaccnt_id=' + bankaccnt.bankaccnt_id    +
              '   AND bankrec_opendate IN'                               +
              '  (SELECT MAX(bankrec_opendate) FROM bankrec'             +
              '    WHERE NOT bankrec_posted'                             +
              '      AND bankrec_bankaccnt_id=' + bankaccnt.bankaccnt_id +
              '  );'
              ;
      }

      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        bankrec = _.clone(res.rows[0]);
        assert.isNotNull(bankrec,              'we have a bank rec');
        assert.isFalse(bankrec.bankrec_posted, 'we have an open bank rec');
        done();
      });
    });

    it('ensures there is an open accounting period', function (done) {
      var sql = 'SELECT period_id, period_closed, period_freeze'        +
                '  FROM period'                                         +
                ' WHERE CURRENT_DATE BETWEEN period_start AND period_end;'
                ;
      datasource.query(sql, creds, function (err, res) {
        var sql;
        if (res.rowCount !== 1) {
          sql = "INSERT INTO period (period_closed, period_freeze,"     +
                "  period_name, period_quarter, period_start,"          +
                "  period_end, period_number"                           +
                ") VALUES (FALSE, FALSE, 'BankRec Test Period',"        +
                "  EXTRACT(QUARTER FROM DATE CURRENT_DATE),"            +
                "  DATE_TRUNC(MONTH, CURRENT_DATE),"                    +
                "  DATE_TRUNC(MONTH, CURRENT_DATE) + '1 month',"        +
                "  EXTRACT(month FROM DATE CURRENT_DATE)"               +
                ") RETURNING period_id;"
                ;
        } else if (res.rows[0].period_closed === true) {
          sql = 'SELECT openAccountingPeriod(' + res.rows[0].period_id +
                ') AS period_id;'
                ;
        }
        if (sql) {
          datasource.query(sql, creds, function (err, res) {
            assert.equal(res.rowCount, 1);
            assert(res.period_id >= 0);
            done();
          });
        } else {
          done();
        }
      });
    });

    it('turns on cash-based tax handling if necessary', function (done) {
      var sql = "SELECT fetchMetricBool('CashBasedTax') AS result;";
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        wasCashBasedTax = res.rows[0].result === 't';
        if (wasCashBasedTax) {
          done();
        } else {
          var sql = "SELECT setMetric('CashBasedTax', 't') AS result;";
          datasource.query(sql, creds, function (err, res) {
            assert.equal(res.rowCount, 1);
            done();
          });
        }
      });
    });

    it('creates a purchase order', function (done) {
      var sql = mqlToSql("INSERT INTO pohead (pohead_number, pohead_status,"   +
                         "  pohead_agent_username, pohead_vend_id,"            +
                         "  pohead_taxzone_id, pohead_orderdate,"              +
                         "  pohead_curr_id, pohead_saved, pohead_comments,"    +
                         "  pohead_warehous_id,"                               +
                         "  pohead_printed, pohead_terms_id,pohead_taxtype_id" +
                         ") SELECT fetchPoNumber(), 'U',"                      +
                         "    CURRENT_USER, vend_id,"                          +
                         "    vend_taxzone_id, CURRENT_DATE,"                  +
                         "    vend_curr_id, false, 'Bank Rec Test',"           +
                         "    (SELECT MIN(warehous_id) FROM whsinfo WHERE "    +
                         "     warehous_active AND NOT warehous_transit),"     +
                         "    false, vend_terms_id, taxass_taxtype_id"         +
                         "   FROM vendinfo"                                    +
                         "   JOIN taxass ON vend_taxzone_id=taxass_taxzone_id" +
                         "   JOIN taxrate ON taxass_tax_id=taxrate_tax_id"     +
                         "  WHERE vend_active"                                 +
                         "    AND (taxrate_percent > 0 OR taxrate_amount > 0)" +
                         " LIMIT 1 RETURNING *;",
                         {  });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        po = res.rows[0];
        done();
      });
    });

    it('creates a purchase order item', function (done) {
      var sql = mqlToSql("INSERT INTO poitem (poitem_pohead_id,"               +
                         "  poitem_linenumber, poitem_status,"                 +
                         "  poitem_taxtype_id, poitem_itemsite_id,"            +
                         "  poitem_itemsrc_id, poitem_qty_ordered,"            +
                         "  poitem_unitprice,"                                 +
                         "  poitem_duedate, poitem_comments"                   +
                         ") SELECT pohead_id, 1, 'O',"                         +
                         "    pohead_taxtype_id, itemsite_id,"                 +
                         "    itemsrc_id, 100,"                                +
                         "    itemsrcprice(itemsrc_id, itemsite_warehous_id,"  +
                         "          false, 100, pohead_curr_id,CURRENT_DATE)," +
                         "    now() + '5 days', 'bankrec test'"                +
                         "  FROM pohead"                                       +
                         "  JOIN itemsrc  ON pohead_vend_id=itemsrc_vend_id"   +
                         "  JOIN itemsite ON itemsrc_item_id=itemsite_item_id" +
                         "  WHERE itemsite_active AND itemsrc_active"          +
                         "    AND pohead_id=<? value('poheadid') ?>"           +
                         " LIMIT 1 RETURNING *;", { poheadid: po.pohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        poitem = res.rows[0];
        done();
      });
    });

    it('calculates purchase order amounts', function (done) {
      var sql = mqlToSql("SELECT" +
                         "   SUM(poitem_qty_ordered*poitem_unitprice) AS amt," +
                         "   SUM(poitem_freight) + pohead_freight AS freight," +
                         "   (SELECT SUM(tax) FROM"                            +
                         "      (SELECT ROUND(SUM(taxdetail_tax), 2) AS tax"   +
                         "         FROM tax JOIN"                              +
                         "      calculateTaxDetailSummary('PO',pohead_id,'T')" +
                         "              ON (tax_id=taxdetail_tax_id)"          +
                         "      GROUP BY tax_id) AS taxdata"                   +
                         "   ) AS tax"                                         +
                         "  FROM poitem"                                       +
                         "  JOIN pohead ON poitem_pohead_id=pohead_id"         +
                         " WHERE pohead_id=<? value('pohead_id') ?>"           +
                         " GROUP BY pohead_id, pohead_freight;",
                         { pohead_id: po.pohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        po.amount  = res.rows[0].amt;
        po.freight = res.rows[0].freight;
        po.tax     = res.rows[0].tax;
        done();
      });
    });

    it('release the purchase order', function (done) {
      var sql = mqlToSql("SELECT releasePurchaseOrder(<? value('id') ?>)" +
                         " AS result;", { id: po.pohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0);
        done();
      });
    });

    it('receives the purchase order', function (done) {
      var sql = mqlToSql("SELECT enterReceipt('PO', poitem_id, 100, 0, ''," +
                         "   pohead_curr_id, CURRENT_DATE, NULL) AS result" +
                         "  FROM poitem"                                    +
                         "  JOIN pohead ON poitem_pohead_id=pohead_id"      +
                         " WHERE poitem_id=<? value('poitem_id') ?>;",
                         { poitem_id: poitem.poitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        recvid = res.rows[0].result;
        done();
      });
    });

    it('posts the receipt', function (done) {
      var sql = mqlToSql("SELECT postReceipt(<? value('recvid') ?>, NULL)" +
                         " AS result;", { recvid: recvid });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0);
        done();
      });
    });

    it('creates a voucher', function (done) {
      var sql = mqlToSql("INSERT INTO vohead (vohead_number, vohead_posted,"   +
                         "  vohead_pohead_id, vohead_taxzone_id,"              +
                         "  vohead_vend_id,   vohead_terms_id,"                +
                         "  vohead_distdate,  vohead_docdate, vohead_duedate," +
                         "  vohead_invcnumber, vohead_reference, vohead_1099," +
                         "  vohead_amount,     vohead_curr_id,   vohead_notes" +
                         ") SELECT fetchVoNumber(), false,"                    +
                         "    pohead_id, pohead_taxzone_id,"                   +
                         "    pohead_vend_id, pohead_terms_id,"                +
                         "    CURRENT_DATE, CURRENT_DATE, now() + '30 days',"  +
                         "    'Vend Invoice', 'bankrec test', false,"          +
                         "    <? value('pototal') ?>,"                         +
                         "    pohead_curr_id, 'bankrec test'"                  +
                         "    FROM pohead"                                     +
                         "   WHERE pohead_id=<? value('poheadid') ?>"          +
                         " RETURNING *;",
                         { poheadid: po.pohead_id,
                           pototal: po.amount + po.freight + po.tax });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        voucher = res.rows[0];
        done();
      });
    });

    it('distributes the p/o item to the voucher', function (done) {
      var sql = mqlToSql("SELECT distributeVoucherLine("                    +
                         "<? value('voheadid') ?>,<? value('poitemid') ?>," +
                         "<? value('currid') ?>) AS result;",
                         { voheadid: voucher.vohead_id,
                           poitemid: poitem.poitem_id,
                           currid:   voucher.vohead_curr_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1);
        done();
      });
    });

    it('posts the voucher', function (done) {
      var sql = mqlToSql("SELECT postVoucher(<? value('id') ?>, TRUE)" +
                         " AS result;", { id: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        voJournal = res.rows[0].result;
        assert(voJournal > 0);
        done();
      });
    });

    it('creates a check as the 1st transaction to reconcile', function (done) {
      var sql = mqlToSql("SELECT createCheck(<? value('bankaccntid') ?>, 'V'," +
                         "   vohead_vend_id, CURRENT_DATE, vohead_amount,"     +
                         "   vohead_curr_id, NULL, NULL, 'Bearer',"            +
                         "   'bankrec test 1', TRUE, apopen_id) AS checkid"    +
                         "  FROM vohead"                                       +
                         "  JOIN apopen ON vohead_number=apopen_docnumber"     +
                         "             AND apopen_doctype='V'"                 +
                         " WHERE apopen_journalnumber=<? value('journal') ?>;",
                         { bankaccntid: bankaccnt.bankaccnt_id,
                           journal:     voJournal });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].checkid > 0);
        trans1.checkid = res.rows[0].checkid;
        done();
      });
    });

    it('posts the check', function (done) {
      var sql = 'SELECT postCheck(' + trans1.checkid + ', NULL) AS result;';
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0);
        trans1.journalNumber = res.rows[0].result;
        done();
      });
    });

    it('marks the check as cleared', function (done) {
      var sql = mqlToSql(toggleCheckSql, { bankrecid: bankrec.bankrec_id,
                                           checkid:   trans1.checkid });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms the check was marked as cleared', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'GL',
          srcid: " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                 " gltrans_doctype='CK' AND gltrans_misc_id=" +
                 trans1.checkid + ")"});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankrecitem_cleared);
        assert(res.rows[0].bankrecitem_cleared);
        done();
      });
    });

    it('marks the check as /not/ cleared', function (done) {
      var sql = mqlToSql(toggleCheckSql, { bankrecid: bankrec.bankrec_id,
                                           checkid:   trans1.checkid });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].result);
        done();
      });
    });

    it('confirms the check is no longer marked as cleared', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'GL',
          srcid: " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                 " gltrans_doctype='CK' AND gltrans_misc_id=" +
                 trans1.checkid + ")" });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it('marks the check as cleared again', function (done) {
      var sql = mqlToSql(toggleCheckSql, { bankrecid: bankrec.bankrec_id,
                                           checkid:   trans1.checkid });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms that the check is marked as cleared again', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'GL',
          srcid: " IN (SELECT gltrans_id FROM gltrans" +
                 " WHERE gltrans_doctype='CK' AND "    +
                 " gltrans_misc_id=" + trans1.checkid + ")"});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankrecitem_cleared);
        assert(res.rows[0].bankrecitem_cleared);
        done();
      });
    });

    it('creates a bank adjustment as a second transaction', function (done) {
      var sql = "INSERT INTO bankadj ("                                      +
                " bankadj_bankaccnt_id, bankadj_bankadjtype_id,"             +
                " bankadj_date, bankadj_docnumber,"                          +
                " bankadj_amount, bankadj_notes, bankadj_curr_id,"           +
                " bankadj_curr_rate"                                         +
                ") SELECT " + bankaccnt.bankaccnt_id + ", bankadjtype_id, "  +
                "    CURRENT_DATE, 'BankRecTest', " + trans2.amount          +
                ", 'Bank Rec Test Transaction 2', "                          +
                bankaccnt.bankaccnt_curr_id + ", "                           +
                " currrate(" + bankaccnt.bankaccnt_curr_id                   +
                ", basecurrid(), CURRENT_DATE) FROM bankadjtype RETURNING *;"
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        _.extend(trans2, res.rows[0]);
        assert.ok(trans2.bankadj_id, 'we have a bank adjustment');
        done();
      });
    });

    it('posts the reconciliation', function (done) {
      var sql = 'SELECT postBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;'
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the check was reconciled properly', function (done) {
      var sql = mqlToSql(checkCheckSql, { checkid:  trans1.checkid,
                                          bankrecid: bankrec.bankrec_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].gltrans_rec);
        assert.isTrue(res.rows[0].bankrec_posted);
        done();
      });
    });

    // TODO: confirm the CashBasedTax reconciliation code worked

    it('confirms the bank adjustment was /not/ posted', function (done) {
      var sql = mqlToSql(bankAdjCheckSql, { bankadjid: trans2.bankadj_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].bankadj_posted);
        /* TODO: why does assert.notOk throw
            Unrecoverable exception. Object function (express, errmsg) {
              var test = new Assertion(null);
              test.assert(
                  express
                , errmsg
                , '[ negation message unavailable ]'
              );
            } has no method 'notOk'
        assert.notOk(res.rows[0].gltrans_id,     'expecting no gltrans');
        assert.notOk(res.rows[0].bankrecitem_id, 'expecting no bankrecitem');
        */
        assert(! res.rows[0].gltrans_id,     'expecting no gltrans');
        assert(! res.rows[0].bankrecitem_id, 'expecting no bankrecitem');
        done();
      });
    });

    it('reopens the reconcilation', function (done) {
      var sql = 'SELECT reopenBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;'
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the check was handled properly by the reopen', function (done) {
      var sql = mqlToSql(checkCheckSql, { checkid:   trans1.checkid,
                                          bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].gltrans_rec);
        assert.isFalse(res.rows[0].bankrec_posted);
        assert.closeTo(Math.abs(res.rows[0].gltrans_amount), res.rows[0].base,
                       0.006);
        done();
      });
    });

    // TODO: confirm the CashBasedTax reconciliation code worked

    it('marks the bank adjustment as cleared', function (done) {
      var sql = "SELECT toggleBankRecCleared(" + bankrec.bankrec_id         +
                ", 'AD', " + trans2.bankadj_id        +
                ", " + trans2.bankadj_curr_rate       +
                ", " + trans2.bankadj_amount + ") AS result;"
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms the bank adjustment was /not/ posted but is cleared', function (done) {
      var sql = mqlToSql(bankAdjCheckSql, { bankadjid: trans2.bankadj_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].bankadj_posted);
        assert(res.rows[0].bankrecitem_id >= 0);
        done();
      });
    });

    it('posts the reconciliation again', function (done) {
      var sql = 'SELECT postBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;'
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the check was reconciled properly', function (done) {
      var sql = mqlToSql(checkCheckSql, { checkid:   trans1.checkid,
                                          bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].gltrans_rec);
        assert.isTrue(res.rows[0].bankrec_posted);
        done();
      });
    });

    // TODO: confirm the CashBasedTax reconciliation code worked

    it('confirms the bank adjustment was cleared, posted, written to the GL', function (done) {
      var sql = mqlToSql(bankAdjCheckSql, { bankadjid: trans2.bankadj_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankadj_posted);
        assert(res.rows[0].bankadj_sequence >= 0);
        assert.equal(res.rows[0].bankrecitem_source, 'GL');
        assert.equal(res.rows[0].bankrecitem_source_id, res.rows[0].gltrans_id);
        assert.isTrue(res.rows[0].gltrans_rec);
        assert.closeTo(Math.abs(res.rows[0].gltrans_amount),
                       res.rows[0].baseamt,
                       0.006);
        done();
      });
    });

    it('deletes the bankrec', function (done) {
      var sql = 'SELECT deleteBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;';
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result >= 0);
        done();
      });
    });

    it('checks that the bankrec is really gone', function (done) {
      var sql = 'SELECT COUNT(*) AS result FROM bankrec WHERE bankrec_id = ' +
                bankrec.bankrec_id + ';';
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result === 0);
        done();
      });
    });

    it('checks that the bankrecitems are gone', function (done) {
      var sql = 'SELECT COUNT(*) AS result FROM bankrecitem' +
                ' WHERE bankrecitem_bankrec_id = ' + bankrec.bankrec_id + ';';
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result === 0);
        done();
      });
    });

    it('turns off cash-based tax handling if necessary', function (done) {
      if (wasCashBasedTax) {
        done();
      } else {
        var sql = "SELECT setMetric('CashBasedTax', 'f') AS result;";
        datasource.query(sql, creds, function (err, res) {
          assert.equal(res.rowCount, 1);
          done();
        });
      }
    });

    it('tries to delete a non-existent bankrec', function (done) {
      var sql = 'SELECT deleteBankReconciliation(-15) AS result;';
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result === 0); // no, it doesn't complain
        done();
      });
    });

  });
}());
