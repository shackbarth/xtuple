
CREATE OR REPLACE FUNCTION itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pCurrid INTEGER,
                                     pEffective DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _item RECORD;

BEGIN
  SELECT item_inv_uom_id, item_price_uom_id
    INTO _item
    FROM item
   WHERE(item_id=pItemid);
  IF (FOUND) THEN
    RETURN itemPrice(pItemid, pCustid, pShiptoid, pQty, _item.item_inv_uom_id, _item.item_price_uom_id, pCurrid, pEffective);
  END IF;
  RETURN -9999;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pQtyUOM INTEGER,
                                     pPriceUOM INTEGER,
                                     pCurrid INTEGER,
                                     pEffective DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN
  RETURN itemPrice(pItemid, pCustid, pShiptoid, pQty, pQtyUOM, pPriceUOM, pCurrid, pEffective, CURRENT_DATE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pQtyUOM INTEGER,
                                     pPriceUOM INTEGER,
                                     pCurrid INTEGER,
                                     pEffective DATE,
                                     pAsOf DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN
  RETURN itemPrice(pItemid, pCustid, pShiptoid, pQty, pQtyUOM, pPriceUOM, pCurrid, pEffective, pAsOf, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemPrice(pItemid INTEGER,
                                     pCustid INTEGER,
                                     pShiptoid INTEGER,
                                     pQty NUMERIC,
                                     pQtyUOM INTEGER,
                                     pPriceUOM INTEGER,
                                     pCurrid INTEGER,
                                     pEffective DATE,
                                     pAsOf DATE,
                                     pSiteid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN
  SELECT * FROM itemIpsPrice(pItemid, pCustid, pShiptoid, pQty, pQtyUOM, pPriceUOM,
                             pCurrid, pEffective, pAsOf, pSiteid) INTO _r;
  RETURN _r.itemprice_price;
END;
$$ LANGUAGE 'plpgsql';
