CREATE OR REPLACE FUNCTION selectUninvoicedShipments(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWarehousid ALIAS FOR $1;
  _r RECORD;
  _recordCounter INTEGER := 0;

BEGIN

--  Grab all of the uninvoiced shipitem records
  FOR _r IN SELECT DISTINCT shiphead_id
            FROM shiphead, shipitem, coitem, itemsite
            WHERE ( (shiphead_order_type='SO')
             AND (shipitem_shiphead_id=shiphead_id)
             AND (shipitem_orderitem_id=coitem_id)
             AND (coitem_itemsite_id=itemsite_id)
             AND (coitem_status <> 'C')
             AND ( (pWarehousid = -1) OR (itemsite_warehous_id=pWarehousid) )
             AND (shiphead_shipped)
             AND (NOT shipitem_invoiced)
             AND (coitem_id NOT IN ( SELECT cobill_coitem_id
                                     FROM cobmisc, cobill
                                     WHERE ((cobill_cobmisc_id=cobmisc_id)
                                      AND (NOT cobmisc_posted) ) ) ) ) LOOP

      PERFORM selectUninvoicedShipment(_r.shiphead_id);

    _recordCounter := _recordCounter + 1;

  END LOOP;

  RETURN _recordCounter;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION selectUninvoicedShipments(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWarehousid ALIAS FOR $1;
  pCusttypeid ALIAS FOR $2;
  _r RECORD;
  _recordCounter INTEGER := 0;

BEGIN

--  Grab all of the uninvoiced shipitem records
  FOR _r IN SELECT DISTINCT shiphead_id
            FROM shiphead, shipitem, coitem, itemsite, cohead, custinfo
            WHERE ( (shiphead_order_type='SO')
             AND (shipitem_shiphead_id=shiphead_id)
             AND (shipitem_orderitem_id=coitem_id)
             AND (coitem_itemsite_id=itemsite_id)
             AND (coitem_status <> 'C')
             AND (coitem_cohead_id=cohead_id)
             AND (cohead_cust_id=cust_id)
             AND (cust_custtype_id=pCusttypeid)
             AND ( (pWarehousid = -1) OR (itemsite_warehous_id=pWarehousid) )
             AND (shiphead_shipped)
             AND (NOT shipitem_invoiced)
             AND (coitem_id NOT IN ( SELECT cobill_coitem_id
                                     FROM cobmisc, cobill
                                     WHERE ((cobill_cobmisc_id=cobmisc_id)
                                      AND (NOT cobmisc_posted) ) ) ) ) LOOP

      PERFORM selectUninvoicedShipment(_r.shiphead_id);

    _recordCounter := _recordCounter + 1;

  END LOOP;

  RETURN _recordCounter;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION selectUninvoicedShipments(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWarehousid ALIAS FOR $1;
  pCusttype ALIAS FOR $2;
  _r RECORD;
  _recordCounter INTEGER := 0;

BEGIN

--  Grab all of the uninvoiced shipitem records
  FOR _r IN SELECT DISTINCT shiphead_id
            FROM shiphead, shipitem, coitem, itemsite, cohead, custinfo, custtype
            WHERE ( (shiphead_order_type='SO')
             AND (shipitem_shiphead_id=shiphead_id)
             AND (shipitem_orderitem_id=coitem_id)
             AND (coitem_itemsite_id=itemsite_id)
             AND (coitem_status <> 'C')
             AND (coitem_cohead_id=cohead_id)
             AND (cohead_cust_id=cust_id)
             AND (cust_custtype_id=custtype_id)
             AND ( (pWarehousid = -1) OR (itemsite_warehous_id=pWarehousid) )
             AND (custtype_code ~ pCusttype)
             AND (shiphead_shipped)
             AND (NOT shipitem_invoiced)
             AND (coitem_id NOT IN ( SELECT cobill_coitem_id
                                     FROM cobmisc, cobill
                                     WHERE ((cobill_cobmisc_id=cobmisc_id)
                                      AND (NOT cobmisc_posted) ) ) ) ) LOOP

      PERFORM selectUninvoicedShipment(_r.shiphead_id);

    _recordCounter := _recordCounter + 1;

  END LOOP;

  RETURN _recordCounter;

END;
$$ LANGUAGE 'plpgsql';
