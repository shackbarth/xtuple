CREATE OR REPLACE FUNCTION balanceItemsite(pItemsiteid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _itemlocseries INTEGER;
  _balanced NUMERIC;
  _qoh NUMERIC;

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

--  Calculate the qoh
  SELECT COALESCE(SUM(itemloc_qty), 0) INTO _balanced
  FROM itemloc
  WHERE (itemloc_itemsite_id=pItemsiteid);

--  Post an AD Transaction
  SELECT invAdjustment( itemsite_id, (_balanced - itemsite_qtyonhand),
                        'Balance', 'Inventory Balance' ) INTO _itemlocseries
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid);

--  Post the itemloc series which will postIntoTrialBalance and postInvHist
  PERFORM postItemlocSeries(_itemlocseries);

--  Kill the resultant distribution records
  DELETE FROM itemlocdist
  WHERE (itemlocdist_series=_itemlocseries);

  RETURN 1;

END;
$$ LANGUAGE plpgsql;
