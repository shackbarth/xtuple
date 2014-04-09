CREATE OR REPLACE FUNCTION checkDetailFormatted(INTEGER, INTEGER) RETURNS SETOF checkdata
AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCheckheadid ALIAS FOR $1;
  pMaxLines ALIAS FOR $2;
  _row checkdata%ROWTYPE;
  _checkhead RECORD;
  _checkdetail RECORD;
  _rowcount INTEGER := 0;
  _page INTEGER := 1;
  _docnumber TEXT := '';
  _docreference TEXT := '';
  _docdate TEXT := '';
  _docamount TEXT := '';
  _docdiscount TEXT := '';
  _docnetamount TEXT := '';
BEGIN

-- Check header information
  SELECT checkhead_number AS checknumber,
         INITCAP(spellAmount(checkhead_amount, curr_id)) AS checkwords,
         formatDate(checkhead_checkdate) AS checkdate,
         formatMoney(checkhead_amount) AS checkamount,
         curr_symbol AS checkcurrsymbol,
         curr_abbr AS checkcurrabbr,
         curr_name AS checkcurrname,
         CASE WHEN checkhead_recip_type = 'C' THEN (SELECT cust_name
                                                      FROM custinfo
                                                     WHERE cust_id=checkhead_recip_id)
              WHEN checkhead_recip_type = 'T' THEN (SELECT taxauth_name
                                                      FROM taxauth
                                                     WHERE taxauth_id=checkhead_recip_id)
              WHEN checkhead_recip_type = 'V' THEN
                                  COALESCE((SELECT vendaddr_name
                                              FROM vendaddrinfo
                                             WHERE((UPPER(vendaddr_code)='REMIT')
                                               AND (vendaddr_vend_id=checkhead_recip_id))),
                                           (SELECT vend_name
                                              FROM vendinfo
                                             WHERE(vend_id=checkhead_recip_id)))
         END AS checkpayto,
         formatAddr(CASE WHEN checkhead_recip_type = 'C' THEN
                                                  (SELECT cntct_addr_id
                                                   FROM cntct, custinfo
                                                    WHERE((cust_cntct_id=cntct_id)
                                                      AND (cust_id=checkhead_recip_id)))
                         WHEN checkhead_recip_type = 'T' THEN 
                                                  (SELECT taxauth_addr_id
                                                     FROM taxauth
                                                    WHERE(taxauth_id=checkhead_recip_id))
                         WHEN checkhead_recip_type = 'V' THEN
                                 COALESCE((SELECT vendaddr_addr_id
                                             FROM vendaddrinfo
                                            WHERE((UPPER(vendaddr_code)='REMIT')
                                              AND (vendaddr_vend_id=checkhead_recip_id))),
                                          (SELECT vend_addr_id
                                             FROM vendinfo
                                            WHERE(vend_id=checkhead_recip_id)))
                    END) AS checkaddress,
         checkhead_for AS checkmemo
    INTO _checkhead
    FROM checkhead, curr_symbol
   WHERE((checkhead_curr_id = curr_id)
     AND (checkhead_id=pCheckheadid) );
  IF (NOT FOUND) THEN
    RETURN;
  END IF;

  _row.checkdata_page := _page;
  _row.checkdata_checknumber := _checkhead.checknumber;
  _row.checkdata_checkwords := _checkhead.checkwords;
  _row.checkdata_checkdate := _checkhead.checkdate;
  _row.checkdata_checkamount := _checkhead.checkamount;
  _row.checkdata_checkcurrsymbol := _checkhead.checkcurrsymbol;
  _row.checkdata_checkcurrabbr := _checkhead.checkcurrabbr;
  _row.checkdata_checkcurrname := _checkhead.checkcurrname;
  _row.checkdata_checkpayto := _checkhead.checkpayto;
  _row.checkdata_checkaddress := _checkhead.checkaddress;
  _row.checkdata_checkmemo := _checkhead.checkmemo;

