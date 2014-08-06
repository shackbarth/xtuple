
CREATE OR REPLACE FUNCTION importBankrecCleared(pBankrecid INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cleared BOOLEAN;
  _b RECORD;
  _r RECORD;

BEGIN
  -- cache some information
  SELECT * INTO _b
  FROM bankrec JOIN bankaccnt ON (bankaccnt_id=bankrec_bankaccnt_id)
  WHERE (bankrec_id=pBankrecid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'bankrec not found';
  END IF;
  IF (_b.bankrec_posted) THEN
    RAISE EXCEPTION 'bankrec already posted';
  END IF;

  -- loop thru bankrecimport and toggle cleared items
  FOR _r IN
  SELECT *,
         COALESCE(bankrecimport_debit_amount, 0.0) AS debit,
         COALESCE(bankrecimport_credit_amount, 0.0) AS credit
  FROM bankrecimport
--  WHERE (bankrecimport_?=_b.bankaccnt=?)
  LOOP

    IF ( (_r.debit > 0.0) AND (_r.credit > 0.0) ) THEN
      RAISE EXCEPTION 'cannot determine if debit or credit';
    END IF;

    IF (_r.debit > 0.0) THEN
      -- check receipts
      SELECT gltrans_id AS id, 1 AS altid,
             jrnluse_use AS use, gltrans_journalnumber AS jrnlnum,
             COALESCE(date(jrnluse_date), gltrans_date) AS f_jrnldate,
             COALESCE(bankrecitem_cleared, FALSE) AS cleared,
             COALESCE(bankrecitem_effdate, gltrans_date) AS f_date,
             gltrans_doctype AS doc_type,
             gltrans_docnumber AS docnumber,
             gltrans_notes AS notes,
             currConcat(COALESCE(cashrcpt_curr_id, baseCurrId())) AS doc_curr,
             COALESCE(bankrecitem_curr_rate, cashrcpt_curr_rate, currRate(bankaccnt_curr_id, gltrans_date)) AS doc_exchrate,
             (gltrans_amount * -1.0) AS base_amount,
             CASE WHEN (bankaccnt_curr_id=cashrcpt_curr_id) THEN
               COALESCE( bankrecitem_amount,
                         cashrcpt_amount,
                         (currToLocal(bankaccnt_curr_id, gltrans_amount, gltrans_date) * -1.0) )
                  ELSE
               COALESCE( bankrecitem_amount,
                         (currToLocal(bankaccnt_curr_id, gltrans_amount, gltrans_date) * -1.0) )
             END AS amount,
             COALESCE(date(jrnluse_date), gltrans_date) AS jrnldate,
             gltrans_date AS sortdate
        FROM bankaccnt
        JOIN gltrans ON (bankaccnt_accnt_id=gltrans_accnt_id)
        LEFT OUTER JOIN bankrecitem ON ((bankrecitem_source='GL')
                                    AND (bankrecitem_source_id=gltrans_id)
                                    AND (bankrecitem_bankrec_id=<? value("bankrecid") ?>)
                                    AND (bankrecitem_cleared))
        LEFT OUTER JOIN jrnluse ON (jrnluse_number=gltrans_journalnumber AND jrnluse_use='C/R')
        LEFT OUTER JOIN cashrcpt  ON ((gltrans_source='A/R')
                                  AND (gltrans_doctype='CR')
                                  AND (gltrans_misc_id=cashrcpt_id))
        LEFT OUTER JOIN checkhead ON ((gltrans_doctype='CK')
                                  AND (gltrans_misc_id=checkhead_id))
       WHERE ((NOT gltrans_deleted)
         AND (NOT gltrans_rec)
         AND (NOT COALESCE(checkhead_void, false))
         AND (gltrans_amount < 0)
         AND (gltrans_doctype != 'JP')
         AND (bankaccnt_id=<? value("bankaccntid") ?>)
       )






 UNION ALL
SELECT sltrans_id AS id, 2 AS altid,
       jrnluse_use AS use, sltrans_journalnumber AS jrnlnum,
       COALESCE(date(jrnluse_date), sltrans_date) AS f_jrnldate,
       COALESCE(bankrecitem_cleared, FALSE) AS cleared,
       COALESCE(bankrecitem_effdate, sltrans_date) AS f_date,
       sltrans_doctype AS doc_type,
       sltrans_docnumber AS docnumber,
       sltrans_notes AS notes,
       currConcat(COALESCE(cashrcpt_curr_id, baseCurrId())) AS doc_curr,
       COALESCE(bankrecitem_curr_rate, cashrcpt_curr_rate, currRate(bankaccnt_curr_id, sltrans_date)) AS doc_exchrate,
       (sltrans_amount * -1.0) AS base_amount,
       CASE WHEN (bankaccnt_curr_id=cashrcpt_curr_id) THEN
         COALESCE( bankrecitem_amount,
                   cashrcpt_amount,
                   (currToLocal(bankaccnt_curr_id, sltrans_amount, sltrans_date) * -1.0) )
            ELSE
         COALESCE( bankrecitem_amount,
                   (currToLocal(bankaccnt_curr_id, sltrans_amount, sltrans_date) * -1.0) )
       END AS amount,
       COALESCE(date(jrnluse_date), sltrans_date) AS jrnldate,
       sltrans_date AS sortdate,
       'uomratio' AS doc_exchrate_xtnumericrole,
       'curr' AS base_amount_xtnumericrole,
       'curr' AS amount_xtnumericrole
  FROM bankaccnt
  JOIN sltrans ON (bankaccnt_accnt_id=sltrans_accnt_id)
  LEFT OUTER JOIN bankrecitem ON ((bankrecitem_source='SL')
                              AND (bankrecitem_source_id=sltrans_id)
                              AND (bankrecitem_bankrec_id=<? value("bankrecid") ?>)
                              AND (bankrecitem_cleared))
  LEFT OUTER JOIN jrnluse ON (jrnluse_number=sltrans_journalnumber AND jrnluse_use='C/R')
  LEFT OUTER JOIN cashrcpt  ON ((sltrans_source='A/R')
                            AND (sltrans_doctype='CR')
                            AND (sltrans_misc_id=cashrcpt_id))
  LEFT OUTER JOIN checkhead ON ((sltrans_doctype='CK')
                            AND (sltrans_misc_id=checkhead_id))
 WHERE ((NOT sltrans_rec)
   AND (NOT COALESCE(checkhead_void, false))
   AND (sltrans_amount < 0)
   AND (bankaccnt_id=<? value("bankaccntid") ?>)
<? if exists("source") ?>
   AND ('SL' = <? value("source") ?>)
<? endif ?>
<? if exists("sourceid") ?>
   AND (sltrans_id = <? value("sourceid") ?>)
<? endif ?>
 )
 UNION ALL
SELECT bankadj_id AS id, 3 AS altid,
       '' AS use, NULL AS jrnlnum, bankadj_date AS f_jrnldate,
       COALESCE(bankrecitem_cleared, FALSE) AS cleared,
       COALESCE(bankrecitem_effdate, bankadj_date) AS f_date,
       'ADJ' AS doc_type,
       bankadj_docnumber AS docnumber,
       bankadjtype_name AS notes,
       currConcat(bankadj_curr_id) AS doc_curr,
       1.0 AS doc_exchrate,
       CASE WHEN(bankadjtype_iscredit=true) THEN (bankadj_amount * -1.0) ELSE bankadj_amount END AS base_amount,
       CASE WHEN(bankadjtype_iscredit=true) THEN (bankadj_amount * -1.0) ELSE bankadj_amount END AS amount,
       bankadj_date AS jrnldate,
       bankadj_date AS sortdate,
       'uomratio' AS doc_exchrate_xtnumericrole,
       'curr' AS base_amount_xtnumericrole,
       'curr' AS amount_xtnumericrole
  FROM (bankadjtype CROSS JOIN bankadj)
               LEFT OUTER JOIN bankrecitem ON ((bankrecitem_source='AD')
                                           AND (bankrecitem_source_id=bankadj_id)
                                           AND (bankrecitem_bankrec_id=<? value("bankrecid") ?>))
 WHERE ( (((bankadjtype_iscredit=false) AND (bankadj_amount > 0)) OR ((bankadjtype_iscredit=true) AND (bankadj_amount < 0)))
   AND (bankadj_bankadjtype_id=bankadjtype_id)
   AND (NOT bankadj_posted)
   AND (bankadj_bankaccnt_id=<? value("bankaccntid") ?>)
<? if exists("source") ?>
   AND ('AD' = <? value("source") ?>)
<? endif ?>
<? if exists("sourceid") ?>
   AND (bankadj_id = <? value("sourceid") ?>)
<? endif ?>
 )
ORDER BY jrnldate, jrnlnum, sortdate;




  SELECT bankrecitem_id, bankrecitem_cleared INTO _r
    FROM bankrecitem
   WHERE ( (bankrecitem_bankrec_id=pBankrecid)
     AND   (bankrecitem_source=pSource)
     AND   (bankrecitem_source_id=pSourceid) );
  IF ( NOT FOUND ) THEN
    _cleared := TRUE;
    INSERT INTO bankrecitem
    (bankrecitem_bankrec_id, bankrecitem_source,
     bankrecitem_source_id, bankrecitem_cleared,
     bankrecitem_curr_rate, bankrecitem_amount,
     bankrecitem_effdate)
    VALUES
    (pBankrecid, pSource,
     pSourceid, _cleared,
     pCurrrate, pAmount,
     pDate);
  ELSE
    _cleared := FALSE;
    DELETE FROM bankrecitem 
    WHERE bankrecitem_id = _r.bankrecitem_id;
  END IF;

  RETURN _cleared;
END;
$$ LANGUAGE 'plpgsql';

