CREATE OR REPLACE FUNCTION getIpsProdcatId(pIpsName TEXT,
                                           pProdCat TEXT,
                                           pQtyBreak NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
  
BEGIN
  IF (pIpsName IS NULL AND pProdCat IS NULL AND pQtyBreak IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT ipsitem_id INTO _returnVal
  FROM ipsiteminfo
  WHERE ((ipsitem_ipshead_id=getIpsheadId(pIpsName))
  AND (ipsitem_prodcat_id=getProdcatId(pProdCat))
  AND (ipsitem_qtybreak=pQtyBreak));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Pricing Schedule Product Category for Schedule %, Product Category %,Qt Break % not found.', 
	pIpsName, pProdCat, pQtyBreak;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
