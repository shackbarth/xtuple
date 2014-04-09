
CREATE OR REPLACE FUNCTION orderitem() RETURNS SETOF orditem AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _row orditem%ROWTYPE;
  _query TEXT;
BEGIN

  _query := '
  SELECT poitem_id		AS orderitem_id,
	 ''PO''			AS orderitem_orderhead_type,
	 poitem_pohead_id	AS orderitem_orderhead_id,
	 poitem_linenumber	AS orderitem_linenumber,
	 poitem_status		AS orderitem_status,
	 poitem_itemsite_id	AS orderitem_itemsite_id,
	 poitem_duedate		AS orderitem_scheddate,
	 poitem_qty_ordered	AS orderitem_qty_ordered,
	 poitem_qty_returned	AS orderitem_qty_shipped,
	 poitem_qty_received	AS orderitem_qty_received,
	 uom_id			AS orderitem_qty_uom_id,
	 poitem_invvenduomratio	AS orderitem_qty_invuomratio,
	 poitem_unitprice	AS orderitem_unitcost,
	 pohead_curr_id         AS orderitem_unitcost_curr_id,
	 poitem_freight		AS orderitem_freight,
	 poitem_freight_received AS orderitem_freight_received,
	 pohead_curr_id         AS orderitem_freight_curr_id

  FROM poitem LEFT OUTER JOIN pohead ON (poitem_pohead_id=pohead_id)
              LEFT OUTER JOIN uom ON (uom_name=poitem_vend_uom)
  UNION
  SELECT coitem_id		AS orderitem_id,
	 ''SO''			AS orderitem_orderhead_type,
	 coitem_cohead_id	AS orderitem_orderhead_id,
	 coitem_linenumber	AS orderitem_linenumber,
	 coitem_status		AS orderitem_status,
	 coitem_itemsite_id	AS orderitem_itemsite_id,
	 coitem_scheddate	AS orderitem_scheddate,
	 coitem_qtyord		AS orderitem_qty_ordered,
	 coitem_qtyshipped	AS orderitem_qty_shipped,
	 coitem_qtyreturned	AS orderitem_qty_received,
	 coitem_qty_uom_id	AS orderitem_qty_uom_id,
	 coitem_qty_invuomratio	AS orderitem_qty_invuomratio,
	 coitem_unitcost	AS orderitem_unitcost,
	 basecurrid()		AS orderitem_unitcost_curr_id,
	 NULL			AS orderitem_freight,
	 NULL			AS orderitem_freight_received,
	 basecurrid()		AS orderitem_freight_curr_id
  FROM coitem';

  IF (fetchmetricbool('MultiWhs')) THEN
    _query := _query || '
    UNION
    SELECT toitem_id		AS orderitem_id,
      ''TO''			AS orderitem_orderhead_type,
      toitem_tohead_id	AS orderitem_orderhead_id,
      toitem_linenumber	AS orderitem_linenumber,
      toitem_status		AS orderitem_status,
      itemsite_id		AS orderitem_itemsite_id,
      toitem_duedate		AS orderitem_scheddate,
      toitem_qty_ordered	AS orderitem_qty_ordered,
      toitem_qty_shipped	AS orderitem_qty_shipped,
      toitem_qty_received	AS orderitem_qty_received,
      uom_id			AS orderitem_qty_uom_id,
      1			AS orderitem_qty_invuomratio,
      toitem_stdcost		AS orderitem_unitcost,
      basecurrid()		AS orderitem_unitcost_curr_id,
      toitem_freight		AS orderitem_freight,
      toitem_freight_received AS orderitem_freight_received,
      toitem_freight_curr_id	AS orderitem_freight_curr_id
    FROM tohead, itemsite, toitem LEFT OUTER JOIN uom ON (uom_name=toitem_uom)
    WHERE ((toitem_tohead_id=tohead_id)
     AND  (tohead_src_warehous_id=itemsite_warehous_id)
     AND  (toitem_item_id=itemsite_item_id)) ';
  END IF;

  IF (fetchmetricbool('EnableReturnAuth')) THEN
    _query := _query || '
    UNION
    SELECT raitem_id		AS orderitem_id,
      ''RA''			AS orderitem_orderhead_type,
      raitem_rahead_id	AS orderitem_orderhead_id,
      raitem_linenumber	AS orderitem_linenumber,
      raitem_status		AS orderitem_status,
      raitem_itemsite_id	AS orderitem_itemsite_id,
      raitem_scheddate	AS orderitem_scheddate,
      raitem_qtyauthorized	AS orderitem_qty_ordered,
      0			AS orderitem_qty_shipped,
      raitem_qtyreceived	AS orderitem_qty_received,
      raitem_qty_uom_id	AS orderitem_qty_uom_id,
      raitem_qty_invuomratio	AS orderitem_qty_invuomratio,
      raitem_unitprice	AS orderitem_unitcost,
      basecurrid()		AS orderitem_unitcost_curr_id,
      NULL			AS orderitem_freight,
      NULL			AS orderitem_freight_received,
      basecurrid()		AS orderitem_freight_curr_id
    FROM raitem';
  END IF;
  
  FOR _row IN EXECUTE _query
  LOOP
    RETURN NEXT _row;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';

