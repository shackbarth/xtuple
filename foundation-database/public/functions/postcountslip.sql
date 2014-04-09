CREATE OR REPLACE FUNCTION postCountSlip(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCntslipid ALIAS FOR $1;
  _p RECORD;
  _comments TEXT;
  _temp TEXT;

BEGIN

  SELECT itemsite_loccntrl, itemsite_controlmethod,
         cntslip_posted, cntslip_lotserial, cntslip_comments,
         cntslip_number, cntslip_qty INTO _p
  FROM cntslip, invcnt, itemsite
  WHERE ( (cntslip_cnttag_id=invcnt_id)
   AND (invcnt_itemsite_id=itemsite_id)
   AND (cntslip_id=pCntslipid) );

  IF (NOT _p.cntslip_posted) THEN
    SELECT ( E'\nCount Slip #' || _p.cntslip_number ||
             ' counted ' || formatQty(_p.cntslip_qty) ) INTO _comments;

--  Add the Location name if the itemsite is MLC
    IF (_p.itemsite_loccntrl) THEN
      SELECT ( ', Location:' || location_name ) INTO _temp
      FROM location, cntslip
      WHERE ( (cntslip_location_id=location_id)
       AND (cntslip_id=pCntslipid) );

      _comments := (_comments || _temp);
    END IF;

--  Add the Lot/Serial if the itemsite is Lot or Serial controlled
    IF (_p.itemsite_controlmethod = 'L') THEN
      _comments := (_comments || ( ', Lot #:' || _p.cntslip_lotserial));
    ELSIF (_p.itemsite_controlmethod = 'S') THEN
      _comments := (_comments || ( ', Serial #:' || _p.cntslip_lotserial));
    END IF;

    _comments := (_comments || ' ' || _p.cntslip_comments);

    UPDATE cntslip
    SET cntslip_posted=TRUE
    WHERE (cntslip_id=pCntslipid);

    UPDATE invcnt
    SET invcnt_qoh_after = ( COALESCE(invcnt_qoh_after, 0) + cntslip_qty),
        invcnt_comments = (invcnt_comments || _comments)
    FROM cntslip
    WHERE ( (cntslip_cnttag_id=invcnt_id)
     AND (cntslip_id=pCntslipid) );

    RETURN 1;

  ELSE
    RETURN -1;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
