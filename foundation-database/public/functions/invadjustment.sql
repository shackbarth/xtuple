CREATE OR REPLACE FUNCTION invAdjustment(INTEGER, NUMERIC, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN invAdjustment($1, $2, $3, $4, CURRENT_TIMESTAMP, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION invAdjustment(INTEGER, NUMERIC, TEXT, TEXT, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN invAdjustment($1, $2, $3, $4, $5, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION invAdjustment(INTEGER, NUMERIC, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid     ALIAS FOR $1;
  pQty            ALIAS FOR $2;
  pDocumentNumber ALIAS FOR $3;
  pComments       ALIAS FOR $4;
  pGlDistTS       ALIAS FOR $5;
  pCostValue      ALIAS FOR $6;
  _invhistid      INTEGER;
  _itemlocSeries  INTEGER;

BEGIN

--  Make sure the passed itemsite points to a real item
  IF ( ( SELECT (item_type IN ('R', 'F') OR itemsite_costmethod = 'J')
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

  SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  SELECT postInvTrans( itemsite_id, 'AD', pQty,
                       'I/M', 'AD', pDocumentNumber, '',
                       ('Miscellaneous Adjustment for item ' || item_number || E'\n' ||  pComments),
                       costcat_asset_accnt_id, costcat_adjustment_accnt_id,
                       _itemlocSeries, pGlDistTS, pCostValue) INTO _invhistid
  FROM itemsite, item, costcat
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_costcat_id=costcat_id)
   AND (itemsite_id=pItemsiteid) );

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
