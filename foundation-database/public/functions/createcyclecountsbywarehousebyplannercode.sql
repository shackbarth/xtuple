CREATE OR REPLACE FUNCTION createcyclecountsbywarehousebyplannercode(integer, integer, integer, text, boolean, boolean, integer, boolean)
  RETURNS integer AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWarehousid ALIAS FOR $1;
  pPlancodeid ALIAS FOR $2;
  pMaxNumber ALIAS FOR $3;
  pComments ALIAS FOR $4;
  pPriority ALIAS FOR $5;
  pFreeze ALIAS FOR $6;
  pLocationid ALIAS FOR $7;
  pIgnoreZeroBalance ALIAS FOR $8;
  _itemsites RECORD;
  _returnVal	INTEGER;
  
BEGIN

IF (pLocationid IS NULL) THEN
  FOR _itemsites IN SELECT itemsite_id, itemsite_warehous_id, itemsite_qtyonhand
                    FROM itemsite, item
                    WHERE ( (itemsite_active)
                     AND (itemsite_item_id=item_id)
                     AND (itemsite_cyclecountfreq > 0)
                     AND ((COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq) < CURRENT_DATE)
                     AND (itemsite_id NOT IN ( SELECT invcnt_itemsite_id
                                               FROM invcnt, itemsite
                                               WHERE ( (invcnt_itemsite_id=itemsite_id)
                                                AND (itemsite_warehous_id=pWarehousid)
						AND (invcnt_location_id IS NULL)
                                                AND (NOT invcnt_posted) ) ) )
                     AND ((NOT pIgnoreZeroBalance) OR (itemsite_qtyonhand <> 0))
                     AND ((pLocationid IS NULL) OR (validLocation(pLocationid, itemsite_id)))
                     AND (itemsite_warehous_id=pWarehousid)
                     AND (itemsite_plancode_id=pPlancodeid) )
                    ORDER BY (COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq), itemsite_abcclass, item_number
                    LIMIT pMaxNumber LOOP
    _returnVal := createCountTag(_itemsites.itemsite_id, pComments,
				    pPriority, pFreeze, pLocationid);
    IF (_returnVal < 0) THEN
      RETURN _returnVal;
    END IF;
  END LOOP;

ELSE
  FOR _itemsites IN SELECT itemsite_id, itemsite_warehous_id, SUM(itemloc_qty)
                    FROM itemsite, itemloc
                    WHERE ( (itemsite_active)
                     AND (itemsite_cyclecountfreq > 0)
                     AND ((COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq) < CURRENT_DATE)
                     AND ((NOT pIgnoreZeroBalance) OR (itemsite_qtyonhand <> 0))
                     AND (itemloc_itemsite_id = itemsite_id)
                     AND (itemsite_warehous_id=pWarehousid)
                     AND (pLocationid = itemloc_location_id)
                     AND (itemsite_plancode_id=pPlancodeid) )
		    GROUP BY itemsite_id, itemsite_warehous_id,
			     itemsite_datelastcount, itemsite_cyclecountfreq,
			     itemsite_abcclass
                    ORDER BY (COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq), itemsite_abcclass
                    LIMIT pMaxNumber LOOP
    _returnVal := createCountTag(_itemsites.itemsite_id, pComments,
				    pPriority, pFreeze, pLocationid);
    IF (_returnVal < 0) THEN
      RETURN _returnVal;
    END IF;
  END LOOP;

END IF;

  RETURN 0;
END;
' LANGUAGE 'plpgsql' ;

CREATE OR REPLACE FUNCTION createcyclecountsbywarehousebyplannercode(integer, text, integer, text, boolean, boolean, integer, boolean)
  RETURNS integer AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWarehousid ALIAS FOR $1;
  pPlancodePattern ALIAS FOR $2;
  pMaxNumber ALIAS FOR $3;
  pComments ALIAS FOR $4;
  pPriority ALIAS FOR $5;
  pFreeze ALIAS FOR $6;
  pLocationid ALIAS FOR $7;
  pIgnoreZeroBalance ALIAS FOR $8;
  _itemsites RECORD;
  _returnVal	INTEGER;
  
BEGIN

IF (pLocationid IS NULL) THEN
  FOR _itemsites IN SELECT itemsite_id, itemsite_warehous_id, itemsite_qtyonhand
                    FROM itemsite, item, plancode
                    WHERE ( (itemsite_active)
                     AND (itemsite_item_id=item_id)
                     AND (itemsite_plancode_id=plancode_id)
                     AND (itemsite_cyclecountfreq > 0)
                     AND ((COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq) < CURRENT_DATE)
                     AND (itemsite_id NOT IN ( SELECT invcnt_itemsite_id
                                               FROM invcnt, itemsite
                                               WHERE ( (invcnt_itemsite_id=itemsite_id)
                                                AND (itemsite_warehous_id=pWarehousid)
						AND (invcnt_location_id IS NULL)
                                                AND (NOT invcnt_posted) ) ) )
                     AND ((NOT pIgnoreZeroBalance) OR (itemsite_qtyonhand <> 0))
                     AND ((pLocationid IS NULL) OR (validLocation(pLocationid, itemsite_id)))
                     AND (itemsite_warehous_id=pWarehousid)
                     AND (plancode_code ~ pPlancodePattern) )
                    ORDER BY (COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq), itemsite_abcclass, item_number
                    LIMIT pMaxNumber LOOP
    _returnVal := createCountTag(_itemsites.itemsite_id, pComments,
				    pPriority, pFreeze, pLocationid);
    IF (_returnVal < 0) THEN
      RETURN _returnVal;
    END IF;
  END LOOP;

ELSE
  FOR _itemsites IN SELECT itemsite_id, itemsite_warehous_id, SUM(itemloc_qty)
                    FROM itemsite, plancode, itemloc
                    WHERE ( (itemsite_active)
                     AND (itemsite_plancode_id=plancode_id)
                     AND (itemsite_cyclecountfreq > 0)
                     AND ((COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq) < CURRENT_DATE)
                     AND ((NOT pIgnoreZeroBalance) OR (itemsite_qtyonhand <> 0))
                     AND (pLocationid = itemloc_location_id)
                     AND (itemloc_itemsite_id = itemsite_id)
                     AND (itemsite_warehous_id=pWarehousid)
                     AND (plancode_code ~ pPlancodePattern) )
		    GROUP BY itemsite_id, itemsite_warehous_id,
			     itemsite_datelastcount, itemsite_cyclecountfreq,
			     itemsite_abcclass
                    ORDER BY (COALESCE(itemsite_datelastcount, startOfTime()) + itemsite_cyclecountfreq), itemsite_abcclass
                    LIMIT pMaxNumber LOOP
    _returnVal := createCountTag(_itemsites.itemsite_id, pComments,
				    pPriority, pFreeze, pLocationid);
    IF (_returnVal < 0) THEN
      RETURN _returnVal;
    END IF;
  END LOOP;

END IF;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';
