CREATE OR REPLACE FUNCTION custitem(cust_id INTEGER, shipto_id INTEGER DEFAULT -1, asof DATE DEFAULT CURRENT_DATE) RETURNS SETOF integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.

  -- Non Exclusive
  SELECT item_id
  FROM item 
  WHERE (NOT item_exclusive)
   AND (item_sold)
  UNION
  -- Exclusive, Shipto match
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND ($2 != -1)
   AND (ipsass_shipto_id=$2)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND ($2 != -1)
   AND (ipsass_shipto_id=$2)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
   -- Exclusive, Shipto pattern match
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN shiptoinfo ON (shipto_num ~ ipsass_shipto_pattern)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_shipto_pattern), 0) > 0)
   AND (ipsass_cust_id=$1)
   AND ($2 != -1)
   AND (shipto_id=$2)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN shiptoinfo ON (shipto_num ~ ipsass_shipto_pattern)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_shipto_pattern), 0) > 0)
   AND (ipsass_cust_id=$1)
   AND ($2 != -1)
   AND (shipto_id=$2)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
   -- Exclusive, Customer match
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_cust_id=$1)
   AND (ipsass_shipto_id=-1)
   AND (ipsass_shipto_pattern='')
   AND (ipsass_custtype_id=-1)
   AND (ipsass_custtype_pattern='')
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_cust_id=$1)
   AND (ipsass_shipto_id=-1)
   AND (ipsass_shipto_pattern='')
   AND (ipsass_custtype_id=-1)
   AND (ipsass_custtype_pattern='')
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
  -- Exclusive, Customer Type match
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custinfo ON (ipsass_custtype_id=cust_custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (cust_id=$1)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custinfo ON (ipsass_custtype_id=cust_custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (cust_id=$1)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
  -- Exclusive, Customer Type pattern match
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custtype ON (custtype_code ~ ipsass_custtype_pattern)
    JOIN custinfo ON (cust_custtype_id=custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_custtype_pattern), 0) > 0)
   AND (cust_id=$1)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
  UNION
  SELECT item_id
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custtype ON (custtype_code ~ ipsass_custtype_pattern)
    JOIN custinfo ON (cust_custtype_id=custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_custtype_pattern), 0) > 0)
   AND (cust_id=$1)
   AND ($3 BETWEEN ipshead_effective AND (ipshead_expires - 1))
   
$$ LANGUAGE 'sql';

