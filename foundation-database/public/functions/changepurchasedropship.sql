CREATE OR REPLACE FUNCTION changePurchaseDropShip(pCoitemId INTEGER,
                                                  pPoitemId INTEGER,
                                                  pDropShip BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _s RECORD;
  _w RECORD;
  _p RECORD;
  _result INTEGER;
  _poitemid INTEGER;

BEGIN

  -- Check for existing poitem for this coitem
  SELECT * INTO _p
  FROM poitem JOIN pohead ON (pohead_id=poitem_pohead_id)
  WHERE (poitem_id=pPoitemId)
    AND (poitem_order_id=pCoitemId)
    AND (poitem_order_type='S');
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Change Purchase Drop Ship PO not found';
  END IF;

  SELECT * INTO _s
  FROM coitem JOIN cohead ON (cohead_id = coitem_cohead_id)
    LEFT OUTER JOIN shiptoinfo ON (cohead_shipto_id = shipto_id)
    LEFT OUTER JOIN cntct ON (shipto_cntct_id = cntct_id)
    LEFT OUTER JOIN addr ON (shipto_addr_id = addr_id)
  WHERE (coitem_id = pCoitemId);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  IF (_p.pohead_status != 'U') THEN
    RETURN -3;
  END IF;

  SELECT deletePoitem(_p.poitem_id) INTO _result;
  IF (_result < 0) THEN
    RETURN _result;
  END IF;

  SELECT createPurchaseToSale(_s.coitem_id, _p.poitem_itemsrc_id,
                              pDropShip, _s.coitem_qtyord,
                              _s.coitem_scheddate, NULL)
     INTO _poitemid;
  
  RETURN _poitemid;

END;
$$ LANGUAGE 'plpgsql' VOLATILE;
