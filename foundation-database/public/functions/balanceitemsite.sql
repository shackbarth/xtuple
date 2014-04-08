CREATE OR REPLACE FUNCTION balanceItemsite(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  _itemlocseries INTEGER;
  _balanced NUMERIC;
  _qoh NUMERIC;
  _nnQoh NUMERIC;

BEGIN

--  Make sure that that passed Itemsite is MLC or Lot/Serial controlled
  IF ( ( SELECT (NOT ( (itemsite_loccntrl) OR (itemsite_controlmethod IN ('L', 'S')) ))
         FROM itemsite
         WHERE (itemsite_id=pItemsiteid) ) ) THEN
    RETURN 0;
  END IF;

  IF ( ( SELECT itemsite_freeze
           FROM itemsite
          WHERE(itemsite_id=pItemsiteid) ) ) THEN
    RETURN -1;
  END IF;

--  Calculate the Netable portion
  SELECT COALESCE(SUM(itemloc_qty), 0) INTO _balanced
  FROM itemloc LEFT OUTER JOIN location ON (itemloc_location_id=location_id)
  WHERE ( ( (location_id IS NULL) OR (location_netable) )
   AND (itemloc_itemsite_id=pItemsiteid) );

--  Post an AD Transaction for the Netable portion
  SELECT invAdjustment( itemsite_id, (_balanced - itemsite_qtyonhand),
                        'Balance', 'Inventory Balance' ) INTO _itemlocseries
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid);

--  Post the invtrans records associated with the itemlocdist records
  PERFORM postInvhist(itemlocdist_invhist_id)
     FROM itemlocdist
    WHERE(itemlocdist_series=_itemlocseries);

--  Kill the resultant distribution records
  DELETE FROM itemlocdist
  WHERE (itemlocdist_series=_itemlocseries);

--  Calculate and write the Non-Netable portion directly
  SELECT COALESCE(SUM(itemloc_qty), 0) INTO _nnQoh
  FROM itemloc, location
  WHERE ( (itemloc_location_id=location_id)
   AND (NOT location_netable)
   AND (itemloc_itemsite_id=pItemsiteid) );

  UPDATE itemsite
  SET itemsite_nnqoh = _nnQoh
  WHERE (itemsite_id=pItemsiteid);

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