-- Check item details
  FOR _checkdetail IN 
  SELECT  --VOUCHER-------------
    1 AS ord,
    1 AS sequence_value,
    checkitem_invcnumber,
    checkitem_ponumber,
    formatMoney(checkitem_amount) AS docnetamount,
    'Invoice#: ' || vohead_invcnumber AS docnumber,
    formatDate(vohead_docdate) AS docdate,
    vohead_reference AS docreference,
    'Voucher: ' || checkitem_vouchernumber AS vouchernumber,
    formatMoney(apopen_amount) AS docamount,
    formatMoney(checkitem_discount) AS docdiscount
  FROM checkitem, vohead, apopen
  WHERE ((checkitem_checkhead_id=pCheckheadid)
    AND  (checkitem_vouchernumber = vohead_number)
    AND  (apopen_docnumber = checkitem_vouchernumber)
    AND  (apopen_doctype = 'V'))
  
  UNION
  
  SELECT --DEBIT MEMO -------------------------
    2 AS ord,
    1 AS sequence_value,
    checkitem_invcnumber,
    checkitem_ponumber,
    formatMoney(checkitem_amount) AS f_amount,
    'Debit Memo PO#: ' || checkitem_ponumber AS doc_number,
    ''  AS f_docdate,
    'Debit Memo: ' || checkitem_vouchernumber AS doc_reference,
    checkitem_vouchernumber AS vouchernumber,
    formatMoney(apopen_amount) AS amount,
    formatMoney(checkitem_discount) AS disc_cred
  FROM checkitem, apopen
  WHERE ((checkitem_checkhead_id=pCheckheadid)
    AND  (checkitem_apopen_id = apopen_id)
    AND  (apopen_doctype = 'D'))
  
  UNION
  
  SELECT --CREDIT MEMO -------------------------
    2 AS ord,
    1 AS sequence_value,
    checkitem_invcnumber,
    checkitem_ponumber,
    formatMoney(checkitem_amount * -1.0) AS f_amount,
    'Credit Memo PO#: ' || checkitem_ponumber AS doc_number,
    ''  AS f_docdate,
    'Credit Memo: ' || checkitem_vouchernumber AS doc_reference,
    checkitem_vouchernumber AS vouchernumber,
    '' AS amount,
    formatMoney(checkitem_amount) AS disc_cred
  FROM checkitem, apopen
  WHERE ((checkitem_checkhead_id=pCheckheadid)
    AND  (checkitem_apopen_id = apopen_id)
    AND  (apopen_doctype = 'C'))
  
  UNION
  
  SELECT --CREDITs FOR VOUCHERS-----------------
    3 AS ord,
    1 AS sequence_value,
    checkitem_invcnumber,
    checkitem_ponumber,
    formatMoney(checkitem_amount) AS f_amount,
    'Invoice#: ' || vohead_invcnumber AS doc_number,
    formatDate(vohead_docdate) AS f_docdate,
    'Credit Applied: ' || apapply_source_doctype || ' ' ||
                          apapply_source_docnumber AS doc_reference,
    'Voucher: ' || checkitem_vouchernumber AS vouchernumber,
    '' AS amount,
    formatMoney((apapply_amount)) AS disc_cred
  FROM checkitem, vohead, apapply
  WHERE ((checkitem_checkhead_id=pCheckheadid)
    AND  (checkitem_vouchernumber = vohead_number)
    AND  (apapply_target_docnumber = checkitem_vouchernumber)
    AND  (apapply_target_doctype = 'V')
    AND  (apapply_source_doctype = 'C'))
  
  UNION 
  
  SELECT --CREDITs FOR DEBIT MEMOS-----------
    3 AS ord,
    1 AS sequence_value,
    checkitem_invcnumber,
    checkitem_ponumber,
    formatMoney(checkitem_amount) AS f_amount,
    'Debit Memo PO#: ' || checkitem_ponumber AS doc_number,
    '' AS f_docdate,
    'Credit Applied: ' || apapply_source_doctype || ' ' ||
                          apapply_source_docnumber AS doc_reference,
    'Debit Memo: ' || checkitem_vouchernumber AS vouchernumber,
    '' AS amount,
    formatMoney((apapply_amount)) AS disc_cred
  FROM checkitem, apopen, apapply
  WHERE ((checkitem_checkhead_id=pCheckheadid)
    AND  (checkitem_vouchernumber = apopen_docnumber)
    AND  (apopen_doctype = 'D')
    AND  (apapply_target_docnumber = checkitem_vouchernumber)
    AND  (apapply_target_doctype = 'D')
    AND  (apapply_source_doctype = 'C'))
  
  UNION 
  
  SELECT --NON-VENDOR-----------------------
    4 AS ord,
    1 AS sequence_value,
    checkitem_invcnumber,
    checkitem_ponumber,
    formatMoney(checkitem_amount) AS f_amount,
    checkitem_invcnumber AS doc_number,
    formatDate(checkitem_docdate) AS f_docdate,
    '' AS doc_reference,
    '' AS vouchernumber,
    '' AS amount,
    '' AS disc_cred
  FROM checkhead LEFT OUTER JOIN
       checkitem ON (checkitem_checkhead_id=checkhead_id)
  WHERE ((checkhead_id=pCheckheadid) 
    AND  (checkhead_recip_type != 'V')) LOOP
    IF (_rowcount = pMaxLines) THEN
      _row.checkdata_docnumber := _docnumber;
      _row.checkdata_docreference := _docreference;
      _row.checkdata_docdate := _docdate;
      _row.checkdata_docamount := _docamount;
      _row.checkdata_docdiscount := _docdiscount;
      _row.checkdata_docnetamount := _docnetamount;
      RETURN NEXT _row;

