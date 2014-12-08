/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true, console:true */

/* note: much of this test consists of SETUP for testing tax handling.
 * bank reconciliation when cash-based taxation is enabled
 * is supposed to create taxpay and corresponding gltrans records.
 * to test this, we need to turn on cashed-based taxation,
 * generate both a/r and a/p transactions, reconcile the bank
 * statement, and check the tax history.
 * reopening the bankrec is supposed to reverse these transactions.
 */

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
      if (_.isNumber(value)) {
        result = result.replace(valueRE, value);
      } else {
        result = result.replace(valueRE, "'" + value + "'");
      }
      result = result.replace(literalRE, value);
    });
    return result;
  };

  describe('test bank reconciliation functions', function () {

    var loginData = require("../lib/login_data.js").data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../node-datasource/config.js")),
      creds  = _.extend({}, config.databaseServer, {database: loginData.org}),
      start  = new Date(),
      testTag = 'bankrec test ' + start.toLocaleTimeString(),
      closeEnough = 0.006,
      bankaccnt,
      bankadj = { amount: 54.32 },
      bankrec,
      apcheck = {}, apcheckitem,
      aropen,
      badTaxIds,
      cashrcpt,
      cm,
      cobmisc = {},
      cohead, coitem,
      invchead = {},
      pohead, poitem,
      recvid,
      voucher, voitem,
      vomisc = { amount: 67.89 },
      votax,
      voitemtax,
      vomisctax,
      wasCashBasedTax,
      bankRecItemSql = 'SELECT * FROM bankrecitem '             +
                       ' WHERE bankrecitem_bankrec_id=<? value("brid") ?>'   +
                       '   AND bankrecitem_source=<? value("src") ?>'        +
                       '   AND bankrecitem_source_id <? literal("srcid") ?>;',
      toggleCheckSql = "SELECT toggleBankRecCleared(<? value('bankrecid') ?>,'GL'," +
                       "  gltrans_id, checkhead_curr_rate, checkhead_amount)"  +
                       "  AS result"                                           +
                       " FROM checkhead JOIN gltrans ON (gltrans_doctype='CK'" +
                       "                    AND gltrans_misc_id=checkhead_id)" +
                       " WHERE checkhead_id=<? value('checkid') ?>"            +
                       "   AND gltrans_amount > 0;",
      postCheckSql  = "SELECT postCheck(<? value('id') ?>, NULL) AS result;",
      checkCheckSql = "SELECT *,"                                              +
                     "       bankrecitem_amount/bankrecitem_curr_rate AS base" +
                     " FROM gltrans"                                           +
                     " JOIN bankrecitem ON (gltrans_id=bankrecitem_source_id)" +
                     " JOIN bankrec    ON (bankrecitem_bankrec_id=bankrec_id)" +
                     " WHERE gltrans_doctype='CK'"                             +
                     "   AND gltrans_misc_id=<? value('checkid') ?>"           +
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
                  " ORDER BY preferred DESC LIMIT 1;",
      getBankRecSql = "SELECT * FROM bankrec WHERE bankrec_id=<? value('id') ?>;",
      bankRecGLSql = "SELECT gltrans.* "                                       +
                     "  FROM gltrans"                                          +
                     "  JOIN bankrecitem ON gltrans_id=bankrecitem_source_id"  +
                     "                  AND bankrecitem_source='GL'"           +
                     " WHERE bankrecitem_bankrec_id=<? value('bankrecid') ?>"  +
                     "   AND bankrecitem_cleared;",
      postBankRecSql = "SELECT postBankReconciliation(<? value('id') ?>)"  +
                       "    AS result;",
      gltransCheckSql = "SELECT COUNT(*) AS cnt FROM gltrans;", // TODO: make smarter
      taxinfoCheckSql = "SELECT * FROM <? literal('taxhist') ?>"   +
                        "  LEFT OUTER JOIN taxpay"                 +
                        "       ON (taxpay_taxhist_id=taxhist_id)" +
                        " WHERE taxhist_parent_id=<? value('taxparent') ?>;",
      cohisttaxinfoSql = "SELECT * FROM cohisttax"                             +
                         "  JOIN cohist ON taxhist_parent_id=cohist_id"        +
                         "  LEFT OUTER JOIN taxpay"                            +
                         "       ON taxhist_id=taxpay_taxhist_id"              +
                         " WHERE cohist_itemsite_id=<? value('itemsite') ?>"   +
                         "   AND cohist_ordernumber=<? value('cohead') ?>;",
      lastGltransCount = 0
    ;

    // set up /////////////////////////////////////////////////////////////////

    it("patches tax accts to ensure tax handling /can/ work", function (done) {
      var sql = "UPDATE tax SET tax_dist_accnt_id ="            +
                " (SELECT accnt_id FROM accnt"                  +
                "   WHERE accnt_descrip = 'Accounts Payable')"  +
                " WHERE tax_dist_accnt_id IS NULL"              +
                " RETURNING tax_id;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        badTaxIds = _.map(res.rows, function (v) { return v.tax_id; });
        done();
      });
    });

    it('looks for a bank account to work with', function (done) {
      var sql = 'SELECT * FROM bankaccnt WHERE bankaccnt_id IN ('       +
                '   SELECT bankrec_bankaccnt_id FROM bankrec'           +
                '   GROUP BY bankrec_bankaccnt_id'                      +
                '   HAVING BOOL_AND(bankrec_posted)) LIMIT 1;'
                ;
      datasource.query(sql, creds, function (err, res) {
        if (res.rowCount === 1) {
          bankaccnt = res.rows[0];
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
            bankaccnt = res.rows[0];
            assert.isNotNull(bankaccnt, 'we found a bank account');
            bankrec = "select";
            done();
          });
        }
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
          sql = mqlToSql("INSERT INTO period ("                         +
                "  period_closed, period_freeze, period_name,"          +
                "  period_quarter, period_start,"                       +
                "  period_end, period_number"                           +
                ") VALUES (FALSE, FALSE, <? value('testTag') ?>,"       +
                "  EXTRACT(QUARTER FROM DATE CURRENT_DATE),"            +
                "  DATE_TRUNC(MONTH, CURRENT_DATE),"                    +
                "  DATE_TRUNC(MONTH, CURRENT_DATE) + '1 month',"        +
                "  EXTRACT(month FROM DATE CURRENT_DATE)"               +
                ") RETURNING period_id;",
                { testTag: testTag });
        } else if (res.rows[0].period_closed === true) {
          sql = mqlToSql('SELECT openAccountingPeriod(<? value("period") ?>)' +
                         ' AS period_id;', { period: res.rows[0].period_id });
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
                         "    vend_curr_id, false, <? value('testTag') ?>,"    +
                         "    (SELECT MIN(warehous_id) FROM whsinfo WHERE "    +
                         "     warehous_active AND NOT warehous_transit),"     +
                         "    false, vend_terms_id, taxass_taxtype_id"         +
                         "   FROM vendinfo"                                    +
                         "   JOIN taxass ON vend_taxzone_id=taxass_taxzone_id" +
                         "   JOIN taxrate ON taxass_tax_id=taxrate_tax_id"     +
                         "  WHERE vend_active"                                 +
                         "    AND (taxrate_percent > 0 OR taxrate_amount > 0)" +
                         " LIMIT 1 RETURNING *;",
                         { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        pohead = res.rows[0];
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
                         "    now() + '5 days', <? value('testTag') ?>"        +
                         "  FROM pohead"                                       +
                         "  JOIN itemsrc  ON pohead_vend_id=itemsrc_vend_id"   +
                         "  JOIN itemsite ON itemsrc_item_id=itemsite_item_id" +
                         "  WHERE itemsite_active AND itemsrc_active"          +
                         "    AND pohead_id=<? value('poheadid') ?>"           +
                         " LIMIT 1 RETURNING *;",
                         { poheadid: pohead.pohead_id, testTag: testTag });
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
                         { pohead_id: pohead.pohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        pohead.amount  = res.rows[0].amt;
        pohead.freight = res.rows[0].freight;
        pohead.tax     = res.rows[0].tax;
        apcheck.amount = pohead.amount + pohead.freight + pohead.tax;
        done();
      });
    });

    it('releases the purchase order', function (done) {
      var sql = mqlToSql("SELECT releasePurchaseOrder(<? value('id') ?>)" +
                         " AS result;", { id: pohead.pohead_id });
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
                         "    'Vend Invoice', <? value('testTag') ?>, false,"  +
                         "    <? value('vototal') ?>,"                         +
                         "    pohead_curr_id, <? value('testTag') ?>"          +
                         "    FROM pohead"                                     +
                         "   WHERE pohead_id=<? value('poheadid') ?>"          +
                         " RETURNING *,"                                       +
                         "   currRate(vohead_curr_id, CURRENT_DATE) AS exrate;",
                         { poheadid: pohead.pohead_id,
                           vototal:  apcheck.amount + vomisc.amount,
                           testTag:  testTag });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        voucher = res.rows[0];
        done();
      });
    });

    it('distributes the p/o item to the voucher', function (done) {
      var sql = mqlToSql("SELECT distributeVoucherLine(vohead_id,"          +
                         "  poitem_id, vohead_curr_id) AS result"           +
                         "  FROM vohead JOIN poitem"                        +
                         "          ON (vohead_pohead_id=poitem_pohead_id)" +
                         " WHERE poitem_id = <? value('poitem_id') ?>;",
                         { poitem_id: poitem.poitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1);
        done();
      });
    });

    it('gets the voitem', function (done) {
      var sql = mqlToSql("SELECT * FROM voitem" +
                         " WHERE voitem_vohead_id=<? value('vohead') ?>;",
                         { vohead: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        voitem = res.rows[0];
        assert(voitem.voitem_id > 0);
        done();
      });
    });

    it('creates a misc voucher distribution', function (done) {
      var sql = mqlToSql("INSERT INTO vodist (vodist_vohead_id,"               +
                         "  vodist_poitem_id, vodist_costelem_id,"             +
                         "  vodist_accnt_id, vodist_amount,"                   +
                         "  vodist_discountable, vodist_expcat_id,"            +
                         "  vodist_tax_id, vodist_notes"                       +
                         ") SELECT <? value('vohead') ?>, -1, -1,"             +
                         "    COALESCE(tax_sales_accnt_id,tax_dist_accnt_id)," +
                         "    <? value('miscamt') ?>,"                         +
                         "    FALSE, -1, tax_id, <? value('testTag') ?>"       +
                         "  FROM tax"                                          +
                         "  JOIN taxass ON tax_id = taxass_tax_id"             +
                         "  JOIN taxtype ON taxass_taxtype_id=taxtype_id"      +
                         "  JOIN poitem ON taxtype_id=poitem_taxtype_id"       +
                         "  JOIN pohead ON poitem_pohead_id=pohead_id"         +
                         "            AND taxass_taxzone_id=pohead_taxzone_id" +
                         " WHERE poitem_id=<? value('poitemid') ?>"            +
                         " RETURNING *;",
                         { vohead:   voucher.vohead_id, miscamt: vomisc.amount,
                           poitemid: poitem.poitem_id,  testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        vomisc = res.rows[0];
        assert(vomisc.vodist_id > 0);
        done();
      });
    });

    it('posts the voucher', function (done) {
      var sql = mqlToSql("SELECT postVoucher(<? value('id') ?>, TRUE)" +
                         " AS result;", { id: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0);
        done();
      });
    });

    it('checks for voucher tax distributions', function (done) {
      var sql = mqlToSql("SELECT 1 AS seq, * FROM voheadtax"                   +
                         " WHERE taxhist_parent_id=<? value('voheadid') ?>"    +
                         " UNION ALL "                                         +
                         "SELECT 2 AS seq, voitemtax.*"                        +
                         "  FROM voitemtax"                                    +
                         "  JOIN voitem ON taxhist_parent_id=voitem_id"        +
                         " WHERE voitem_vohead_id=<? value('voheadid') ?>"     +
                         " ORDER BY seq, taxhist_id;",
                         { voheadid: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 2);
        votax = res.rows[0];
        assert.closeTo(votax.taxhist_basis, 0, closeEnough);
        voitemtax = res.rows[1];
        assert.closeTo(voitemtax.taxhist_basis,
                       - poitem.poitem_unitprice * poitem.poitem_qty_ordered,
                       closeEnough);
        done();
      });
    });

    it('creates an apcheck to reconcile', function (done) {
      var sql = mqlToSql("SELECT createCheck(<? value('bankaccntid') ?>, 'V'," +
                         "   vohead_vend_id, CURRENT_DATE, vohead_amount,"     +
                         "   vohead_curr_id, NULL, NULL, 'AP Bearer',"         +
                         "   <? value('testTag') ?>, TRUE, NULL) AS checkid"   +
                         "  FROM vohead"                                       +
                         " WHERE vohead_id=<? value('voheadid') ?>;",
                         { bankaccntid: bankaccnt.bankaccnt_id,
                           voheadid:    voucher.vohead_id,
                           testTag:     testTag });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].checkid > 0);
        var checkid = res.rows[0].checkid;
        sql = mqlToSql("UPDATE checkhead SET checkhead_number="      +
                       "  fetchNextCheckNumber(<? value('bank') ?>)" +
                       " WHERE checkhead_id=<? value('check') ?>"    +
                       " RETURNING *;",
                       { bank: bankaccnt.bankaccnt_id, check: checkid });
        datasource.query(sql, creds, function (err, res) {
          assert.equal(res.rowCount, 1);
          apcheck = res.rows[0];
          done();
        });
      });
    });

    it('creates a credit memo to attach to the apcheck', function (done) {
      var sql = mqlToSql("SELECT createAPCreditMemo(NULL, pohead_vend_id,"     +
                         "       fetchJournalNumber('AP-MISC'),"               +
                         "       <? value('vonumber') ?>, pohead_number,"      +
                         "       CURRENT_DATE, <? value('amount') ?>,"         +
                         "       <? value('testTag') ?>, -1,"                  +
                         "       CAST(now()+'30 days' AS DATE),"               +
                         "       pohead_terms_id, pohead_curr_id) AS result"   +
                         "  FROM pohead"                                       +
                         " WHERE pohead_id=<? value('poheadid') ?>;",
                         { amount:   apcheck.checkhead_amount,
                           testTag:  testTag,
                           vonumber: voucher.vohead_number,
                           poheadid: pohead.pohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        cm = res.rows[0].result;
        assert(cm > 0);
        done();
      });
    });

    it('creates a checkitem for the credit memo', function (done) {
      var sql = mqlToSql("INSERT INTO checkitem ("                             +
                         "  checkitem_checkhead_id, checkitem_apopen_id,"      +
                         "  checkitem_vouchernumber, checkitem_amount,"        +
                         "  checkitem_ponumber, checkitem_discount,"           +
                         "  checkitem_docdate,"                                +
                         "  checkitem_curr_id, checkitem_curr_rate"            +
                         ") SELECT <? value('checkid') ?>, apopen_id,"         +
                         "    <? value('vonumber') ?>, apopen_amount,"         +
                         "    apopen_ponumber, 0, CURRENT_DATE,"               +
                         "    apopen_curr_id, apopen_curr_rate"                +
                         "  FROM apopen"                                       +
                         " WHERE apopen_journalnumber=<? value('journal') ?>"  +
                         " RETURNING *;",
                         { checkid: apcheck.checkhead_id,
                           vonumber: voucher.vohead_number,
                           journal: cm });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        apcheckitem = res.rows[0];
        assert(apcheckitem.checkitem_id > 0);
        done();
      });
    });

    it('posts the apcheck', function (done) {
      var sql = mqlToSql(postCheckSql, { id: apcheck.checkhead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0);
        apcheck.journalNumber = res.rows[0].result;
        done();
      });
    });

    it('creates a sales order', function (done) {
      var sql = mqlToSql("INSERT INTO cohead (cohead_number, cohead_cust_id,"  +
                 "    cohead_orderdate, cohead_packdate,"                      +
                 "    cohead_shipto_id, cohead_shiptoname,"                    +
                 "    cohead_shiptoaddress1, cohead_shiptoaddress2,"           +
                 "    cohead_shiptoaddress3, cohead_shiptocity,"               +
                 "    cohead_shiptostate, cohead_shiptozipcode,"               +
                 "    cohead_shiptocountry, cohead_ordercomments,"             +
                 "    cohead_salesrep_id, cohead_terms_id, cohead_holdtype,"   +
                 "    cohead_freight, cohead_calcfreight,"                     +
                 "    cohead_shipto_cntct_id, cohead_shipto_cntct_first_name," +
                 "    cohead_shipto_cntct_last_name,"                          +
                 "    cohead_curr_id, cohead_taxzone_id, cohead_taxtype_id,"   +
                 "    cohead_saletype_id,"                                     +
                 "    cohead_shipvia,"                                         +
                 "    cohead_shipchrg_id,"                                     +
                 "    cohead_shipzone_id, cohead_shipcomplete"                 +
                 ") SELECT fetchSoNumber(), cust_id,"                          +
                 "    CURRENT_DATE, CURRENT_DATE,"                             +
                 "    shipto_id, shipto_name,"                                 +
                 "    addr_line1, addr_line2,"                                 +
                 "    addr_line3, addr_city,"                                  +
                 "    addr_state, addr_postalcode,"                            +
                 "    addr_country, <? value('testTag') ?>,"                   +
                 "    cust_salesrep_id, cust_terms_id, 'N',"                   +
                 "    0, TRUE,"                                                +
                 "    cntct_id, cntct_first_name, cntct_last_name,"            +
                 "    cust_curr_id, shipto_taxzone_id, taxass_taxtype_id,"     +
                 "    (SELECT saletype_id FROM saletype"                       +
                 "      WHERE saletype_code='REP'),"                           +
                 "    (SELECT MIN(shipvia_code) FROM shipvia),"                +
                 "    (SELECT shipchrg_id FROM shipchrg"                       +
                 "      WHERE shipchrg_name='ADDCHARGE'),"                     +
                 "    shipto_shipzone_id, FALSE"                               +
                 "  FROM custinfo"                                             +
                 "  JOIN shiptoinfo ON cust_id=shipto_cust_id"                 +
                 "                 AND shipto_active"                          +
                 "  JOIN taxass ON shipto_taxzone_id=taxass_taxzone_id"        +
                 "  JOIN taxrate ON taxass_tax_id=taxrate_tax_id"              +
                 "  LEFT OUTER JOIN addr ON shipto_addr_id=addr_id"            +
                 "  LEFT OUTER JOIN cntct ON shipto_cntct_id=cntct_id"         +
                 " WHERE cust_active"                                          +
                 "   AND cust_preferred_warehous_id > 0"                       +
                 "   AND (taxrate_percent > 0 OR taxrate_amount > 0)"          +
                 " LIMIT 1 RETURNING *;",
                 { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        cohead = res.rows[0];
        assert(cohead.cohead_id > 0);
        done();
      });
    });

    it('creates a sales order item', function (done) {
      var sql = mqlToSql("INSERT INTO coitem (coitem_cohead_id,"              +
               "    coitem_linenumber, coitem_scheddate, coitem_itemsite_id," +
               "    coitem_taxtype_id, coitem_status,"                        +
               "    coitem_qtyord, coitem_qtyshipped,  coitem_qtyreturned,"   +
               "    coitem_unitcost, coitem_price, coitem_custprice,"         +
               "    coitem_qty_uom_id, coitem_price_uom_id,"                  +
               "    coitem_qty_invuomratio, coitem_price_invuomratio"         +
               ") SELECT cohead_id,"                                          +
               "    1, CURRENT_DATE + itemsite_leadtime, itemsite_id,"        +
               "    getItemTaxType(item_id, cohead_taxzone_id), 'O',"         +
               "    123, 0, 0,"                                               +
               "    itemcost(itemsite_id), item_listprice, item_listprice,"   +
               "    item_price_uom_id, item_price_uom_id,"                    +
               "    1, 1"                                                     +
               "  FROM cohead"                                                +
               "  JOIN custinfo ON cohead_cust_id=cust_id"                    +
               "  JOIN itemsite"                                              +
               "        ON cust_preferred_warehous_id=itemsite_warehous_id"   +
               "  JOIN item ON (itemsite_item_id=item_id)"                    +
               " WHERE cohead_id=<? value('coheadid') ?>"                     +
               "   AND itemsite_active"                                       +
               "   AND item_active"                                           +
               "   AND item_sold"                                             +
               "   AND NOT item_exclusive"                                    +
               "   AND NOT item_exclusive"                                    +
               "   AND ("                                                     +
               "         SELECT itemprice_price"                              +
               "         FROM itemipsprice("                                  +
               "           item_id,"                                          +
               "           cohead_cust_id,"                                   +
               "           cohead_shipto_id,"                                 +
               "           123,"                                              +
               "           item_price_uom_id,"                                +
               "           item_price_uom_id,"                                +
               "           basecurrid(),"                                     +
               "           CURRENT_DATE,"                                     +
               "           CURRENT_DATE,"                                     +
               "           itemsite_warehous_id"                              +
               "         )"                                                   +
               "       ) > 0 "                                                +
               "   AND item_price_uom_id=item_inv_uom_id"                     +
/* simplify!*/ "   AND item_type != 'K'"                                      +
               " LIMIT 1 RETURNING *;",
                 { coheadid: cohead.cohead_id, testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        coitem = res.rows[0];
        assert(coitem.coitem_id > 0);
        done();
      });
    });

    it('updates the sales order with item info', function (done) {
      var sql = mqlToSql("UPDATE cohead SET cohead_freight=("                  +
                         "    SELECT SUM(freightdata_total)"                   +
                         "      FROM freightDetail('SO', cohead_id,"           +
                         "              cohead_cust_id, cohead_shipto_id,"     +
                         "              CURRENT_DATE, cohead_shipvia,"         +
                         "              cohead_curr_id))"                      +
                         " WHERE cohead_id=<? value('cohead_id') ?>"           +
                         " RETURNING cohead_freight;",
                         { cohead_id: cohead.cohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        cohead.cohead_freight = res.rows[0].cohead_freight;
        done();
      });
    });

    it('calculates sales order amounts', function (done) {
      var sql = mqlToSql("SELECT SUM(coitem_qtyord*coitem_price) AS amt,"      +
                         "   (SELECT SUM(tax) FROM"                            +
                         "      (SELECT ROUND(SUM(taxdetail_tax), 2) AS tax"   +
                         "         FROM tax JOIN"                              +
                         "      calculateTaxDetailSummary('S',cohead_id,'T')"  +
                         "              ON (tax_id=taxdetail_tax_id)"          +
                         "      GROUP BY tax_id) AS taxdata"                   +
                         "   ) AS tax"                                         +
                         "  FROM coitem"                                       +
                         "  JOIN cohead ON coitem_cohead_id=cohead_id"         +
                         " WHERE cohead_id=<? value('cohead_id') ?>"           +
                         " GROUP BY cohead_id;",
                         { cohead_id: cohead.cohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        cohead.subtotal = res.rows[0].amt;
        cohead.tax      = res.rows[0].tax;
        cohead.amount   = cohead.subtotal + cohead.cohead_freight + cohead.tax;
        assert(cohead.subtotal > 0, 'expect the sales order to have value');
        assert(cohead.tax      > 0, 'expect the sales order to have tax');
        done();
      });
    });

    it('issue the sales order to shipping', function (done) {
      var sql = mqlToSql("SELECT issueToShipping(coitem_id, coitem_qtyord)" +
                         "       AS result"                                 +
                         "  FROM coitem WHERE coitem_id=<? value('id') ?>;",
                         { id: coitem.coitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0, 'expected issueToShipping to succeed');
        done();
      });
    });

    it('ships the sales order', function (done) {
      var sql = mqlToSql("SELECT shipShipment(shiphead_id) AS result"          +
                         "  FROM shiphead"                                     +
                         "  JOIN shipitem ON shiphead_order_type = 'SO'"       +
                         "               AND shiphead_id=shipitem_shiphead_id" +
                         " WHERE shipitem_orderitem_id=<? value('coitem') ?>;",
                         { coitem: coitem.coitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        // TODO: why does shipShipment return NULL on success?
        assert(res.rows[0].result === null || res.rows[0].result > 0,
               'expected shipShipment to succeed');
        done();
      });
    });

    // this creates cobmisc and cobill records for all uninvoiced coitems
    it('selects the shipment for billing', function (done) {
      var sql = mqlToSql("SELECT selectUninvoicedShipment(shiphead_id)"        +
                         "       AS result"                                    +
                         "  FROM shiphead"                                     +
                         "  JOIN shipitem ON shiphead_order_type = 'SO'"       +
                         "               AND shiphead_id=shipitem_shiphead_id" +
                         " WHERE shipitem_orderitem_id=<? value('coitem') ?>;",
                         { coitem: coitem.coitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        cobmisc.cobmisc_id = res.rows[0].result;
        assert(cobmisc.cobmisc_id > 0,
               'expected selectUninvoicedShipment to succeed');
        done();
      });
    });

    it('creates an invoice', function (done) {
      var sql = mqlToSql("SELECT createInvoice(<? value('cobmisc') ?>) AS id;",
                         { cobmisc: cobmisc.cobmisc_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        invchead.invchead_id = res.rows[0].id;
        assert(invchead.invchead_id > 0, 'expected createInvoice to succeed');
        done();
      });
    });

    it('posts the invoice', function (done) {
      var sql = mqlToSql("SELECT postInvoice(<? value('id') ?>) AS result;",
                         { id: invchead.invchead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        var result = res.rows[0].result;
        assert(result === null || result > 0, 'expected postInvoice to succeed');
        done();
      });
    });

    // TODO? UPDATE shipdatasum SET shipdatasum_shipped=true
    //        WHERE shipdatasum_cosmisc_tracknum = ''
    //          AND shipdatasum_shiphead_number='60103';

    it('creates a cash receipt to reconcile', function (done) {
      var sql = mqlToSql("INSERT INTO cashrcpt ("                              +
                         "  cashrcpt_cust_id, cashrcpt_amount,"                +
                         "  cashrcpt_fundstype, cashrcpt_docnumber,"           +
                         "  cashrcpt_bankaccnt_id, cashrcpt_notes,"            +
                         "  cashrcpt_curr_id, cashrcpt_number,"                +
                         "  cashrcpt_docdate, cashrcpt_applydate,"             +
                         "  cashrcpt_distdate, cashrcpt_usecustdeposit,"       +
                         "  cashrcpt_curr_rate,"                               +
                         "  cashrcpt_salescat_id, cashrcpt_discount"           +
                         ") SELECT cohead_cust_id, <? value('amount') ?>,"     +
                         "       'C', 'CR ' || <? value('testTag') ?>,"        +
                         "       <? value('bank') ?>, <? value('testTag') ?>," +
                         "       cohead_curr_id, fetchCashRcptNumber(),"       +
                         "       NULL, CURRENT_DATE,"                          +
                         "       CURRENT_DATE, TRUE,"                          +
                         "       currRate(cohead_curr_id, CURRENT_DATE),"      +
                         "       -1, 0"                                        +
                         "    FROM cohead"                                     +
                         "   WHERE cohead_id=<? value('coheadid') ?>"          +
                         " RETURNING *;",
                         { coheadid: cohead.cohead_id,
                           amount:   cohead.amount,
                           bank:     bankaccnt.bankaccnt_id,
                           testTag:  testTag
                         });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].cashrcpt_id > 0);
        cashrcpt = res.rows[0];
        done();
      });
    });

    it('apply the cash receipt to the invoice', function (done) {
      var sql = mqlToSql("SELECT applyCashReceiptLineBalance("                 +
                         "     <? value('crid') ?>, aropen_id, aropen_amount," +
                         "     aropen_curr_id) AS result"                      +
                         "  FROM aropen"                                       +
                         "  JOIN invchead ON aropen_doctype = 'I'"             +
                         "           AND aropen_docnumber=invchead_invcnumber" +
                         " WHERE invchead_id=<? value('invchead') ?>;",
                         { crid:     cashrcpt.cashrcpt_id,
                           invchead: invchead.invchead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0, 'expect an application');
        // applyCashReceiptLineBalance subtracts discounts so we can't just
        // assert.closeTo(res.rows[0].result, cohead.amount, closeEnough);
        done();
      });
    });

    // This creates an aropen and a cashrcptitem
    it('posts the cash receipt', function (done) {
      var sql = mqlToSql("SELECT postCashReceipt(<? value('id') ?>," +
                         "    fetchJournalNumber('C/R')) AS result;",
                         { id: cashrcpt.cashrcpt_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1);
        done();
      });
    });

    it('finds the aropen for the cash receipt application', function (done) {
      var sql = mqlToSql("SELECT aropen.* FROM aropen JOIN cashrcptitem"     +
                         "    ON aropen_id=cashrcptitem_aropen_id"           +
                         " WHERE cashrcptitem_cashrcpt_id=<? value('id') ?>" +
                         "   AND aropen_doctype = 'I';",
                         { id: cashrcpt.cashrcpt_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        aropen = res.rows[0];
        done();
      });
    });

    // now start actual bankrec testing ///////////////////////////////////////

    it('gets an open bankrec to test with', function (done) {
      var mql, sql;
      if (bankrec === "create") {
        mql = 'INSERT INTO bankrec (bankrec_bankaccnt_id,'    +
              '  bankrec_opendate, bankrec_openbal'           +
              ') SELECT bankrec_bankaccnt_id,'                +
              '         bankrec_enddate + 1, bankrec_endbal'  +
              '    FROM bankrec'                              +
              '   WHERE bankrec_bankaccnt_id=<? value("bankaccnt") ?>' +
              '     AND bankrec_posted'                       +
              '   ORDER BY bankrec_enddate DESC'              +
              '   LIMIT 1 RETURNING *;'
              ;
      } else if (bankrec === "select") {
        mql = 'SELECT * FROM bankrec'                                    +
              ' WHERE bankrec_bankaccnt_id=<? value("bankaccnt") ?>'     +
              '   AND bankrec_opendate IN'                               +
              '  (SELECT MAX(bankrec_opendate) FROM bankrec'             +
              '    WHERE NOT bankrec_posted'                             +
              '      AND bankrec_bankaccnt_id=<? value("bankaccnt") ?>'  +
              '  );'
              ;
      }
      sql = mqlToSql(mql, {bankaccnt: bankaccnt.bankaccnt_id});

      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        bankrec = res.rows[0];
        assert.isNotNull(bankrec,              'we have a bank rec');
        assert.isFalse(bankrec.bankrec_posted, 'we have an open bank rec');
        done();
      });
    });

    it('marks the apcheck as cleared', function (done) {
      var sql = mqlToSql(toggleCheckSql, { bankrecid: bankrec.bankrec_id,
                                           checkid:   apcheck.checkhead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms the apcheck was marked as cleared', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'GL',
          srcid: " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                 " gltrans_doctype='CK' AND gltrans_misc_id=" +
                 apcheck.checkhead_id + ")"});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankrecitem_cleared);
        assert(res.rows[0].bankrecitem_cleared);
        done();
      });
    });

    it('marks the apcheck as /not/ cleared', function (done) {
      var sql = mqlToSql(toggleCheckSql, { bankrecid: bankrec.bankrec_id,
                                           checkid:   apcheck.checkhead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].result);
        done();
      });
    });

    it('confirms the apcheck is no longer marked as cleared', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'GL',
          srcid: " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                 " gltrans_doctype='CK' AND gltrans_misc_id=" +
                 apcheck.checkhead_id + ")" });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it('marks the apcheck as cleared again', function (done) {
      var sql = mqlToSql(toggleCheckSql, { bankrecid: bankrec.bankrec_id,
                                           checkid:   apcheck.checkhead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms that the apcheck is marked as cleared again', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'GL',
          srcid: " IN (SELECT gltrans_id FROM gltrans" +
                 " WHERE gltrans_doctype='CK' AND "    +
                 " gltrans_misc_id=" + apcheck.checkhead_id + ")"});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankrecitem_cleared);
        assert(res.rows[0].bankrecitem_cleared);
        done();
      });
    });

    it('marks the cash receipt as cleared', function (done) {
      var sql = mqlToSql("SELECT toggleBankRecCleared("                        +
                         "     <? value('bankrecid') ?>, 'A/R', gltrans_id,"   +
                         "     cashrcpt_curr_rate, cashrcpt_amount) AS result" +
                         "  FROM gltrans"                                      +
                         "  JOIN cashrcpt ON gltrans_misc_id=cashrcpt_id"      +
                         "               AND gltrans_doctype='CR'"             +
                         " WHERE cashrcpt_id=<? value('cashrcptid') ?>"        +
                         "   AND gltrans_accnt_id=<? value('accntid') ?>;",
                         { bankrecid: bankrec.bankrec_id,
                           cashrcptid:  cashrcpt.cashrcpt_id,
                           accntid:   bankaccnt.bankaccnt_accnt_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms the cash receipt was marked as cleared', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'A/R',
          srcid: " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                 " gltrans_doctype='CR' AND gltrans_misc_id=" +
                 cashrcpt.cashrcpt_id + ")" });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankrecitem_cleared);
        assert(res.rows[0].bankrecitem_cleared);
        done();
      });
    });

    it('creates a bank adjustment', function (done) {
      var sql = mqlToSql("INSERT INTO bankadj ("                             +
                "  bankadj_bankaccnt_id, bankadj_bankadjtype_id,"            +
                "  bankadj_date, bankadj_docnumber, bankadj_amount,"         +
                "  bankadj_notes, bankadj_curr_id,"                          +
                "  bankadj_curr_rate"                                        +
                ") SELECT <? value('bankaccnt') ?>, bankadjtype_id,"         +
                "    CURRENT_DATE, 'BankRecTest', <? value('amount') ?>,"    +
                "    <? value('testTag') ?>,      <? value('currid') ?>,"    +
                "    currrate(<? value('currid') ?>, basecurrid(),"          +
                "             CURRENT_DATE) FROM bankadjtype RETURNING *;",
                { amount: bankadj.amount, bankaccnt: bankaccnt.bankaccnt_id,
                  testTag: testTag,      currid: bankaccnt.bankaccnt_curr_id })
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        _.extend(bankadj, res.rows[0]);
        assert.ok(bankadj.bankadj_id, 'we have a bank adjustment');
        done();
      });
    });

    it('gets the size of the gltrans table before posting', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        lastGltransCount = res.rows[0].cnt;
        done();
      });
    });

    it('checks voitem tax data before posting', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voitemtax', taxparent: voitem.voitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,        'expect one voitemtax record');
        assert.isNull(res.rows[0].taxpay_id, 'expect no voitem taxpay');
        done();
      });
    });

    it('checks misc distrib tax data before posting', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voheadtax', taxparent: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,        'expect one voheadtax record');
        assert.isNull(res.rows[0].taxpay_id, 'expect no vohead taxpay');
        done();
      });
    });

    it('checks cashrcpt application tax data before posting', function (done) {
      var sql = mqlToSql(cohisttaxinfoSql,
                         { itemsite: coitem.coitem_itemsite_id,
                           cohead:   cohead.cohead_number });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,        'expect 1 cohisttax record');
        assert.isNull(res.rows[0].taxpay_id, 'expect no cohist taxpay');
        done();
      });
    });

    it('posts the reconciliation', function (done) {
      var sql = mqlToSql(postBankRecSql, {id: bankrec.bankrec_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the posted bankrec was updated properly', function (done) {
      var sql = mqlToSql(getBankRecSql, { id: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankrec_posted);
        assert.isNotNull(res.rows[0].bankrec_postdate, 'expect a post date');
        done();
      });
    });

    it('confirms the gl for the posted bankrec was updated', function (done) {
      var sql = mqlToSql(bankRecGLSql, { bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        var recorded = _.filter(res.rows,
                                function (v) { return v.gltrans_rec; });
        assert.equal(res.rows.length, recorded.length, 'AND(gltrans_rec) should be true');
        done();
      });
    });

    it('confirms the apcheck was reconciled properly', function (done) {
      var sql = mqlToSql(checkCheckSql, { checkid:   apcheck.checkhead_id,
                                          bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].gltrans_rec);
        assert.isTrue(res.rows[0].bankrec_posted);
        assert.closeTo(res.rows[0].gltrans_amount,
                       apcheck.checkhead_amount / apcheck.checkhead_curr_rate,
                       closeEnough);
        done();
      });
    });

    it('confirms reconcile updated gltrans properly', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert(res.rows[0].cnt > lastGltransCount, 'expected tax records');
        lastGltransCount = res.rows[0].cnt;
        done();
      });
    });

    it('checks voitem tax data after posting', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voitemtax', taxparent: voitem.voitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,           'expect 1 voitemtax record');
        assert.isNotNull(res.rows[0].taxpay_id, 'expect a voitem taxpay');
        assert.closeTo(res.rows[0].taxpay_tax, voitemtax.taxhist_tax, closeEnough);
        done();
      });
    });

    it('checks misc distrib tax data after posting', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voheadtax', taxparent: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,           'expect a vodisttax record');
        assert.isNotNull(res.rows[0].taxpay_id, 'expect a vodist taxpay');
        assert.closeTo(res.rows[0].taxpay_tax, votax.taxhist_tax, closeEnough);
        done();
      });
    });

    it('checks cashrcpt application tax data after posting', function (done) {
      var sql = mqlToSql(cohisttaxinfoSql,
                         { itemsite: coitem.coitem_itemsite_id,
                           cohead:   cohead.cohead_number });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,           'expect a cohisttax record');
        assert.isNotNull(res.rows[0].taxpay_id, 'expect a cohist taxpay');
        // discount => can't assert.closeTo(res.rows[0].taxpay_tax ...
        done();
      });
    });

    it('confirms the bank adjustment was /not/ posted', function (done) {
      var sql = mqlToSql(bankAdjCheckSql, { bankadjid: bankadj.bankadj_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].bankadj_posted);
        assert.isNull(res.rows[0].gltrans_id,     'expecting no gltrans');
        assert.isNull(res.rows[0].bankrecitem_id, 'expecting no bankrecitem');
        done();
      });
    });

    it('reopens the reconcilation', function (done) {
      var sql = 'SELECT reopenBankReconciliation(' + bankrec.bankrec_id +
                ') AS result;';
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the reopened bankrec was updated properly', function (done) {
      var sql = mqlToSql(getBankRecSql, { id: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].bankrec_posted);
        assert.isNull(res.rows[0].bankrec_postdate, 'expect empty post date');
        done();
      });
    });

    it('confirms the gl for the reopened bankrec was updated', function (done) {
      var sql = mqlToSql(bankRecGLSql, { bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        var recorded = _.filter(res.rows,
                                function (v) { return v.gltrans_rec; });
        assert.equal(0, recorded.length, 'AND(gltrans_rec) should be true');
        done();
      });
    });

    it('confirms reconcile updated gltrans properly', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert(res.rows[0].cnt > lastGltransCount, 'expected tax reversals');
        lastGltransCount = res.rows[0].cnt;
        done();
      });
    });

    it('checks voitem tax data after reopening', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voitemtax', taxparent: voitem.voitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,        'expect one voitemtax record');
        assert.isNull(res.rows[0].taxpay_id, 'expect no voitem taxpay');
        done();
      });
    });

    it('checks misc distrib tax data after reopening', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voheadtax', taxparent: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,        'expect one voheadtax record');
        assert.isNull(res.rows[0].taxpay_id, 'expect no vohead taxpay');
        done();
      });
    });

    it('checks cashrcpt application tax data after reopening', function (done) {
      var sql = mqlToSql(cohisttaxinfoSql,
                         { itemsite: coitem.coitem_itemsite_id,
                           cohead:   cohead.cohead_number });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,        'expect 1 cohisttax record');
        assert.isNull(res.rows[0].taxpay_id, 'expect no cohist taxpay');
        done();
      });
    });

    it('confirms the apcheck was "reopened" properly', function (done) {
      var sql = mqlToSql(checkCheckSql, { checkid:   apcheck.checkhead_id,
                                          bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].gltrans_rec);
        assert.isFalse(res.rows[0].bankrec_posted);
        assert.closeTo(Math.abs(res.rows[0].gltrans_amount), res.rows[0].base,
                       closeEnough);
        done();
      });
    });

    // we expect the reconcile to create gltrans records for voitem tax
    it('confirms unreconcile updated gltrans properly', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
// TODO assert(res.rows[0].cnt > lastGltransCount, 'expected new gltrans');
        lastGltransCount = res.rows[0].cnt;
        done();
      });
    });

    it('marks the bank adjustment as cleared', function (done) {
      var sql = "SELECT toggleBankRecCleared(" + bankrec.bankrec_id         +
                ", 'AD', " + bankadj.bankadj_id        +
                ", " + bankadj.bankadj_curr_rate       +
                ", " + bankadj.bankadj_amount + ") AS result;"
                ;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms the bank adjustment was /not/ posted but is cleared', function (done) {
      var sql = mqlToSql(bankAdjCheckSql, { bankadjid: bankadj.bankadj_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isFalse(res.rows[0].bankadj_posted);
        assert(res.rows[0].bankrecitem_id >= 0);
        done();
      });
    });

    it('posts the reconciliation again', function (done) {
      var sql = mqlToSql(postBankRecSql, {id: bankrec.bankrec_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, bankrec.bankrec_id);
        done();
      });
    });

    it('confirms the 2nd posted bankrec was updated properly', function (done) {
      var sql = mqlToSql(getBankRecSql, { id: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankrec_posted);
        assert.isNotNull(res.rows[0].bankrec_postdate, 'expect a post date');
        done();
      });
    });

    it('confirms the gl for 2nd posted bankrec was updated', function (done) {
      var sql = mqlToSql(bankRecGLSql, { bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        var recorded = _.filter(res.rows,
                                function (v) { return v.gltrans_rec; });
        assert.equal(res.rows.length, recorded.length, 'AND(gltrans_rec) should be true');
        done();
      });
    });

    it('confirms the apcheck was reconciled properly', function (done) {
      var sql = mqlToSql(checkCheckSql, { checkid:   apcheck.checkhead_id,
                                          bankrecid: bankrec.bankrec_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].gltrans_rec);
        assert.isTrue(res.rows[0].bankrec_posted);
        assert.closeTo(res.rows[0].gltrans_amount,
                       apcheck.checkhead_amount / apcheck.checkhead_curr_rate,
                       closeEnough);
        done();
      });
    });

    it('confirms reposting updated gltrans properly', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert(res.rows[0].cnt > lastGltransCount, 'expected new tax records');
        lastGltransCount = res.rows[0].cnt;
        done();
      });
    });

    it('checks voitem tax data after reposting', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voitemtax', taxparent: voitem.voitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,           'expect 1 voitemtax record');
        assert.isNotNull(res.rows[0].taxpay_id, 'expect a voitem taxpay');
        assert.closeTo(res.rows[0].taxpay_tax, voitemtax.taxhist_tax, closeEnough);
        done();
      });
    });

    it('checks misc distrib tax data after reposting', function (done) {
      var sql = mqlToSql(taxinfoCheckSql,
                         { taxhist: 'voheadtax', taxparent: voucher.vohead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,           'expect a vodisttax record');
        assert.isNotNull(res.rows[0].taxpay_id, 'expect a vodist taxpay');
        assert.closeTo(res.rows[0].taxpay_tax, votax.taxhist_tax, closeEnough);
        done();
      });
    });

    it('checks cashrcpt application tax data after reposting', function (done) {
      var sql = mqlToSql(cohisttaxinfoSql,
                         { itemsite: coitem.coitem_itemsite_id,
                           cohead:   cohead.cohead_number });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1,           'expect a cohisttax record');
        assert.isNotNull(res.rows[0].taxpay_id, 'expect a cohist taxpay');
        // discount => can't assert.closeTo(res.rows[0].taxpay_tax ...
        done();
      });
    });

    it('confirms the bank adj was posted & written to the GL', function (done) {
      var sql = mqlToSql(bankAdjCheckSql, { bankadjid: bankadj.bankadj_id});
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].bankadj_posted);
        assert(res.rows[0].bankadj_sequence >= 0);
        assert.equal(res.rows[0].bankrecitem_source, 'GL');
        assert.equal(res.rows[0].bankrecitem_source_id, res.rows[0].gltrans_id);
        assert.isTrue(res.rows[0].gltrans_rec);
        assert.closeTo(Math.abs(res.rows[0].gltrans_amount),
                       res.rows[0].baseamt, closeEnough);
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

    it('resets tax_dist_accnt_id to NULL', function (done) {
      var sql = mqlToSql('UPDATE tax SET tax_dist_accnt_id = NULL' +
                         ' WHERE tax_id IN (<? literal("idlist") ?>);',
                         { idlist: badTaxIds.join(', ') });
      if (badTaxIds.length <= 0) {
        done();
      } else {
        datasource.query(sql, creds, function (err, res) {
          assert.isNull(err);
          done();
        });
      }
    });

  });
}());
