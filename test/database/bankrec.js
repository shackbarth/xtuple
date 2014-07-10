/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true, console:true */

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
      apcheck = {},
      apcheckitem,
      archeck = {},
      aropen  = { amount: 12.34 },
      badTaxIds,
      cm,
      po,
      poitem,
      arcreditmemo = {},
      recvid,
      voucher,
      voitem,
      vomisc       = { amount: 67.89 },
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
      taxhistCheckSql = "SELECT * FROM taxhist"                            +
                        " WHERE taxhist_parent_id = <? value('voitem') ?>" +
                        " ORDER BY taxhist_id DESC;",
      gltransCheckSql = "SELECT count(*) FROM gltrans;", // TODO: make smarter
      lastGltransCount = 0
    ;

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
                         "    now() + '5 days', <? value('testTag') ?>"        +
                         "  FROM pohead"                                       +
                         "  JOIN itemsrc  ON pohead_vend_id=itemsrc_vend_id"   +
                         "  JOIN itemsite ON itemsrc_item_id=itemsite_item_id" +
                         "  WHERE itemsite_active AND itemsrc_active"          +
                         "    AND pohead_id=<? value('poheadid') ?>"           +
                         " LIMIT 1 RETURNING *;",
                         { poheadid: po.pohead_id, testTag: testTag });
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
        apcheck.amount = po.amount + po.freight + po.tax;
        done();
      });
    });

    it('releases the purchase order', function (done) {
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
                         "    'Vend Invoice', <? value('testTag') ?>, false,"  +
                         "    <? value('vototal') ?>,"                         +
                         "    pohead_curr_id, <? value('testTag') ?>"          +
                         "    FROM pohead"                                     +
                         "   WHERE pohead_id=<? value('poheadid') ?>"          +
                         " RETURNING *,"                                       +
                         "   currRate(vohead_curr_id, CURRENT_DATE) AS exrate;",
                         { poheadid: po.pohead_id,
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
        assert.equal(res.rowCount, 2); // TODO: why not 3 = head + poitem + vodist
        votax = res.rows[0];
        assert.closeTo(votax.taxhist_basis, 0, closeEnough);
        voitemtax = res.rows[1];
        assert.closeTo(voitemtax.taxhist_basis,
                       - poitem.poitem_unitprice * poitem.poitem_qty_ordered,
                       closeEnough);
/* TODO vomisctax = res.rows[2];
        assert.closeTo(vomisctax.taxhist_basis,
                       vomisc.vodist_amount, closeEnough); */
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
                           poheadid: po.pohead_id });
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

    it('creates an a/r credit memo', function (done) {
      var sql = mqlToSql("SELECT createArCreditMemo(NULL, cust_id,"            +
                "    fetchArMemoNumber(), cohead_number, CURRENT_DATE,"        +
                "    <? value('refund') ?>, <? value('testTag') ?>,"           +
                "    (SELECT MIN(rsncode_id) FROM rsncode), NULL, NULL,"       +
                "    CURRENT_DATE, cust_terms_id, cust_salesrep_id) AS result" +
                "  FROM custinfo"                                              +
                "  JOIN cohead ON cust_id=cohead_cust_id"                      +
                "  JOIN taxass ON cust_taxzone_id=taxass_taxzone_id"           +
                "  JOIN taxrate ON taxass_tax_id=taxrate_tax_id"               +
                "  WHERE cust_id IN (SELECT MIN(cust_id)"                      +
                "                      FROM custinfo WHERE cust_active)"       +
                "  AND (taxrate_percent > 0 OR taxrate_amount > 0) LIMIT 1;",
                { refund: aropen.amount, testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        aropen.id = res.rows[0].result;
        assert(aropen.id > 0);
        done();
      });
    });

    it('creates an archeck to reconcile', function (done) {
      var sql = mqlToSql("SELECT createCheck(<? value('bankaccntid') ?>, 'C'," +
                         "   aropen_cust_id, CURRENT_DATE, aropen_amount,"     +
                         "   aropen_curr_id, NULL, NULL, 'AR Bearer',"         +
                         "   <? value('testTag') ?>, TRUE, <? value('aropen') ?>) AS checkid"   +
                         "  FROM aropen"                                       +
                         " WHERE aropen_id=<? value('aropen') ?>;",
                         { bankaccntid: bankaccnt.bankaccnt_id,
                           aropen:      aropen.id,
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
          archeck = res.rows[0];
          done();
        });
      });
    });

    it('posts the archeck', function (done) {
      var sql = mqlToSql(postCheckSql, { id: archeck.checkhead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert(res.rows[0].result > 0);
        archeck.journalNumber = res.rows[0].result;
        done();
      });
    });

    it('marks the archeck as cleared', function (done) {
      var sql = mqlToSql(toggleCheckSql, { bankrecid: bankrec.bankrec_id,
                                           checkid:   archeck.checkhead_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result);
        done();
      });
    });

    it('confirms the archeck was marked as cleared', function (done) {
      var sql = mqlToSql(bankRecItemSql,
        { brid: bankrec.bankrec_id, src: 'GL',
          srcid: " IN (SELECT gltrans_id FROM gltrans WHERE"  +
                 " gltrans_doctype='CK' AND gltrans_misc_id=" +
                 archeck.checkhead_id + ")"});
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
    
    it('looks at the gltrans table before posting', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
        lastGltransCount = res.rows.length;
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

    // we expect the reconcile to create gltrans records for voitem tax
    it('confirms reconcile updated gltrans properly', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
// TODO assert(res.rows.length > lastGltransCount, 'expected new gltrans');
        lastGltransCount = res.rows.length;
        done();
      });
    });

    it('confirms reconcile updated taxhist properly', function (done) {
      var sql = mqlToSql(taxhistCheckSql, { voitem: voitem.voitem_id });
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1, "expect 1 taxhist record for the voitem");
        assert.closeTo(-res.rows[0].taxhist_basis, po.amount, closeEnough);
        assert.closeTo(-res.rows[0].taxhist_tax,   po.tax,    closeEnough);
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
// TODO assert(res.rows.length > lastGltransCount, 'expected new gltrans');
        lastGltransCount = res.rows.length;
        done();
      });
    });

    it('confirms reconcile updated taxhist properly', function (done) {
      var sql = mqlToSql(taxhistCheckSql, { voitem: voitem.voitem_id });
      datasource.query(sql, creds, function (err, res) {
// TODO assert.equal(res.rowCount, 2, "expect 2 taxhist record for the voitem");
        assert.closeTo(-res.rows[0].taxhist_basis, po.amount, closeEnough);
        assert.closeTo(-res.rows[0].taxhist_tax,   po.tax,    closeEnough);
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

    // we expect the reconcile to create gltrans records for voitem tax
    it('confirms 2nd reconcile updated gltrans properly', function (done) {
      var sql = mqlToSql(gltransCheckSql, { testTag: testTag });
      datasource.query(sql, creds, function (err, res) {
// TODO assert(res.rows.length > lastGltransCount, 'expected new gltrans');
        lastGltransCount = res.rows.length;
        done();
      });
    });

    it('confirms 2nd reconcile updated taxhist properly', function (done) {
      var sql = mqlToSql(taxhistCheckSql, { voitem: voitem.voitem_id });
      datasource.query(sql, creds, function (err, res) {
// TODO assert.equal(res.rowCount, 3, "expect 3 taxhist record for the voitem");
        assert.closeTo(-res.rows[0].taxhist_basis, po.amount, closeEnough);
        assert.closeTo(-res.rows[0].taxhist_tax,   po.tax,    closeEnough);
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
