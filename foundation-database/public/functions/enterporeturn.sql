CREATE OR REPLACE FUNCTION enterPoReturn(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN enterPoReturn($1, $2, $3, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION enterPoReturn(INTEGER, NUMERIC, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoitemid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pRjctcodeid ALIAS FOR $3;
  pRecvid ALIAS FOR $4;
  _porejectid INTEGER;

BEGIN

  SELECT NEXTVAL('poreject_poreject_id_seq') INTO _porejectid;

  INSERT INTO poreject
  ( poreject_id, poreject_date, poreject_ponumber, poreject_poitem_id, poreject_trans_username,
    poreject_agent_username, poreject_itemsite_id,
    poreject_vend_id, poreject_vend_item_number, poreject_vend_item_descrip, poreject_vend_uom,
    poreject_qty, poreject_rjctcode_id, poreject_posted, poreject_invoiced, poreject_recv_id )
  SELECT _porejectid, CURRENT_TIMESTAMP, pohead_number, poitem_id, getEffectiveXtUser(),
         pohead_agent_username, poitem_itemsite_id,
         pohead_vend_id, poitem_vend_item_number, poitem_vend_item_descrip, poitem_vend_uom,
         pQty, pRjctcodeid, FALSE, FALSE, pRecvid
  FROM poitem JOIN pohead ON (pohead_id=poitem_pohead_id)
  WHERE (poitem_id=pPoitemid);

  RETURN _porejectid;

END;
$$ LANGUAGE 'plpgsql';
