CREATE OR REPLACE FUNCTION invScrap(INTEGER, NUMERIC, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN invScrap($1, $2, $3, $4, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION invScrap(INTEGER, NUMERIC, TEXT, TEXT, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN invScrap($1, $2, $3, $4, $5, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION invScrap(INTEGER, NUMERIC, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN invScrap($1, $2, $3, $4, $5, $6, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION invScrap(INTEGER, NUMERIC, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pDocumentNumber ALIAS FOR $3;
  pComments ALIAS FOR $4;
  pGlDistTS ALIAS FOR $5;
  pInvHistId ALIAS FOR $6;
  pPrjid ALIAS FOR $7;
  _invhistid INTEGER;
  _itemlocSeries INTEGER;

BEGIN

--  Make sure the passed itemsite points to a real item
  IF ( ( SELECT (item_type IN ('R', 'F') OR itemsite_costmethod = 'J')
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

  IF (pInvHistId IS NOT NULL) THEN
    SELECT invhist_series INTO _itemlocSeries
    FROM invhist
    WHERE invhist_id=pInvHistId;
  ELSE
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  END IF;
  
  SELECT postInvTrans( itemsite_id, 'SI', pQty,
                       'I/M', 'SI', pDocumentNumber, '',
                       CASE WHEN (pQty < 0) THEN ('Reverse Material Scrap for item ' || item_number || E'\n' ||  pComments)
                            ELSE ('Material Scrap for item ' || item_number || E'\n' ||  pComments)
                       END,
                       getPrjAccntId(pPrjid, costcat_scrap_accnt_id), costcat_asset_accnt_id,
                       _itemlocSeries, pGlDistTS, NULL, pInvHistId) INTO _invhistid
  FROM itemsite, item, costcat
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_costcat_id=costcat_id)
   AND (itemsite_id=pItemsiteid) );

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
