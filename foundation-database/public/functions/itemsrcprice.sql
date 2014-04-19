
CREATE OR REPLACE FUNCTION itemsrcPrice(pItemsrcid INTEGER,
                                        pQty NUMERIC,
                                        pCurrid INTEGER,
                                        pEffective DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _price NUMERIC := 0.0;

BEGIN

  SELECT itemsrcPrice(pItemsrcid, -1, FALSE, pQty, pCurrid, pEffective) INTO _price;

  RETURN _price;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemsrcPrice(pItemsrcid INTEGER,
                                        pSiteid INTEGER,
                                        pDropship BOOLEAN,
                                        pQty NUMERIC,
                                        pCurrid INTEGER,
                                        pEffective DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _price NUMERIC := 0.0;
  _r RECORD;
  _effective DATE;

BEGIN
-- If no pEffective passed, use current date
  _effective := COALESCE(pEffective, CURRENT_DATE);

--  Cache Itemsrc and Item
  SELECT *
  INTO _r
  FROM itemsrc JOIN item ON (item_id=itemsrc_item_id)
  WHERE (itemsrc_id=pItemsrcid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'itemsrc % not found.', pItemsrcid;
  END IF;

--  Determine price
  SELECT currToCurr(itemsrcp_curr_id, pCurrid, price, _effective) INTO _price
  FROM (
    SELECT *,
           CASE WHEN (itemsrcp_dropship) THEN 0
                ELSE 1
           END AS seq,
           CASE itemsrcp_type WHEN ('N') THEN itemsrcp_price
                              WHEN ('D') THEN (_r.item_listcost - (_r.item_listcost * itemsrcp_discntprcnt) - itemsrcp_fixedamtdiscount)
                              ELSE 0.0
           END AS price
    FROM itemsrcp
    WHERE ( (itemsrcp_itemsrc_id=_r.itemsrc_id)
      AND   ((itemsrcp_warehous_id=pSiteid) OR (itemsrcp_warehous_id=-1))
      AND   ((itemsrcp_dropship=pDropship) OR (NOT itemsrcp_dropship))
      AND   (itemsrcp_qtybreak <= pQty) )
    ORDER BY seq, itemsrcp_qtybreak DESC
    LIMIT 1
       ) AS data
  ;

  RETURN _price;

END;
$$ LANGUAGE 'plpgsql';

