CREATE OR REPLACE FUNCTION saveIpsProdcat(pIpsProdcatId INTEGER,
                                          pIpsHeadId INTEGER,
                                          pProdCatId INTEGER,
                                          pQtyBreak NUMERIC,
                                          pDiscount NUMERIC,
                                          pFixedAmtDiscount NUMERIC,
                                          pType TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _ipsitemid	INTEGER;
  _new		BOOLEAN;
  
BEGIN

  -- Validation
  IF (SELECT COUNT(*)=0 FROM prodcat WHERE (prodcat_id=pProdcatId)) THEN
    RAISE EXCEPTION 'You must provide a valid Product Category';
  ELSIF (COALESCE(pQtyBreak,0) < 0) THEN
    RAISE EXCEPTION 'Quantity can not be a negative value';
  ELSIF (COALESCE(pDiscount,0) < 0) THEN
    RAISE EXCEPTION 'Discount must be a negative value';
  END IF;
    
  _new := TRUE;

  IF (pIpsProdcatId IS NOT NULL) THEN
    SELECT ipsitem_id INTO _ipsitemid
    FROM ipsiteminfo
    WHERE (ipsprodcat_id=pIpsprodcatId);

    IF (FOUND) THEN
      _new := FALSE;
    ELSE
      RAISE EXCEPTION 'Pricing Schedule Product Category not found';
    END IF;
  ELSE
    SELECT ipsitem_id INTO _ipsitemid
    FROM ipsiteminfo
    WHERE ((ipsitem_ipshead_id=pIpsheadId)
      AND (ipsitem_prodcat_id=pProdcatId)
      AND (ipsitem_qtybreak=pQtyBreak));

    IF (FOUND) THEN
      _new := false;
    ELSE
      _ipsitemid := nextval('ipsitem_ipsitem_id_seq');
    END IF;
  END IF;
  
  IF (_new) THEN
    INSERT INTO ipsiteminfo (
      ipsitem_id,
      ipsitem_ipshead_id, 
      ipsitem_prodcat_id, 
      ipsitem_qtybreak,
      ipsitem_price, 
      ipsitem_discntprcnt,
      ipsitem_fixedamtdiscount,
      ipsitem_type)  
    VALUES (
      _ipsitemid,
      pIpsheadId,
      pProdcatId,
      pQtyBreak, 
      0.0,
      pDiscount * .01,
      pFixedAmtDiscount,
      pType);
  ELSE 
    UPDATE ipsiteminfo SET 
      ipsitem_qtybreak = pQtyBreak, 
      ipsitem_discntprcnt = pDiscount * .01,
      ipsitem_fixedamtdiscount = pFixedAmtDiscount,
      ipsitem_type = pType 
    WHERE (ipsitem_id=_ipsitemid);
  END IF;

  RETURN _ipsitemid;
END;
$$ LANGUAGE 'plpgsql';

