
CREATE OR REPLACE FUNCTION validateOrderQty(INTEGER, NUMERIC, BOOLEAN) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pManual ALIAS FOR $3;
  _p RECORD;
  _qty NUMERIC;

BEGIN

  _qty := pQty;

  SELECT itemsite_useparams,
         CASE WHEN (itemsite_useparams) THEN itemsite_useparamsmanual ELSE FALSE END AS itemsite_useparamsmanual,
         CASE WHEN (itemsite_useparams) THEN itemsite_minordqty ELSE 0.0 END AS itemsite_minordqty,
         CASE WHEN (itemsite_useparams) THEN itemsite_multordqty ELSE 0.0 END AS itemsite_multordqty,
         item_fractional, item_type INTO _p
  FROM itemsite, item
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_id=pItemsiteid) );

  IF ( (pManual AND (_p.itemsite_useparamsmanual)) OR
       ((NOT pManual) AND (_p.itemsite_useparams)) ) THEN

    IF (_qty < _p.itemsite_minordqty) THEN
      _qty := _p.itemsite_minordqty;
    END IF;

    IF ( (_p.itemsite_multordqty > 0) AND ((_qty % _p.itemsite_multordqty) > 0) ) THEN
      _qty := ((TRUNC(_qty / _p.itemsite_multordqty) * _p.itemsite_multordqty) + _p.itemsite_multordqty);
    END IF;

  END IF;

  _qty := roundQty(_p.item_fractional, _qty);

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';

