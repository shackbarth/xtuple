
CREATE OR REPLACE FUNCTION explodePhantomOrder(INTEGER, INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  pPhantomid ALIAS FOR $2;
  pQty       ALIAS FOR $3;
  _b RECORD;

BEGIN
  FOR _b IN SELECT planord_number, c.itemsite_id AS componentsiteid,
                   calculatenextworkingdate(c.itemsite_warehous_id, planord_startdate, (c.itemsite_leadtime * -1)) AS startdate,
                   planord_startdate AS duedate,
                   bomitem_createwo, c.itemsite_planning_type AS planningtype,
                   (itemuomtouom(bomitem_item_id, bomitem_uom_id, NULL, (bomitem_qtyfxd + pQty * bomitem_qtyper) * (1 + bomitem_scrap))) AS qtyreq,
                   item_type
              FROM bomitem, planord, itemsite AS p, itemsite AS c, item
             WHERE ((bomitem_parent_item_id=p.itemsite_item_id)
               AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
               AND (bomitem_item_id=c.itemsite_item_id)
               AND (p.itemsite_warehous_id=c.itemsite_warehous_id)
               AND (c.itemsite_item_id=item_id)
               AND (woEffectiveDate(planord_startdate) BETWEEN bomitem_effective AND (bomitem_expires - 1))
               AND (p.itemsite_id=pPhantomid)
               AND (planord_id=pPlanordid)) LOOP

    IF (_b.item_type = 'F') THEN
      PERFORM explodePhantomOrder(pPlanordid, _b.componentsiteid, _b.qtyreq);
    ELSE
--  Create the Planned Requirement
      INSERT INTO planreq
      ( planreq_source, planreq_source_id,
        planreq_itemsite_id, planreq_qty )
      VALUES
      ( 'P', pPlanordid,
        _b.componentsiteid, _b.qtyreq );

      IF (_b.bomitem_createwo AND _b.planningtype != 'N') THEN
        PERFORM createPlannedOrder( pPlanordid, _b.planord_number, _b.componentsiteid,
                                    _b.qtyreq, _b.startdate, _b.duedate,
                                    FALSE, FALSE, NULL, NULL);
      END IF;
    END IF;

  END LOOP;

  RETURN pPlanordid;
END;
$$ LANGUAGE 'plpgsql';

