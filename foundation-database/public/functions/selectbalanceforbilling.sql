CREATE OR REPLACE FUNCTION selectBalanceForBilling(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid ALIAS FOR $1;
  _returnval	BOOLEAN := TRUE;
  _doSelect BOOLEAN;
  _result INTEGER;
  _soitem RECORD;

BEGIN

  FOR _soitem IN
    -- Get the shipments for this SO.  Kits are not shipped
    SELECT cust_partialship, coitem_id,
           coitem_linenumber, 'NOTK' AS item_type,
           SUM(shipitem_qty) AS qty,
           ( (SUM(shipitem_qty) >= (coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned + SUM(shipitem_qty))) OR
             (NOT cust_partialship) ) AS toclose
    FROM cohead JOIN custinfo ON (cust_id=cohead_cust_id)
                JOIN coitem ON (coitem_cohead_id=cohead_id)
                JOIN shipitem ON ( (shipitem_orderitem_id=coitem_id) AND (NOT shipitem_invoiced) )
                JOIN shiphead ON ( (shiphead_id=shipitem_shiphead_id) AND (shiphead_order_type='SO') AND (shiphead_shipped) )
    WHERE (cohead_id=pSoheadid)
    GROUP BY cust_partialship, coitem_id, item_type,
             coitem_linenumber, coitem_qtyord,
             coitem_qtyshipped, coitem_qtyreturned
    UNION
    -- Get the Kits for this SO
    SELECT cust_partialship, coitem_id,
           coitem_linenumber, 'K' AS item_type,
           coitem_qtyord AS qty,
           TRUE AS toclose
    FROM cohead JOIN custinfo ON (cust_id=cohead_cust_id)
                JOIN coitem ON (coitem_cohead_id=cohead_id AND coitem_status='O')
                JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
                JOIN item ON ( (item_id=itemsite_item_id) AND (item_type='K') )
    WHERE (cohead_id=pSoheadid)
  LOOP

    _doSelect := true;
    IF(_soitem.item_type = 'K') THEN
      -- see if all the sub items are shipped
      SELECT coitem_id
        INTO _result
        FROM coitem
       WHERE((coitem_cohead_id=pSoheadid)
         AND (coitem_linenumber=_soitem.coitem_linenumber)
         AND (coitem_subnumber > 0)
         AND ((coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned) > 0))
       LIMIT 1;
      IF( FOUND ) THEN
        _doSelect := false;
      END IF;
    END IF;

    IF (_doSelect) THEN
      -- do as much as we can but still report errors if they occur
      IF (selectForBilling(_soitem.coitem_id, _soitem.qty, _soitem.toclose) < 0) THEN
        _returnval := FALSE;
      END IF;
    END IF;

  END LOOP;

  RETURN _returnval;

END;
$$ LANGUAGE 'plpgsql';
