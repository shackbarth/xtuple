CREATE OR REPLACE FUNCTION findSalesAccnt(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN findSalesAccnt($1, 'IS', $2, NULL, NULL);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION findSalesAccnt(INTEGER, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN findSalesAccnt($1, $2, $3, NULL, NULL);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION findSalesAccnt(pid INTEGER,
                                          pidType TEXT,
                                          pCustid INTEGER,
                                          pSaletypeid INTEGER,
                                          pShipzoneid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _s RECORD;

BEGIN

  IF (pidType = 'I') THEN
    --  Check for a custtype specific rule
    SELECT salesaccnt_id,
           CASE WHEN (salesaccnt_warehous_id<>-1) THEN 1 ELSE 0 END +
           CASE WHEN (salesaccnt_custtype_id<>-1) THEN 2 ELSE 0 END +
           CASE WHEN (salesaccnt_prodcat_id<>-1) THEN 3 ELSE 0 END +
           CASE WHEN (salesaccnt_shipzone_id<>-1) THEN 4 ELSE 0 END +
           CASE WHEN (salesaccnt_saletype_id<>-1) THEN 5 ELSE 0 END AS orderby
    INTO _s
    FROM salesaccnt, item, prodcat, custinfo, custtype
    WHERE ( (salesaccnt_warehous_id=-1)
      AND  (item_prodcat_id=prodcat_id)
      AND  (cust_custtype_id=custtype_id)
      AND  ( (salesaccnt_prodcat='.*') OR
	    ( (salesaccnt_prodcat_id=-1) AND
	      (salesaccnt_prodcat<>'') AND
	      (prodcat_code ~ salesaccnt_prodcat) ) OR
	    ( (salesaccnt_prodcat_id=prodcat_id) ) )
      AND  ( (salesaccnt_custtype='.*') OR
	    ( (salesaccnt_custtype_id=-1) AND
	      (salesaccnt_custtype<>'') AND
	      (custtype_code ~ salesaccnt_custtype) ) OR
	    ( (salesaccnt_custtype_id=custtype_id) ) )
      AND  ( (salesaccnt_shipzone_id=-1) OR
	     (salesaccnt_shipzone_id=pShipzoneid) )
      AND  ( (salesaccnt_saletype_id=-1) OR
	     (salesaccnt_saletype_id=pSaletypeid) )
      AND (item_id=pid)
      AND (cust_id=pCustid) )
    ORDER BY orderby DESC, salesaccnt_custtype DESC, salesaccnt_prodcat DESC,
             salesaccnt_saletype_id DESC, salesaccnt_shipzone_id DESC
     LIMIT 1;

  ELSIF (pidType = 'IS') THEN
    --  Check for a custtype specific rule
    SELECT salesaccnt_id,
           CASE WHEN (salesaccnt_warehous_id<>-1) THEN 1 ELSE 0 END +
           CASE WHEN (salesaccnt_custtype_id<>-1) THEN 2 ELSE 0 END +
           CASE WHEN (salesaccnt_prodcat_id<>-1) THEN 3 ELSE 0 END +
           CASE WHEN (salesaccnt_shipzone_id<>-1) THEN 4 ELSE 0 END +
           CASE WHEN (salesaccnt_saletype_id<>-1) THEN 5 ELSE 0 END AS orderby
    INTO _s
    FROM salesaccnt, itemsite, item, prodcat, custinfo, custtype
    WHERE ( ( (salesaccnt_warehous_id=-1) OR
	      (salesaccnt_warehous_id=itemsite_warehous_id) )
     AND (itemsite_item_id=item_id)
     AND (item_prodcat_id=prodcat_id)
     AND (cust_custtype_id=custtype_id)
     AND ( (salesaccnt_prodcat='.*') OR
	   ( (salesaccnt_prodcat_id=-1) AND
	     (salesaccnt_prodcat<>'') AND
	     (prodcat_code ~ salesaccnt_prodcat) ) OR
	   ( (salesaccnt_prodcat_id=prodcat_id) ) )
     AND ( (salesaccnt_custtype='.*') OR
	   ( (salesaccnt_custtype_id=-1) AND
	     (salesaccnt_custtype<>'') AND
	     (custtype_code ~ salesaccnt_custtype) ) OR
	   ( (salesaccnt_custtype_id=custtype_id) ) )
     AND  ( (salesaccnt_shipzone_id=-1) OR
            (salesaccnt_shipzone_id=pShipzoneid) )
     AND  ( (salesaccnt_saletype_id=-1) OR
            (salesaccnt_saletype_id=pSaletypeid) )
     AND (itemsite_id=pid)
     AND (cust_id=pCustid) ) 
    ORDER BY orderby DESC, salesaccnt_custtype DESC, salesaccnt_prodcat DESC, salesaccnt_warehous_id DESC,
             salesaccnt_saletype_id DESC, salesaccnt_shipzone_id DESC
    LIMIT 1;

  ELSE
    RETURN -2;	-- invalid pidType
  END IF;

  IF (FOUND) THEN
    RETURN _s.salesaccnt_id;
  END IF;

  RETURN -1;

END;
$$
    LANGUAGE plpgsql;
