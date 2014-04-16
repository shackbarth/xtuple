CREATE OR REPLACE FUNCTION replaceVoidedCheck(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCheckid	ALIAS FOR $1;
  _newCheckid	INTEGER;

BEGIN
  IF ( ( SELECT ( (NOT checkhead_void) OR checkhead_posted OR checkhead_replaced )
         FROM checkhead
         WHERE (checkhead_id=pCheckid) ) ) THEN
    RETURN -1;
  END IF;

  -- has someone created a new check for one of the items while this was void?
  IF EXISTS (SELECT dup.checkitem_id
             FROM checkitem orig, checkitem dup, checkhead AS duphead
             WHERE ((COALESCE(orig.checkitem_aropen_id,-1)=COALESCE(dup.checkitem_aropen_id,-1))
                AND (COALESCE(orig.checkitem_apopen_id,-1)=COALESCE(dup.checkitem_apopen_id,-1))
                AND (orig.checkitem_checkhead_id!=dup.checkitem_checkhead_id)
                AND (dup.checkitem_checkhead_id=duphead.checkhead_id)
                AND (NOT duphead.checkhead_void)
                AND (orig.checkitem_checkhead_id=pCheckid))) THEN
    RETURN -2;
  END IF;

  SELECT NEXTVAL('checkhead_checkhead_id_seq') INTO _newCheckid;

  INSERT INTO checkhead
  ( checkhead_id, checkhead_recip_id, checkhead_recip_type,
    checkhead_bankaccnt_id, checkhead_checkdate,
    checkhead_number, checkhead_amount,
    checkhead_for, checkhead_journalnumber,
    checkhead_notes,
    checkhead_misc, checkhead_expcat_id, checkhead_curr_id )
  SELECT _newCheckid, checkhead_recip_id, checkhead_recip_type,
	 checkhead_bankaccnt_id, checkhead_checkdate,
	 -1, -- fetchNextCheckNumber(checkhead_bankaccnt_id),
         checkhead_amount,
	 checkhead_for, checkhead_journalnumber,
         checkhead_notes || '
Replaces voided check ' || checkhead_number,
	 checkhead_misc, checkhead_expcat_id, checkhead_curr_id
  FROM checkhead
  WHERE (checkhead_id=pCheckid);

  INSERT INTO checkitem
  ( checkitem_checkhead_id, checkitem_amount, checkitem_discount,
    checkitem_ponumber, checkitem_vouchernumber, checkitem_invcnumber,
    checkitem_apopen_id, checkitem_aropen_id,
    checkitem_docdate, checkitem_curr_id, checkitem_curr_rate )
  SELECT _newCheckid, checkitem_amount, checkitem_discount,
         checkitem_ponumber, checkitem_vouchernumber, checkitem_invcnumber,
	 checkitem_apopen_id, checkitem_aropen_id,
	 checkitem_docdate, checkitem_curr_id, checkitem_curr_rate
  FROM checkitem
  WHERE (checkitem_checkhead_id=pCheckid);

  UPDATE checkhead
  SET checkhead_replaced=TRUE
  WHERE (checkhead_id=pCheckid);

  RETURN _newCheckid;

END;
$$ LANGUAGE 'plpgsql';