-- update/reset some variables
      _rowcount = 0;
      _page := _page + 1;
      _docnumber := '';
      _docreference := '';
      _docdate := '';
      _docamount := '';
      _docdiscount := '';
      _docnetamount := '';

      _row.checkdata_page := _page;
      _row.checkdata_checknumber := _checkhead.checknumber;
      _row.checkdata_checkwords := 'VOID VOID PAGE '||_page||' OF CHECK #'||_checkhead.checknumber||' VOID VOID';
      _row.checkdata_checkdate := 'VOID VOID VOID';
      _row.checkdata_checkamount := 'VOID VOID VOID';
      --_row.checkdata_checkcurrsymbol := _checkhead.checkcurrsymbol;
      --_row.checkdata_checkcurrabbr := _checkhead.checkcurrabbr;
      --_row.checkdata_checkcurrname := _checkhead.checkcurrname;
      _row.checkdata_checkpayto := 'VOID VOID VOID';
      --_row.checkdata_checkaddress := _checkhead.checkaddress;
      _row.checkdata_checkmemo := 'VOID VOID PAGE '||_page||' OF CHECK #'||_checkhead.checknumber||' VOID VOID';
    END IF;

    _rowcount := _rowcount + 1;
    _docnumber := _docnumber || _checkdetail.docnumber || E'\n';
    _docreference := _docreference || _checkdetail.docreference || E'\n';
    _docdate := _docdate || _checkdetail.docdate || E'\n';
    _docamount := _docamount || _checkdetail.docamount || E'\n';
    _docdiscount := _docdiscount || _checkdetail.docdiscount || E'\n';
    _docnetamount := _docnetamount || _checkdetail.docnetamount || E'\n';
  END LOOP;

  _row.checkdata_docnumber := _docnumber;
  _row.checkdata_docreference := _docreference;
  _row.checkdata_docdate := _docdate;
  _row.checkdata_docamount := _docamount;
  _row.checkdata_docdiscount := _docdiscount;
  _row.checkdata_docnetamount := _docnetamount;

  RETURN NEXT _row;
  RETURN;
END;
$$
LANGUAGE 'plpgsql';

