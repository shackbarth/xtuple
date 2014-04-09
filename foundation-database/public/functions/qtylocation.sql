SELECT dropIfExists('FUNCTION','qtyLocation(INTEGER, INTEGER, DATE, DATE, INTEGER, TEXT, INTEGER)');

CREATE OR REPLACE FUNCTION qtyLocation(INTEGER, INTEGER, DATE, DATE, INTEGER, TEXT, INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pLocationId  ALIAS FOR $1;
  pLsId        ALIAS FOR $2;
  pExpiration  ALIAS FOR $3;
  pWarranty    ALIAS FOR $4;
  pItemsiteId  ALIAS FOR $5;
  pOrderType   ALIAS FOR $6;
  pOrderId     ALIAS FOR $7;
  pItemlocdistId ALIAS FOR $8;
  _qty         NUMERIC = 0.0;
  _qtyDist     NUMERIC = 0.0;
  _qtyReserved NUMERIC = 0.0;

BEGIN
-- Summarize itemloc qty for this location/itemsite
  SELECT COALESCE(SUM(itemloc_qty), 0) INTO _qty
    FROM itemloc
   WHERE ( (itemloc_itemsite_id=pItemsiteId)
     AND (itemloc_location_id=pLocationId)
     AND (COALESCE(itemloc_ls_id, -1)=COALESCE(pLsId, itemloc_ls_id, -1))
     AND (COALESCE(itemloc_expiration, endoftime())=COALESCE(pExpiration, itemloc_expiration, endoftime()))
     AND (COALESCE(itemloc_warrpurc, endoftime())=COALESCE(pWarranty, itemloc_warrpurc, endoftime())) );

-- Summarize qty distributed but not yet committed by previous distributions
  SELECT COALESCE(SUM(loc.itemlocdist_qty), 0) INTO _qtyDist
    FROM itemlocdist loc
      JOIN itemlocdist ls ON ((ls.itemlocdist_source_type='O')
			  AND (ls.itemlocdist_id=loc.itemlocdist_itemlocdist_id))
   WHERE ( (ls.itemlocdist_itemsite_id=pItemsiteId)
     AND (loc.itemlocdist_source_type='L')
     AND (loc.itemlocdist_source_id=pLocationId)
     AND (COALESCE(ls.itemlocdist_ls_id, -1)=COALESCE(pLsId, ls.itemlocdist_ls_id, -1))
     AND (COALESCE(ls.itemlocdist_expiration, endoftime())=COALESCE(pExpiration, ls.itemlocdist_expiration, endoftime()))
     AND (COALESCE(ls.itemlocdist_warranty, endoftime())=COALESCE(pWarranty, ls.itemlocdist_warranty, endoftime()))
     AND (ls.itemlocdist_id != pItemlocdistId ) );

-- Summarize reserved qty for this location/itemsite
-- that is reserved for a different order
  IF (fetchMetricBool('EnableSOReservationsByLocation')) THEN
    SELECT COALESCE(SUM(reserve_qty), 0) INTO _qtyReserved
      FROM itemloc JOIN reserve ON ( (reserve_supply_id=itemloc_id AND reserve_supply_type='I')
                                    AND  ((reserve_demand_type <> COALESCE(pOrderType, '')) OR
                                          (reserve_demand_id <> COALESCE(pOrderId, -1))) )
     WHERE ( (itemloc_itemsite_id=pItemsiteId)
       AND (itemloc_location_id=pLocationId)
       AND (COALESCE(itemloc_ls_id, -1)=COALESCE(pLsId, itemloc_ls_id, -1))
       AND (COALESCE(itemloc_expiration, endoftime())=COALESCE(pExpiration, itemloc_expiration, endoftime()))
       AND (COALESCE(itemloc_warrpurc, endoftime())=COALESCE(pWarranty, itemloc_warrpurc, endoftime())) );
  END IF;

  RETURN (_qty + _qtyDist - _qtyReserved);

END;
$$ LANGUAGE 'plpgsql';
