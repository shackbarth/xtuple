SELECT dropIfExists('FUNCTION', 'araging(date)', 'public');
CREATE OR REPLACE FUNCTION araging(date, boolean) RETURNS SETOF araging AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAsOfDate ALIAS FOR $1;
  pUseDocDate ALIAS FOR $2;
  _row araging%ROWTYPE;

BEGIN

  FOR _row IN SELECT *
            FROM araging(pAsOfDate, pUseDocDate, true)
  LOOP
    RETURN NEXT _row;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION araging(date, boolean, boolean) RETURNS SETOF araging AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAsOfDate ALIAS FOR $1;
  pUseDocDate ALIAS FOR $2;
  pConvBaseCurr ALIAS FOR $3;
  _row araging%ROWTYPE;
  _x RECORD;
  _returnVal INTEGER;
  _asOfDate DATE;
BEGIN

  _asOfDate := COALESCE(pAsOfDate,current_date);

  FOR _x IN
        SELECT
        aropen_docdate,
        aropen_duedate,
        aropen_ponumber,
        aropen_docnumber,
        aropen_doctype,
        cust_id,
        cust_name,
        cust_number,
        cust_custtype_id,
        custtype_code,
        terms_descrip,

        --if pConvBaseCurr is true then use currtobase to convert all amounts to base based on aropen_docdate to ensure the same exchange rate
        --otherwise use currtocurr to convert all amounts to customer's currency based on aropen_docdate to ensure the same exchange rate

        --today and greater:
        CASE WHEN((aropen_duedate >= DATE(_asOfDate))) THEN balance
             ELSE 0.0 END AS cur_val,

        --0 to 30
        CASE WHEN((aropen_duedate >= DATE(_asOfDate)-30) AND (aropen_duedate < DATE(_asOfDate))) THEN balance
             ELSE 0.0 END AS thirty_val,

        --30-60
        CASE WHEN((aropen_duedate >= DATE(_asOfDate)-60) AND (aropen_duedate < DATE(_asOfDate) - 30 )) THEN balance
             ELSE 0.0 END AS sixty_val,

        --60-90
        CASE WHEN((aropen_duedate >= DATE(_asOfDate)-90) AND (aropen_duedate < DATE(_asOfDate) - 60)) THEN balance
             ELSE 0.0 END AS ninety_val,

        --greater than 90:
        CASE WHEN((aropen_duedate > DATE(_asOfDate)-10000) AND (aropen_duedate < DATE(_asOfDate) - 90)) THEN balance
             ELSE 0.0 END AS plus_val,

        --total amount:
        CASE WHEN((aropen_duedate > DATE(_asOfDate)-10000)) THEN balance
             ELSE 0.0 END AS total_val,

        --AR Open Amount base
        aropen_amount

        FROM (
          SELECT
          (((aropen_amount - aropen_paid + COALESCE(SUM(arapply_target_paid),0))) /
             CASE WHEN (pConvBaseCurr) THEN aropen_curr_rate
                  ELSE currRate(aropen_curr_id, cust_curr_id, aropen_docdate)
             END *
             CASE WHEN (aropen_doctype IN ('C', 'R')) THEN -1.0
                  ELSE 1.0
             END) AS balance,
          ((aropen_amount) /
             CASE WHEN (pConvBaseCurr) THEN aropen_curr_rate
                  ELSE currRate(aropen_curr_id, cust_curr_id, aropen_docdate)
             END *
             CASE WHEN (aropen_doctype IN ('C', 'R')) THEN -1.0
                  ELSE 1.0
             END) AS aropen_amount,
          aropen_docdate,
          aropen_duedate,
          aropen_ponumber,
          aropen_docnumber,
          aropen_doctype,
          cust_id,
          cust_name,
          cust_number,
          cust_custtype_id,
          custtype_code,
          COALESCE(arterms.terms_descrip, custterms.terms_descrip, '') AS terms_descrip

          FROM aropen
            JOIN custinfo ON (cust_id=aropen_cust_id)
            JOIN custtype ON (custtype_id=cust_custtype_id)
            LEFT OUTER JOIN terms arterms ON (arterms.terms_id=aropen_terms_id)
            LEFT OUTER JOIN terms custterms ON (custterms.terms_id=cust_terms_id)
            LEFT OUTER JOIN arapply ON (((aropen_id=arapply_target_aropen_id)
                                      OR (aropen_id=arapply_source_aropen_id))
                                     AND (arapply_distdate>_asOfDate))
          WHERE ( (CASE WHEN (pUseDocDate) THEN aropen_docdate ELSE aropen_distdate END <= _asOfDate)
          AND (COALESCE(aropen_closedate,_asOfDate+1)>_asOfDate) )
          GROUP BY aropen_id,aropen_docdate,aropen_duedate,aropen_ponumber,aropen_docnumber,aropen_doctype,aropen_paid,
                   aropen_curr_id,aropen_amount,cust_id,cust_name,cust_number,cust_custtype_id,custtype_code,
                   arterms.terms_descrip,custterms.terms_descrip, aropen_curr_rate, aropen_curr_id, cust_curr_id
          ORDER BY cust_number, aropen_duedate ) AS data
  LOOP
        _row.araging_docdate := _x.aropen_docdate;
        _row.araging_duedate := _x.aropen_duedate;
        _row.araging_ponumber := _x.aropen_ponumber;
        _row.araging_docnumber := _x.aropen_docnumber;
        _row.araging_doctype := _x.aropen_doctype;
        _row.araging_cust_id := _x.cust_id;
        _row.araging_cust_number := _x.cust_number;
        _row.araging_cust_name := _x.cust_name;
        _row.araging_cust_custtype_id := _x.cust_custtype_id;
        _row.araging_custtype_code := _x.custtype_code;
        _row.araging_terms_descrip := _x.terms_descrip;
        _row.araging_aropen_amount := _x.aropen_amount;
        _row.araging_cur_val := _x.cur_val;
        _row.araging_thirty_val := _x.thirty_val;
        _row.araging_sixty_val := _x.sixty_val;
        _row.araging_ninety_val := _x.ninety_val;
        _row.araging_plus_val := _x.plus_val;
        _row.araging_total_val := _x.total_val;
        RETURN NEXT _row;
  END LOOP;
  RETURN;
END;
$$ LANGUAGE 'plpgsql';
