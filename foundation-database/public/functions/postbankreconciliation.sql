
CREATE OR REPLACE FUNCTION postBankReconciliation(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankrecid ALIAS FOR $1;
  _accntid INTEGER;
  _sequence INTEGER;
  _gltransid INTEGER;
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

-- Delete any bankrecitem records that are not marked as cleared for cleanliness
  DELETE FROM bankrecitem
   WHERE ( (NOT bankrecitem_cleared)
     AND   (bankrecitem_bankrec_id=pBankrecid) );

-- Post any bankadj items that were marked as cleared and convert the bankrecitem
  FOR _r IN SELECT bankrecitem_id, bankrecitem_source_id
              FROM bankrecitem, bankadj
             WHERE ( (bankrecitem_source = 'AD')
               AND   (bankrecitem_source_id=bankadj_id)
               AND   (bankrecitem_cleared)
               AND   (NOT bankadj_posted)
               AND   (bankrecitem_bankrec_id=pBankrecid) ) LOOP

    SELECT postBankAdjustment(_r.bankrecitem_source_id) INTO _sequence;

    IF (_sequence < 0) THEN
      RETURN -10;
    END IF;

    SELECT gltrans_id INTO _gltransid
      FROM gltrans
     WHERE ( (gltrans_sequence=_sequence)
       AND   (gltrans_accnt_id=_accntid) );
    IF ( NOT FOUND ) THEN
      RETURN -11;
    END IF;

    UPDATE bankrecitem
       SET bankrecitem_source = 'GL',
           bankrecitem_source_id=_gltransid
     WHERE (bankrecitem_id=_r.bankrecitem_id);

  END LOOP;

  IF (fetchMetricBool('CashBasedTax')) THEN
    -- Cash based tax distributions
    -- GL Transactions
    FOR _r IN SELECT *
              FROM bankrecitem
             WHERE ( (bankrecitem_source = 'GL')
               AND   (bankrecitem_cleared)
               AND   (bankrecitem_bankrec_id=pBankrecid) ) LOOP
      -- first, debit the tax liability clearing account
      -- and credit the tax liability distribution account
      -- for each tax code
      FOR _tax IN SELECT docnumber, custname, gltrans_date,
                         tax_sales_accnt_id, tax_dist_accnt_id,
                         ROUND(currToBase(currid, ROUND(SUM(taxhist_tax),2), taxhist_docdate) * percentpaid, 2) AS taxbasevalue
                  FROM (SELECT invchead_invcnumber AS docnumber, invchead_billto_name AS custname,
                               invchead_curr_id AS currid, gltrans_date,
                               (cashrcptitem_amount / calcInvoiceAmt(invchead_id)) AS percentpaid,
                               tax_sales_accnt_id, tax_dist_accnt_id,
                               taxhist_tax, taxhist_docdate
                        FROM gltrans JOIN cashrcpt  ON ((gltrans_source='A/R')
                                                    AND (gltrans_doctype='CR')
                                                    AND (gltrans_misc_id=cashrcpt_id))
                                     JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                                     JOIN aropen ON (aropen_id=cashrcptitem_aropen_id)
                                     JOIN invchead ON (invchead_invcnumber=aropen_docnumber)
                                     JOIN cohist ON (cohist_invcnumber=invchead_invcnumber AND cohist_doctype='I')
                                     JOIN cohisttax ON (taxhist_parent_id=cohist_id)
                                     JOIN tax ON (tax_id=taxhist_tax_id)
                        WHERE (gltrans_id=_r.bankrecitem_source_id)) AS data
                  GROUP BY docnumber, custname, currid, gltrans_date, percentpaid,
                           tax_sales_accnt_id, tax_dist_accnt_id, taxhist_docdate
      LOOP
        RAISE NOTICE 'Posting GL Series for Document %', _tax.docnumber;
        PERFORM insertIntoGLSeries( _sequence, 'A/R', 'CR', _tax.docnumber,
                                    _tax.tax_dist_accnt_id, 
                                    _tax.taxbasevalue,
                                    COALESCE(_r.bankrecitem_effdate, _tax.gltrans_date), _tax.custname );
        PERFORM insertIntoGLSeries( _sequence, 'A/R', 'CR', _tax.docnumber,
                                    _tax.tax_sales_accnt_id, 
                                    (_tax.taxbasevalue * -1.0),
                                    COALESCE(_r.bankrecitem_effdate, _tax.gltrans_date), _tax.custname );
      END LOOP;

      -- second, create a taxpay row for each taxhist
      FOR _tax IN SELECT *,
                         ROUND(taxhist_tax * percentpaid, 2) AS taxpaid
                  FROM (SELECT *,
                               (cashrcptitem_amount / calcInvoiceAmt(invchead_id)) AS percentpaid
                          FROM gltrans JOIN cashrcpt  ON ((gltrans_source='A/R')
                                                      AND (gltrans_doctype='CR')
                                                      AND (gltrans_misc_id=cashrcpt_id))
                                       JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                                       JOIN aropen ON (aropen_id=cashrcptitem_aropen_id)
                                       JOIN invchead ON (invchead_invcnumber=aropen_docnumber)
                                       JOIN cohist ON (cohist_invcnumber=invchead_invcnumber AND cohist_doctype='I')
                                       JOIN cohisttax ON (taxhist_parent_id=cohist_id)
                          WHERE (gltrans_id=_r.bankrecitem_source_id)) AS data
      LOOP
        INSERT INTO taxpay
        ( taxpay_taxhist_id, taxpay_apply_id, taxpay_distdate, taxpay_tax )
        VALUES
        ( _tax.taxhist_id, _tax.aropen_id, COALESCE(_r.bankrecitem_effdate, _tax.gltrans_date), _tax.taxpaid );
      END LOOP;

    END LOOP;

    PERFORM postGLSeries(_sequence, fetchJournalNumber('GL-MISC'));

  END IF;


-- Mark all the gltrans items that have been cleared as reconciled.
  UPDATE gltrans
     SET gltrans_rec = TRUE
   WHERE ( (gltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'GL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (gltrans_accnt_id=_accntid) ) ;

-- Mark all the sltrans items that have been cleared as reconciled.
  UPDATE sltrans
     SET sltrans_rec = TRUE
   WHERE ( (sltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'SL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (sltrans_accnt_id=_accntid) ) ;

-- Mark the bankrec record as posted
  UPDATE bankrec SET 
    bankrec_posted = TRUE,
    bankrec_postdate = now()
   WHERE (bankrec_id=pBankrecid);

  RETURN pBankrecid;
END;
$$ LANGUAGE 'plpgsql';

