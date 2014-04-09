CREATE OR REPLACE FUNCTION getIpsitemId(pIpsName TEXT,
                                        pItemNumber TEXT,
                                        pQtyBreak NUMERIC,
                                        pQtyUom TEXT,
                                        pPriceUom TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
  
BEGIN
  IF (pIpsName IS NULL AND pItemNumber IS NULL AND pQtyBreak IS NULL AND pQtyUom IS NULL AND pPriceUom IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT ipsitem_id INTO _returnVal
  FROM ipsiteminfo
  WHERE ((ipsitem_ipshead_id=getIpsheadId(pIpsName))
  AND (ipsitem_item_id=getItemId(pItemNumber))
  AND (ipsitem_qtybreak=pQtyBreak)
  AND (ipsitem_qty_uom_id=getUomId(pQtyUom))
  AND (ipsitem_price_uom_id=getUomId(pPriceUom)));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Pricing Schedule Item for Schedule %, Item %,Qt Break %,Qty UOM %, Price UOM % not found.', 
	pIpsName, pItemNumber, pQtyBreak, pQtyUom, pPriceUom;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
