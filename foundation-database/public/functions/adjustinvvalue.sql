CREATE OR REPLACE FUNCTION adjustInvValue(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid     ALIAS FOR $1;
  pNewValue       ALIAS FOR $2;
  pAccountid      ALIAS FOR $3;
  _delta          NUMERIC;
  _glreturn       INTEGER;
  _invhistid      INTEGER;
  _itemlocSeries  INTEGER;

BEGIN

  SELECT pNewValue - itemsite_value INTO _delta
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid)
  FOR UPDATE;

  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT insertGLTransaction('I/M', '', 'Post Value',
         'Inventory Value Adjustment for ' || item_number,
         COALESCE (pAccountid, costcat_adjustment_accnt_id),
         costcat_asset_accnt_id, -1,
         _delta, CURRENT_DATE) INTO _glreturn
  FROM itemsite
   JOIN costcat ON (itemsite_costcat_id=costcat_id)
   JOIN item ON (itemsite_item_id=item_id)
  WHERE (itemsite_id=pItemsiteid);

--  Create the AD transaction
  INSERT INTO invhist
   ( invhist_itemsite_id,
     invhist_transdate, invhist_transtype, invhist_invqty,
     invhist_qoh_before, invhist_qoh_after,
     invhist_docnumber, invhist_comments,
     invhist_invuom, invhist_unitcost, invhist_hasdetail,
     invhist_costmethod, invhist_value_before, invhist_value_after,
     invhist_series )
  SELECT itemsite_id,
         CURRENT_TIMESTAMP, 'AD', 0.0,
         itemsite_qtyonhand, itemsite_qtyonhand,
         '', 'Inventory Value Adjustment',
         uom_name, _delta, FALSE,
         itemsite_costmethod, itemsite_value, pNewValue,
         0
  FROM itemsite, item, uom
  WHERE ( (itemsite_item_id=item_id)
   AND (item_inv_uom_id=uom_id)
   AND (itemsite_id=pItemsiteid) );

  UPDATE itemsite SET itemsite_value=pNewValue
  WHERE (itemsite_id=pItemsiteid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
