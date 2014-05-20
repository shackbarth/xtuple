
CREATE OR REPLACE FUNCTION reopenBankReconciliation(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankrecid ALIAS FOR $1;
  _bankrecid INTEGER;
  _accntid INTEGER;
  _sequence INTEGER;
  _gltransid INTEGER;
  _result INTEGER;
  _r RECORD;
  _tax RECORD;

BEGIN

-- Check the accnt information to make sure it is valid
  SELECT accnt_id INTO _accntid
    FROM bankrec, bankaccnt, accnt
   WHERE ( (bankaccnt_accnt_id=accnt_id)
     AND   (bankrec_bankaccnt_id=bankaccnt_id)
     AND   (bankrec_id=pBankrecid) );
  IF ( NOT FOUND ) THEN
    RETURN -1;
  END IF;

  SELECT bankrec_id INTO _bankrecid
    FROM bankrec
   WHERE (NOT bankrec_posted);
  IF (FOUND) THEN
  -- Delete any bankrecitem records for unposted periods
    DELETE FROM bankrecitem
     WHERE (bankrecitem_bankrec_id=_bankrecid);
  -- Delete any bankrec records for unposted period
    DELETE FROM bankrec
     WHERE (bankrec_id=_bankrecid);
  END IF;

  IF (fetchMetricBool('CashBasedTax')) THEN
    -- Cash based tax distributions
    -- GL Transactions
    SELECT fetchGLSequence() INTO _sequence;
    FOR _r IN SELECT *
              FROM bankrecitem
             WHERE ( (bankrecitem_cleared)
               AND   (bankrecitem_bankrec_id=pBankrecid) ) LOOP
      -- first, debit the tax liability clearing account
      -- and credit the tax liability distribution account
      -- for each tax code
      FOR _tax IN SELECT docnumber, custname, distdate, source, doctype,
                         tax_sales_accnt_id, tax_dist_accnt_id,
                         ROUND(currToBase(currid, ROUND(SUM(taxhist_tax),2), taxhist_docdate) * percentpaid, 2) AS taxbasevalue
                  FROM (
                        -- Cash receipt, gltrans
                        SELECT aropen_docnumber AS docnumber, cust_name AS custname,
                               aropen_curr_id AS currid, gltrans_date AS distdate,
                               (cashrcptitem_amount / aropen_amount) AS percentpaid,
                               gltrans_source AS source, gltrans_doctype AS doctype,
                               tax_sales_accnt_id, tax_dist_accnt_id,
                               taxhist_tax, taxhist_docdate
                        FROM gltrans JOIN cashrcpt  ON ((gltrans_source='A/R')
                                                    AND (gltrans_doctype='CR')
                                                    AND (gltrans_misc_id=cashrcpt_id))
                                     JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                                     JOIN aropen ON (aropen_id=cashrcptitem_aropen_id)
                                     JOIN custinfo ON (cust_id=aropen_cust_id)
                                     JOIN cohist ON (cohist_invcnumber=aropen_docnumber AND cohist_doctype=aropen_doctype)
                                     JOIN cohisttax ON (taxhist_parent_id=cohist_id)
                                     JOIN tax ON (tax_id=taxhist_tax_id)
                        WHERE (gltrans_id=_r.bankrecitem_source_id)
                        -- Cash receipt, sltrans
                        UNION
                        SELECT aropen_docnumber AS docnumber, cust_name AS custname,
                               aropen_curr_id AS currid, sltrans_date AS distdate,
                               (cashrcptitem_amount / aropen_amount) AS percentpaid,
                               sltrans_source AS source, sltrans_doctype AS doctype,
                               tax_sales_accnt_id, tax_dist_accnt_id,
                               taxhist_tax, taxhist_docdate
                        FROM sltrans JOIN cashrcpt  ON ((sltrans_source='A/R')
                                                    AND (sltrans_doctype='CR')
                                                    AND (sltrans_misc_id=cashrcpt_id))
                                     JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                                     JOIN aropen ON (aropen_id=cashrcptitem_aropen_id)
                                     JOIN custinfo ON (cust_id=aropen_cust_id)
                                     JOIN cohist ON (cohist_invcnumber=aropen_docnumber AND cohist_doctype=aropen_doctype)
                                     JOIN cohisttax ON (taxhist_parent_id=cohist_id)
                                     JOIN tax ON (tax_id=taxhist_tax_id)
                        WHERE (sltrans_id=_r.bankrecitem_source_id)
                        -- Cash payment, gltrans
                        UNION
                        SELECT apopen_docnumber AS docnumber, vend_name AS vendname,
                               apopen_curr_id AS currid, gltrans_date AS distdate,
                               (vohead_amount / apopen_amount) AS percentpaid,
                               gltrans_source AS source, gltrans_doctype AS doctype,
                               tax_sales_accnt_id, tax_dist_accnt_id,
                               taxhist_tax, taxhist_docdate
                        FROM gltrans JOIN checkhead ON ((gltrans_source='A/P')
                                                    AND (gltrans_doctype='CK')
                                                    AND (gltrans_misc_id=checkhead_id))
                                     JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                     JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                     JOIN vohead ON (vohead_number=apopen_docnumber)
                                     JOIN vendinfo ON (vend_id=apopen_vend_id)
                                     JOIN voheadtax ON (taxhist_parent_id=vohead_id)
                                     JOIN tax ON (tax_id=taxhist_tax_id)
                        WHERE (gltrans_id=_r.bankrecitem_source_id)
                        UNION
                        SELECT apopen_docnumber AS docnumber, vend_name AS vendname,
                               apopen_curr_id AS currid, gltrans_date AS distdate,
                               (vohead_amount / apopen_amount) AS percentpaid,
                               gltrans_source AS source, gltrans_doctype AS doctype,
                               tax_sales_accnt_id, tax_dist_accnt_id,
                               taxhist_tax, taxhist_docdate
                        FROM gltrans JOIN checkhead ON ((gltrans_source='A/P')
                                                    AND (gltrans_doctype='CK')
                                                    AND (gltrans_misc_id=checkhead_id))
                                     JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                     JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                     JOIN vohead ON (vohead_number=apopen_docnumber)
                                     JOIN vendinfo ON (vend_id=apopen_vend_id)
                                     JOIN voitem ON (voitem_vohead_id=vohead_id)
                                     JOIN voitemtax ON (taxhist_parent_id=voitem_id)
                                     JOIN tax ON (tax_id=taxhist_tax_id)
                        WHERE (gltrans_id=_r.bankrecitem_source_id)
                        -- Cash payment, sltrans
                        UNION
                        SELECT apopen_docnumber AS docnumber, vend_name AS vendname,
                               apopen_curr_id AS currid, sltrans_date AS distdate,
                               (vohead_amount / apopen_amount) AS percentpaid,
                               sltrans_source AS source, sltrans_doctype AS doctype,
                               tax_sales_accnt_id, tax_dist_accnt_id,
                               taxhist_tax, taxhist_docdate
                        FROM sltrans JOIN checkhead ON ((sltrans_source='A/P')
                                                    AND (sltrans_doctype='CK')
                                                    AND (sltrans_misc_id=checkhead_id))
                                     JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                     JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                     JOIN vohead ON (vohead_number=apopen_docnumber)
                                     JOIN vendinfo ON (vend_id=apopen_vend_id)
                                     JOIN voheadtax ON (taxhist_parent_id=vohead_id)
                                     JOIN tax ON (tax_id=taxhist_tax_id)
                        WHERE (sltrans_id=_r.bankrecitem_source_id)
                        UNION
                        SELECT apopen_docnumber AS docnumber, vend_name AS vendname,
                               apopen_curr_id AS currid, sltrans_date AS distdate,
                               (vohead_amount / apopen_amount) AS percentpaid,
                               sltrans_source AS source, sltrans_doctype AS doctype,
                               tax_sales_accnt_id, tax_dist_accnt_id,
                               taxhist_tax, taxhist_docdate
                        FROM sltrans JOIN checkhead ON ((sltrans_source='A/P')
                                                    AND (sltrans_doctype='CK')
                                                    AND (sltrans_misc_id=checkhead_id))
                                     JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                     JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                     JOIN vohead ON (vohead_number=apopen_docnumber)
                                     JOIN vendinfo ON (vend_id=apopen_vend_id)
                                     JOIN voitem ON (voitem_vohead_id=vohead_id)
                                     JOIN voitemtax ON (taxhist_parent_id=voitem_id)
                                     JOIN tax ON (tax_id=taxhist_tax_id)
                        WHERE (sltrans_id=_r.bankrecitem_source_id)
                       ) AS data
                  GROUP BY docnumber, custname, currid, distdate, percentpaid,
                           source, doctype,
                           tax_sales_accnt_id, tax_dist_accnt_id, taxhist_docdate
      LOOP
        SELECT insertIntoGLSeries( _sequence, _tax.source, _tax.doctype, _tax.docnumber,
                                   _tax.tax_dist_accnt_id, 
                                   (_tax.taxbasevalue * -1.0),
                                   COALESCE(_r.bankrecitem_effdate, _tax.distdate), _tax.custname ) INTO _result;
        IF (_result < 0) THEN
          RAISE EXCEPTION 'insertIntoGLSeries failed, result=%', _result;
        END IF;
        SELECT insertIntoGLSeries( _sequence, _tax.source, _tax.doctype, _tax.docnumber,
                                   _tax.tax_sales_accnt_id, 
                                   _tax.taxbasevalue,
                                   COALESCE(_r.bankrecitem_effdate, _tax.distdate), _tax.custname ) INTO _result;
        IF (_result < 0) THEN
          RAISE EXCEPTION 'insertIntoGLSeries failed, result=%', _result;
        END IF;
      END LOOP;

      -- second, create a taxpay row for each taxhist
      FOR _tax IN SELECT taxhist_id, applyid, distdate,
                         ROUND(taxhist_tax * percentpaid, 2) AS taxpaid
                  FROM (
                        -- Cash receipt, gltrans
                        SELECT taxhist_id, aropen_id AS applyid, gltrans_date AS distdate, taxhist_tax,
                               (cashrcptitem_amount / aropen_amount) AS percentpaid
                          FROM gltrans JOIN cashrcpt  ON ((gltrans_source='A/R')
                                                      AND (gltrans_doctype='CR')
                                                      AND (gltrans_misc_id=cashrcpt_id))
                                       JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                                       JOIN aropen ON (aropen_id=cashrcptitem_aropen_id)
                                       JOIN cohist ON (cohist_invcnumber=aropen_docnumber AND cohist_doctype=aropen_doctype)
                                       JOIN cohisttax ON (taxhist_parent_id=cohist_id)
                          WHERE (gltrans_id=_r.bankrecitem_source_id)
                        -- Cash receipt, sltrans
                        UNION
                        SELECT taxhist_id, aropen_id AS applyid, sltrans_date AS distdate, taxhist_tax,
                               (cashrcptitem_amount / aropen_amount) AS percentpaid
                          FROM sltrans JOIN cashrcpt  ON ((sltrans_source='A/R')
                                                      AND (sltrans_doctype='CR')
                                                      AND (sltrans_misc_id=cashrcpt_id))
                                       JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                                       JOIN aropen ON (aropen_id=cashrcptitem_aropen_id)
                                       JOIN cohist ON (cohist_invcnumber=aropen_docnumber AND cohist_doctype=aropen_doctype)
                                       JOIN cohisttax ON (taxhist_parent_id=cohist_id)
                          WHERE (sltrans_id=_r.bankrecitem_source_id)
                        -- Cash payment, gltrans
                        UNION
                        SELECT taxhist_id, apopen_id AS applyid, gltrans_date AS distdate, taxhist_tax,
                               (checkitem_amount / apopen_amount) AS percentpaid
                          FROM gltrans JOIN checkhead  ON ((gltrans_source='A/P')
                                                       AND (gltrans_doctype='CK')
                                                       AND (gltrans_misc_id=checkhead_id))
                                       JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                       JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                       JOIN vohead ON (vohead_number=apopen_docnumber)
                                       JOIN voheadtax ON (taxhist_parent_id=vohead_id)
                          WHERE (gltrans_id=_r.bankrecitem_source_id)
                        UNION
                        SELECT taxhist_id, apopen_id AS applyid, gltrans_date AS distdate, taxhist_tax,
                               (checkitem_amount / apopen_amount) AS percentpaid
                          FROM gltrans JOIN checkhead  ON ((gltrans_source='A/P')
                                                       AND (gltrans_doctype='CK')
                                                       AND (gltrans_misc_id=checkhead_id))
                                       JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                       JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                       JOIN vohead ON (vohead_number=apopen_docnumber)
                                       JOIN voitem ON (voitem_vohead_id=vohead_id)
                                       JOIN voitemtax ON (taxhist_parent_id=voitem_id)
                          WHERE (gltrans_id=_r.bankrecitem_source_id)
                        -- Cash payment, sltrans
                        UNION
                        SELECT taxhist_id, apopen_id AS applyid, sltrans_date AS distdate, taxhist_tax,
                               (checkitem_amount / apopen_amount) AS percentpaid
                          FROM sltrans JOIN checkhead  ON ((sltrans_source='A/P')
                                                       AND (sltrans_doctype='CK')
                                                       AND (sltrans_misc_id=checkhead_id))
                                       JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                       JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                       JOIN vohead ON (vohead_number=apopen_docnumber)
                                       JOIN voheadtax ON (taxhist_parent_id=vohead_id)
                          WHERE (sltrans_id=_r.bankrecitem_source_id)
                        UNION
                        SELECT taxhist_id, apopen_id AS applyid, sltrans_date AS distdate, taxhist_tax,
                               (checkitem_amount / apopen_amount) AS percentpaid
                          FROM sltrans JOIN checkhead  ON ((sltrans_source='A/P')
                                                       AND (sltrans_doctype='CK')
                                                       AND (sltrans_misc_id=checkhead_id))
                                       JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                       JOIN apopen ON (apopen_id=checkitem_apopen_id)
                                       JOIN vohead ON (vohead_number=apopen_docnumber)
                                       JOIN voitem ON (voitem_vohead_id=vohead_id)
                                       JOIN voitemtax ON (taxhist_parent_id=voitem_id)
                          WHERE (sltrans_id=_r.bankrecitem_source_id)
                       ) AS data
      LOOP
        DELETE FROM taxpay
        WHERE (taxpay_taxhist_id=_tax.taxhist_id)
          AND (taxpay_apply_id=_tax.applyid)
          AND (taxpay_distdate=COALESCE(_r.bankrecitem_effdate, _tax.distdate))
          AND (taxpay_tax=_tax.taxpaid);
      END LOOP;

    END LOOP;

    SELECT postGLSeries(_sequence, fetchJournalNumber('GL-MISC')) INTO _result;
    IF (_result < 0) THEN
      RAISE EXCEPTION 'postGLSeries failed, result=%', _result;
    END IF;

  END IF;

-- Mark all the gltrans items that have been cleared as unreconciled.
  UPDATE gltrans
     SET gltrans_rec = FALSE
   WHERE ( (gltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'GL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (gltrans_accnt_id=_accntid) ) ;

-- Mark all the sltrans items that have been cleared as unreconciled.
  UPDATE sltrans
     SET sltrans_rec = FALSE
   WHERE ( (sltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'SL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (sltrans_accnt_id=_accntid) ) ;

-- Mark the bankrec record as unposted
  UPDATE bankrec SET 
    bankrec_posted = FALSE,
    bankrec_postdate = NULL
   WHERE (bankrec_id=pBankrecid);

  RETURN pBankrecid;
END;
$$ LANGUAGE 'plpgsql';

