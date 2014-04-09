CREATE OR REPLACE FUNCTION uomusedforitem(INTEGER) RETURNS SETOF uom AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pitemid       ALIAS FOR $1;
  _row          uom%ROWTYPE;
BEGIN
  FOR _row IN SELECT DISTINCT *
              FROM uom
              WHERE uom_id IN (
                SELECT bomitem_uom_id AS uom_id 
                FROM bomitem 
                WHERE (bomitem_item_id=pitemid)
                UNION 
                SELECT cmitem_qty_uom_id 
                FROM cmitem, itemsite 
                WHERE ((cmitem_itemsite_id=itemsite_id)
                   AND (itemsite_item_id=pitemid))
                UNION 
                SELECT cmitem_price_uom_id 
                FROM cmitem, itemsite 
                WHERE ((cmitem_itemsite_id=itemsite_id)
                   AND (itemsite_item_id=pitemid))
                UNION 
                SELECT coitem_qty_uom_id 
                FROM coitem, itemsite 
                WHERE ((coitem_itemsite_id=itemsite_id)
                   AND (itemsite_item_id=pitemid))
                UNION 
                SELECT coitem_price_uom_id 
                FROM coitem, itemsite 
                WHERE ((coitem_itemsite_id=itemsite_id)
                   AND (itemsite_item_id=pitemid))
                UNION 
                SELECT invcitem_qty_uom_id 
                FROM invcitem 
                WHERE ((invcitem_item_id=pitemid))
                UNION 
                SELECT invcitem_price_uom_id 
                FROM invcitem 
                WHERE ((invcitem_item_id=pitemid))
                UNION 
                SELECT ipsitem_qty_uom_id 
                FROM ipsiteminfo 
                WHERE (ipsitem_item_id=pitemid)
                UNION 
                SELECT ipsitem_price_uom_id 
                FROM ipsiteminfo 
                WHERE (ipsitem_item_id=pitemid)
                UNION 
                SELECT quitem_qty_uom_id 
                FROM quitem, itemsite 
                WHERE ((quitem_itemsite_id=itemsite_id)
                   AND (itemsite_item_id=pitemid))
                UNION 
                SELECT quitem_price_uom_id 
                FROM quitem, itemsite 
                WHERE ((quitem_itemsite_id=itemsite_id)
                   AND (itemsite_item_id=pitemid))
                UNION 
                SELECT womatl_uom_id 
                FROM womatl, itemsite 
                WHERE ((womatl_itemsite_id=itemsite_id)
                   AND (itemsite_item_id=pitemid))
  ) LOOP
    RETURN NEXT _row;
  END LOOP;

  IF (fetchmetricbool(''MultiWhs'')) THEN
    FOR _row IN SELECT DISTINCT *
                FROM uom
                WHERE uom_id IN (
                  SELECT rahist_uom_id 
                  FROM rahist, itemsite 
                  WHERE ((rahist_itemsite_id=itemsite_id)
                     AND (itemsite_item_id=pitemid))
    ) LOOP
      RETURN NEXT _row;
    END LOOP;
  END IF;

  RETURN;
END;
' LANGUAGE 'plpgsql';
