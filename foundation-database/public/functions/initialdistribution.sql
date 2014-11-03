CREATE OR REPLACE FUNCTION initialDistribution(pItemsiteid INTEGER,
                                               pLocationid INTEGER) RETURNS INTEGER  AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _itemlocid INTEGER;
  _invhistid INTEGER;
  _itemlocSeries INTEGER;
  _r RECORD;

BEGIN

--  Make sure the passed itemsite points to a real item
  IF ( (SELECT (item_type IN ('R', 'F') OR itemsite_costmethod = 'J')
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

  _itemlocSeries := NEXTVAL('itemloc_series_seq');

--  Reassign the location_id for all existing itemlocs if
--  the passed itemsite is already lot/serial controlled
  IF ( ( SELECT (itemsite_controlmethod IN ('L', 'S'))
         FROM itemsite
         WHERE (itemsite_id=pItemsiteid) ) ) THEN

    FOR _r IN SELECT itemloc_id, itemloc_ls_id, itemloc_qty
              FROM itemloc
              WHERE (itemloc_itemsite_id=pItemsiteid) LOOP

--  Create the RL transaction
      SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;
      INSERT INTO invhist
      ( invhist_id, invhist_itemsite_id, invhist_series,
        invhist_transtype, invhist_invqty,
        invhist_qoh_before, invhist_qoh_after,
        invhist_comments,
        invhist_invuom, invhist_unitcost, invhist_hasdetail,
        invhist_costmethod, invhist_value_before, invhist_value_after ) 
      SELECT _invhistid, itemsite_id, _itemlocSeries,
             'RL', 0,
             _r.itemloc_qty, _r.itemloc_qty,
             'Initial Distribution',
             uom_name, stdCost(item_id), TRUE,
             itemsite_costmethod, itemsite_value, itemsite_value
      FROM item, itemsite, uom
      WHERE ( (itemsite_item_id=item_id)
       AND (item_inv_uom_id=uom_id)
       AND (itemsite_controlmethod <> 'N')
       AND (itemsite_id=pItemsiteid) );

--  Update the itemloc
      UPDATE itemloc
      SET itemloc_location_id=pLocationid
      WHERE (itemloc_id=_r.itemloc_id);

--  Record the detail transaction
      INSERT INTO invdetail
      ( invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
        invdetail_qty, invdetail_qty_before, invdetail_qty_after )
      VALUES
      ( _invhistid, pLocationid, _r.itemloc_ls_id,
        _r.itemloc_qty, 0, _r.itemloc_qty );

    END LOOP;

  ELSE
--  The passed itemsite is not lot/serial controlled
--  Make sure that there are not any stagnent itemlocs
    DELETE FROM itemloc
    WHERE (itemloc_itemsite_id=pItemsiteid);

--  Create the RL transaction
    SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;
    INSERT INTO invhist
    ( invhist_id, invhist_itemsite_id, invhist_series,
      invhist_transtype, invhist_invqty,
      invhist_qoh_before, invhist_qoh_after,
      invhist_comments,
      invhist_invuom, invhist_unitcost, invhist_hasdetail,
      invhist_costmethod, invhist_value_before, invhist_value_after  ) 
    SELECT _invhistid, itemsite_id, _itemlocSeries,
           'RL', 0,
           itemsite_qtyonhand, itemsite_qtyonhand,
           'Initial Distribution',
           uom_name, stdCost(item_id), TRUE,
           itemsite_costmethod, itemsite_value, itemsite_value
    FROM item, itemsite, uom
    WHERE ( (itemsite_item_id=item_id)
     AND (item_inv_uom_id=uom_id)
     AND (itemsite_controlmethod <> 'N')
     AND (itemsite_id=pItemsiteid) );

--  Create the itemloc
    SELECT NEXTVAL('itemloc_itemloc_id_seq') INTO _itemlocid;
    INSERT INTO itemloc
    ( itemloc_id, itemloc_itemsite_id, itemloc_location_id,
      itemloc_expiration, itemloc_qty )
    SELECT _itemlocid, itemsite_id, pLocationid,
           endOfTime(), itemsite_qtyonhand
    FROM itemsite
    WHERE (itemsite_id=pItemsiteid);

--  Record the detail transaction
    INSERT INTO invdetail
    ( invdetail_invhist_id, invdetail_location_id,
      invdetail_qty, invdetail_qty_before, invdetail_qty_after )
    SELECT _invhistid, pLocationid,
           itemsite_qtyonhand, 0, itemsite_qtyonhand
    FROM itemsite
    WHERE (itemsite_id=pItemsiteid);

  END IF;

  RETURN _itemlocid;

END;
$$ LANGUAGE plpgsql;
