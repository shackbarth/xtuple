CREATE OR REPLACE FUNCTION updateItemSiteLeadTime(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pPad ALIAS FOR $2;
  _p RECORD;
  _materialLeadTime INTEGER;
  _productionLeadTime INTEGER;
  _leadTime INTEGER;

BEGIN

  SELECT item_type, itemsite_wosupply INTO _p
  FROM item, itemsite
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_id=pitemsiteid) );
  
  IF ( (_p.item_type IN ('M', 'P')) ) THEN

    IF (_p.item_type = 'M') THEN
      SELECT COALESCE(MAX(component.itemsite_leadtime), 0) INTO _materialLeadTime
      FROM bomitem, itemsite AS parent, itemsite AS component
      WHERE ( (bomitem_parent_item_id=parent.itemsite_item_id)
       AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
       AND (bomitem_item_id=component.itemsite_item_id)
       AND (parent.itemsite_warehous_id=component.itemsite_warehous_id)
       AND (parent.itemsite_id=pItemsiteid) );

      SELECT COALESCE(MAX(booitem_execday), 0) INTO _productionLeadTime
      FROM xtmfg.booitem, itemsite
      WHERE ( (booitem_item_id=itemsite_item_id)
       AND (booitem_rev_id=getActiveRevId('BOO',booitem_item_id))
       AND (itemsite_id=pItemsiteid) );

      _leadTime := (_materialLeadTime + _productionLeadTime + pPad);

    ELSIF (_p.item_type IN ('P')) THEN
      SELECT COALESCE(MAX(itemsrc_leadtime), 0) INTO _leadTime
      FROM itemsrc, itemsite
      WHERE ( (itemsite_item_id=itemsrc_item_id)
       AND (itemsite_id=pItemsiteid) );

      _leadTime := (_leadTime + pPad);
    END IF;

  ELSE
    _leadTime = pPad;
  END IF;

  UPDATE itemsite
  SET itemsite_leadtime=_leadTime
  WHERE (itemsite_id=pItemsiteid);

  RETURN _leadTime;

END;
$$ LANGUAGE 'plpgsql';
