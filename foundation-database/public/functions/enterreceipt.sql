CREATE OR REPLACE FUNCTION enterReceipt(TEXT, INTEGER, NUMERIC, NUMERIC, TEXT, INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN enterReceipt($1, $2, $3, $4, $5, $6, $7, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION enterReceipt(TEXT, INTEGER, NUMERIC, NUMERIC, TEXT, INTEGER, DATE, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pordertype	ALIAS FOR $1;
  porderitemid	ALIAS FOR $2;
  pQty		ALIAS FOR $3;
  pFreight	ALIAS FOR $4;
  pNotes	ALIAS FOR $5;
  pcurrid	ALIAS FOR $6;	-- NULL is handled by SELECT ... INTO _o
  precvdate	ALIAS FOR $7;	-- NULL is handled by INSERT INTO recv
  pRecvCost	ALIAS FOR $8;
  _timestamp    TIMESTAMP;
  _o		RECORD;
  _recvid	INTEGER;
  _warehouseid 	INTEGER;
  _recvcost	NUMERIC;

BEGIN
  IF(precvdate IS NULL OR precvdate = CURRENT_DATE) THEN
    _timestamp := CURRENT_TIMESTAMP;
  ELSE
    _timestamp := precvdate;
  END IF;
  SELECT NEXTVAL('recv_recv_id_seq') INTO _recvid;

  DELETE FROM recv
  WHERE ((NOT recv_posted)
    AND  (recv_order_type=pordertype)
    AND  (recv_orderitem_id=porderitemid) );

  IF (pQty > 0) THEN
    IF (pordertype='PO') THEN
      SELECT pohead_number AS orderhead_number,
  	   poitem_id AS orderitem_id,
	   pohead_agent_username AS orderhead_agent_username,
	   CASE WHEN (poitem_itemsite_id = -1) THEN NULL
		ELSE poitem_itemsite_id
	   END AS itemsite_id,
	   vend_id,
	   COALESCE(poitem_vend_item_number, '') AS vend_item_number,
	   COALESCE(poitem_vend_item_descrip, '') AS vend_item_descrip,
	   COALESCE(poitem_vend_uom, '') AS vend_uom,
	   poitem_duedate AS duedate,
	   poitem_unitprice AS orderitem_unitcost,
	   pohead_curr_id AS orderitem_unitcost_curr_id,
	   pohead_curr_id AS freight_curr_id,
	   poitem_rlsd_duedate AS rlsd_duedate INTO _o
        FROM pohead
          JOIN poitem ON (pohead_id=poitem_pohead_id)
          JOIN vendinfo ON (pohead_vend_id=vend_id)
        WHERE (poitem_id=porderitemid);
        
    ELSIF (pordertype='RA') THEN
       SELECT rahead_number AS orderhead_number,
  	   raitem_id AS orderitem_id,
	   ''::text AS orderhead_agent_username,
	   raitem_itemsite_id AS itemsite_id,
	   NULL::integer AS vend_id,
	   ''::text AS vend_item_number,
	   ''::text AS vend_item_descrip,
	   ''::text AS vend_uom,
	   raitem_scheddate AS duedate,
	   raitem_unitprice AS orderitem_unitcost,
	   rahead_curr_id AS orderitem_unitcost_curr_id,
	   rahead_curr_id AS freight_curr_id,
           raitem_scheddate AS rlsd_duedate INTO _o
        FROM rahead
          JOIN raitem ON (rahead_id=raitem_rahead_id)
        WHERE (raitem_id=porderitemid);
        
    ELSIF (pordertype='TO') THEN
         SELECT tohead_number AS orderhead_number,
  	   toitem_id AS orderitem_id,
	   tohead_agent_username AS orderhead_agent_username,
	   itemsite_id,
	   NULL::integer AS vend_id,
	   ''::text AS vend_item_number,
	   ''::text AS vend_item_descrip,
	   ''::text AS vend_uom,
	   toitem_duedate AS duedate,
	   toitem_stdcost AS orderitem_unitcost,
	   baseCurrId() AS orderitem_unitcost_curr_id,
	   toitem_freight_curr_id AS freight_curr_id,
           toitem_duedate AS rlsd_duedate INTO _o
        FROM itemsite, tohead
          JOIN toitem ON (tohead_id=toitem_tohead_id)
        WHERE ((toitem_id=porderitemid)
          AND  (tohead_dest_warehous_id=itemsite_warehous_id)
          AND  (toitem_item_id=itemsite_item_id));
    END IF;

    --Make sure user has site privileges
     IF ((FOUND) AND (_o.itemsite_id IS NOT NULL)) THEN
       SELECT warehous_id INTO _warehouseid
       FROM itemsite,site()
       WHERE ((itemsite_id=_o.itemsite_id)
         AND (warehous_id=itemsite_warehous_id));
          
       IF (NOT FOUND) THEN
         RETURN 0;
        END IF;
      END IF;   

    --Make sure we aren't trying to receive a Kit
    IF ((FOUND) AND (_o.itemsite_id IS NOT NULL)) THEN
      IF (SELECT (item_type='K')
          FROM itemsite, item
          WHERE ((itemsite_id=_o.itemsite_id)
            AND  (item_id=itemsite_item_id))) THEN
        RETURN 0;
      END IF;
    END IF;   

    IF (NOT FOUND) THEN
      RETURN -1;
    END IF;

    -- default to orderitem_unitcost if recv_purchcost is not specified
    IF(pRecvCost IS NULL) THEN
      _recvcost := _o.orderitem_unitcost;
    ELSE
      _recvcost := pRecvCost;
    END IF;

    INSERT INTO recv
    ( recv_id, recv_date,
      recv_order_number, recv_order_type, recv_orderitem_id,
      recv_trans_usr_name, recv_agent_username, recv_itemsite_id,
      recv_vend_id, recv_vend_item_number, recv_vend_item_descrip,
      recv_vend_uom, recv_qty, recv_duedate,
      recv_purchcost, recv_purchcost_curr_id,
      recv_notes, recv_freight, recv_freight_curr_id, recv_rlsd_duedate
    ) VALUES (
      _recvid, _timestamp,
      _o.orderhead_number, pordertype, _o.orderitem_id::INTEGER,
      getEffectiveXtUser(), _o.orderhead_agent_username, _o.itemsite_id::INTEGER,
      _o.vend_id::INTEGER, _o.vend_item_number, _o.vend_item_descrip,
      _o.vend_uom, pQty, _o.duedate,
      _recvcost, _o.orderitem_unitcost_curr_id::INTEGER,
      pNotes, pFreight, _o.freight_curr_id::INTEGER, _o.rlsd_duedate);
  END IF;

  RETURN _recvid;

END;
$$ LANGUAGE 'plpgsql';
