CREATE OR REPLACE FUNCTION resetQOHBalance(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN resetQOHBalance($1, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION resetQOHBalance(INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid   ALIAS FOR $1;
  pGlDistTS     ALIAS FOR $2;
  _invhistid    INTEGER;
  _itemlocSeries INTEGER;

BEGIN

  IF ( ( SELECT ( (itemsite_controlmethod IN ('L', 'S')) OR
                  (item_type = 'R') OR
                  (itemsite_costmethod = 'J') OR
                  (itemsite_loccntrl) OR
                  (itemsite_qtyonhand > 0) )
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

  _itemlocSeries := NEXTVAL('itemloc_series_seq');

  SELECT postInvTrans( itemsite_id, 'AD', (itemsite_qtyonhand * -1),
                       'I/M', '', '', 'RESET',
                       'Reset QOH Balance to 0',
                       costcat_asset_accnt_id, costcat_adjustment_accnt_id,
                       _itemlocSeries, pGlDistTS ) INTO _invhistid
  FROM itemsite, costcat
  WHERE ( (itemsite_costcat_id=costcat_id)
   AND (itemsite_id=pItemsiteid) );

  PERFORM postItemLocSeries(_itemlocSeries);

  RETURN _invhistid;

END;
$$ LANGUAGE 'plpgsql';
