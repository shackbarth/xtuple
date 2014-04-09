CREATE OR REPLACE FUNCTION selectforbilling(integer, numeric, boolean)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoitemid	ALIAS FOR $1;
  pQty	ALIAS FOR $2;
  pClose	ALIAS FOR $3;
  _itemid	INTEGER := NULL;
  _taxzoneid	INTEGER := NULL;
  _taxid	INTEGER := NULL;
  _taxtypeid	INTEGER := NULL;

BEGIN
  SELECT cobmisc_taxzone_id,  item_id, coitem_taxtype_id
  INTO _taxzoneid,  _itemid, _taxtypeid
  FROM cobmisc, coitem, itemsite, item
  WHERE ((cobmisc_cohead_id = coitem_cohead_id)
  AND   (NOT cobmisc_posted)
  AND   (coitem_itemsite_id = itemsite_id)
  AND   (itemsite_item_id = item_id)
  AND   (coitem_id = pSoitemid) )
  LIMIT 1;

   RETURN selectforbilling(pSoitemid, pQty, pClose, _taxtypeid);
END;
$BODY$ LANGUAGE 'plpgsql' VOLATILE;

---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION selectforbilling(integer, numeric, boolean, integer)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoitemid	ALIAS FOR $1;
  pQty		ALIAS FOR $2;
  pClose	ALIAS FOR $3;
  ptaxtypeid	ALIAS FOR $4;
  _cobillid INTEGER;
  _r RECORD;

BEGIN

-- Get some information
  SELECT cobmisc_id, cobmisc_taxzone_id, coitem_id, coitem_price,
    coitem_price_invuomratio AS invpricerat, coitem_qty_invuomratio, item_id
  INTO _r
  FROM cobmisc, coitem, itemsite, item, site()
  WHERE ((cobmisc_cohead_id = coitem_cohead_id)
  AND   (NOT cobmisc_posted)
  AND   (coitem_itemsite_id = itemsite_id)
  AND   (itemsite_item_id = item_id)
  AND   (coitem_id = pSoitemid)
  AND   (itemsite_warehous_id = warehous_id) )
  LIMIT 1;

-- check to make sure the qty to bill for is not less than
-- the total un-invoiced shipped amount
  IF ((SELECT (pQty < SUM(shipitem_qty))
       FROM shipitem, shiphead, coitem
       WHERE ( (shipitem_shiphead_id=shiphead_id)
       AND (shiphead_order_type='SO')
       AND (shiphead_order_id=coitem_cohead_id)
       AND (shipitem_orderitem_id=coitem_id)
       AND (shiphead_shipped)
       AND (NOT shipitem_invoiced)
       AND (coitem_id=pSoitemid) ) ) ) THEN
    RETURN -1;
  END IF;

  SELECT cobill_id INTO _cobillid
  FROM cobill, cobmisc, coitem
  WHERE ((cobill_cobmisc_id = cobmisc_id)
  AND (cobmisc_cohead_id = coitem_cohead_id)
  AND (cobill_coitem_id = coitem_id)
  AND (NOT cobmisc_posted)
  AND (coitem_id = pSoitemid));

  IF (FOUND) THEN
    UPDATE cobill
    SET cobill_selectdate = CURRENT_DATE,
        cobill_select_username = getEffectiveXtUser(),
        cobill_qty = pQty,
        cobill_toclose = pClose,
	cobill_taxtype_id = ptaxtypeid
    WHERE (cobill_id=_cobillid);

  ELSE
    SELECT NEXTVAL('cobill_cobill_id_seq') INTO _cobillid;
    INSERT INTO cobill
    (cobill_id, cobill_coitem_id, cobill_cobmisc_id,
     cobill_selectdate, cobill_select_username,
     cobill_qty, cobill_toclose,
     cobill_taxtype_id)
    VALUES
    (_cobillid, _r.coitem_id, _r.cobmisc_id,
      CURRENT_DATE, getEffectiveXtUser(),
      pQty, pClose,
      ptaxtypeid);
  END IF;

  RETURN _cobillid;

END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
