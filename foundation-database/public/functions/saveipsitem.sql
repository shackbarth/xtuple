CREATE OR REPLACE FUNCTION saveIpsItem(pIpsItemId INTEGER,
                                       pIpsHeadId INTEGER,
                                       pItemId INTEGER,
                                       pQtyBreak NUMERIC,
                                       pPrice NUMERIC,
                                       pQtyUomId INTEGER,
                                       pPriceUomId INTEGER,
                                       pPercent NUMERIC,
                                       pFixedAmt NUMERIC,
                                       pType TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _ipsitemid	INTEGER;
  _new		BOOLEAN;
BEGIN

  -- Validation
  IF (SELECT COUNT(item_id)=0 FROM item WHERE (item_id=pItemId)) THEN
    RAISE EXCEPTION 'You must provide a valid Item';
  ELSIF (COALESCE(pQtyBreak,0) < 0) THEN
    RAISE EXCEPTION 'Quantity can not be a negative value';
  ELSIF (COALESCE(pPrice,0) < 0) THEN
    RAISE EXCEPTION 'Price must be a negative value';
  ELSIF ((pQtyUomId IS NOT NULL) AND (SELECT COUNT(item_id)=0 FROM
        (SELECT item_id
         FROM item
         WHERE ((item_id=pItemId)
           AND (item_inv_uom_id=pQtyUomId))
         UNION
         SELECT item_id
         FROM item,itemuomconv,itemuom,uomtype
         WHERE ((item_id=pItemId)
           AND (itemuomconv_item_id=item_id)
           AND (itemuomconv_from_uom_id=pQtyUomId)
           AND (itemuom_itemuomconv_id=itemuomconv_id)
           AND (itemuom_uomtype_id=uomtype_id)
           AND (uomtype_name='Selling'))
         UNION
         SELECT item_id
         FROM item,itemuomconv,itemuom,uomtype
         WHERE ((item_id=pItemId)
           AND (itemuomconv_item_id=item_id)
           AND (itemuomconv_to_uom_id=pQtyUomId)
           AND (itemuom_itemuomconv_id=itemuomconv_id)
           AND (itemuom_uomtype_id=uomtype_id)
           AND (uomtype_name='Selling'))) AS data)) THEN
    RAISE EXCEPTION 'Qty UOM Must be a valid Selling UOM for the Item';
  ELSIF ((pPriceUomId IS NOT NULL) AND (SELECT COUNT(item_id)=0 FROM
        (SELECT item_id
         FROM item
         WHERE ((item_id=pItemId)
           AND (item_inv_uom_id=pPriceUomId))
         UNION
         SELECT item_id
         FROM item,itemuomconv,itemuom,uomtype
         WHERE ((item_id=pItemId)
           AND (itemuomconv_item_id=item_id)
           AND (itemuomconv_from_uom_id=pPriceUomId)
           AND (itemuom_itemuomconv_id=itemuomconv_id)
           AND (itemuom_uomtype_id=uomtype_id)
           AND (uomtype_name='Selling'))
         UNION
         SELECT item_id
         FROM item,itemuomconv,itemuom,uomtype
         WHERE ((item_id=pItemId)
           AND (itemuomconv_item_id=item_id)
           AND (itemuomconv_to_uom_id=pPriceUomId)
           AND (itemuom_itemuomconv_id=itemuomconv_id)
           AND (itemuom_uomtype_id=uomtype_id)
           AND (uomtype_name='Selling'))) AS data)) THEN
    RAISE EXCEPTION 'Price UOM Must be a valid Selling UOM for the Item';
  END IF;

  _new := TRUE;

  IF (pIpsItemId IS NOT NULL) THEN
    SELECT ipsitem_id INTO _ipsitemid
    FROM ipsiteminfo
    WHERE (ipsitem_id=pIpsItemId);

    IF (FOUND) THEN
      _new := FALSE;
    ELSE
      RAISE EXCEPTION 'Pricing Schedule Item not found.';
    END IF;
  ELSE
    SELECT ipsitem_id INTO _ipsitemid
    FROM ipsiteminfo
    WHERE ((ipsitem_ipshead_id	= pIpsheadId)
      AND (ipsitem_item_id 	= pItemId)
      AND (ipsitem_qtybreak 	= pQtyBreak)
      AND (ipsitem_qty_uom_id = COALESCE(pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId))) 
      AND (ipsitem_price_uom_id =
           CASE
             WHEN (pQtyUomId = (SELECT item_inv_uom_id FROM item WHERE item_id = pItemId)) THEN
               COALESCE(pPriceUomId,pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId))
             ELSE
               COALESCE(pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId))
           END));
  END IF;
  
  IF (FOUND) THEN
    _new := false;
  END IF;
  
  IF (_new) THEN
    INSERT INTO ipsiteminfo (
      ipsitem_ipshead_id, 
      ipsitem_item_id, 
      ipsitem_qtybreak, 
      ipsitem_price, 
      ipsitem_qty_uom_id, 
      ipsitem_price_uom_id,
      ipsitem_discntprcnt,
      ipsitem_fixedamtdiscount,
      ipsitem_type) 
    VALUES (
      pIpsheadId,
      pItemId,
      pQtyBreak, 
      pPrice,
      COALESCE(pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId)), 
      CASE
        WHEN (pQtyUomId = (SELECT item_inv_uom_id FROM item WHERE item_id = pItemId)) THEN
          COALESCE(pPriceUomId,pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId))
        ELSE
          COALESCE(pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId))
      END,
      pPercent,
      pFixedAmt,
      pType)
    RETURNING ipsitem_id INTO _ipsitemid;
  ELSE 
    UPDATE ipsiteminfo SET 
      ipsitem_qtybreak = pQtyBreak, 
      ipsitem_price = pPrice, 
      ipsitem_qty_uom_id = COALESCE(pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId)), 
      ipsitem_price_uom_id =
      CASE
        WHEN (pQtyUomId = (SELECT item_inv_uom_id FROM item WHERE item_id = pItemId)) THEN
          COALESCE(pPriceUomId,pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId))
        ELSE
          COALESCE(pQtyUomId,(SELECT item_inv_uom_id FROM item WHERE item_id = pItemId))
      END,
      ipsitem_discntprcnt=pPercent,
      ipsitem_fixedamtdiscount=pFixedAmt,
      ipsitem_type=pType
    WHERE (ipsitem_id=_ipsitemid);
   END IF;

   RETURN _ipsitemid;

END;
$$ LANGUAGE 'plpgsql';

