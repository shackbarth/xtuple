CREATE OR REPLACE FUNCTION updateLowerUserCosts(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;

BEGIN
    RETURN updateLowerUserCosts(pItemid, TRUE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION updateLowerUserCosts(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid	ALIAS FOR $1;
  pUpdateActual	ALIAS FOR $2;
  _bomitem RECORD;
  _type CHAR(1);

BEGIN

  SELECT item_type INTO _type
  FROM item
  WHERE (item_id=pItemid);

  IF (_type IN ('M', 'F', 'B', 'T')) THEN
    FOR _bomitem IN SELECT DISTINCT costelem_type
                    FROM ( SELECT COALESCE(bc.costelem_type, ic.costelem_type) AS costelem_type
                           FROM bomitem(pItemid)
                             JOIN item ON (item_id=bomitem_item_id AND item_type <> 'T')
                             JOIN itemcost ON (itemcost_item_id=bomitem_item_id)
                             JOIN costelem ic ON (ic.costelem_id=itemcost_costelem_id AND NOT ic.costelem_sys)
                             LEFT OUTER JOIN bomitemcost ON (bomitemcost_bomitem_id=bomitem_id)
                             LEFT OUTER JOIN costelem bc ON (bc.costelem_id=bomitemcost_costelem_id AND NOT bc.costelem_sys)
                           WHERE ( CURRENT_DATE BETWEEN bomitem_effective AND (bomitem_expires - 1) )

                           UNION SELECT costelem_type
                           FROM itemcost, costelem
                           WHERE ( (itemcost_costelem_id=costelem_id)
                            AND (itemcost_item_id=pItemid) ) ) AS data LOOP

      PERFORM updateSorACost( pItemid, _bomitem.costelem_type,
			      TRUE, lowerCost(pItemid, _bomitem.costelem_type, pUpdateActual),
			      pUpdateActual);
    END LOOP;

  ELSIF (_type = 'C') THEN
    FOR _bomitem IN SELECT DISTINCT costelem_type
                    FROM ( SELECT costelem_type
                           FROM itemcost, costelem,
                                xtmfg.bbomitem
                           WHERE ( (bbomitem_item_id=pItemid)
                            AND ( CURRENT_DATE BETWEEN bbomitem_effective
                                               AND (bbomitem_expires - 1) )
                            AND (NOT costelem_sys)
                            AND (bbomitem_item_id=itemcost_item_id)
                            AND (itemcost_costelem_id=costelem_id) ) 

                           UNION SELECT costelem_type
                           FROM itemcost, costelem,
                                xtmfg.bbomitem AS t,
                                xtmfg.bbomitem AS s
                           WHERE ( (t.bbomitem_item_id=pItemid)
                            AND ( CURRENT_DATE BETWEEN s.bbomitem_effective
                                               AND (s.bbomitem_expires - 1) )
                            AND ( CURRENT_DATE BETWEEN t.bbomitem_effective
                                               AND (t.bbomitem_expires - 1) )
                            AND (s.bbomitem_parent_item_id=t.bbomitem_parent_item_id)
                            AND (NOT costelem_sys)
                            AND (s.bbomitem_item_id=itemcost_item_id)
                            AND (itemcost_costelem_id=costelem_id) ) ) AS data LOOP

      PERFORM updateSorACost( pItemid, _bomitem.costelem_type,
			      TRUE, lowerCost(pItemid, _bomitem.costelem_type, pUpdateActual),
			      pUpdateActual);
    END LOOP;
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

