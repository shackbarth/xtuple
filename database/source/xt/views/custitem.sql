-- Substitute for the custitem function which is too slow
select xt.create_view('xt.custitem', $$

   -- Exclusive, Customer match
  SELECT item_id, ipsass_cust_id as cust_id, ipshead_effective as effective, ipshead_expires as expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_shipto_id=-1)
   AND (ipsass_shipto_pattern='')
   AND (ipsass_custtype_id=-1)
   AND (ipsass_custtype_pattern='')
  UNION
  SELECT item_id, ipsass_cust_id, ipshead_effective, ipshead_expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_shipto_id=-1)
   AND (ipsass_shipto_pattern='')
   AND (ipsass_custtype_id=-1)
   AND (ipsass_custtype_pattern='')
  UNION
  -- Exclusive, Customer Type match
  SELECT item_id, cust_id, ipshead_effective, ipshead_expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custinfo ON (ipsass_custtype_id=cust_custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_shipto_id=-1)
   AND (ipsass_shipto_pattern='')
  UNION
  SELECT item_id, cust_id, ipshead_effective, ipshead_expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custinfo ON (ipsass_custtype_id=cust_custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_shipto_id=-1)
   AND (ipsass_shipto_pattern='')
  UNION
  -- Exclusive, Customer Type pattern match
  SELECT item_id, cust_id, ipshead_effective, ipshead_expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custtype ON (custtype_code ~ ipsass_custtype_pattern)
    JOIN custinfo ON (cust_custtype_id=custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_custtype_pattern), 0) > 0)
   AND (ipsass_shipto_id=-1)
   AND (ipsass_shipto_pattern='')
  UNION
  SELECT item_id, cust_id, ipshead_effective, ipshead_expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN custtype ON (custtype_code ~ ipsass_custtype_pattern)
    JOIN custinfo ON (cust_custtype_id=custtype_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_custtype_pattern), 0) > 0)

$$);
