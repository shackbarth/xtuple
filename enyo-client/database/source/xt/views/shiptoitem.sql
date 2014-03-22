-- Substitute for the custitem function which is too slow
select xt.create_view('xt.shiptoitem', $$

  -- Exclusive, Shipto match
  SELECT item_id, ipsass_shipto_id as shipto_id, ipshead_effective as effective, ipshead_expires as expires 
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_shipto_id != -1)
  UNION
  SELECT item_id, ipsass_shipto_id as shipto_id, ipshead_effective as effective, ipshead_expires as expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (ipsass_shipto_id != -1)
  UNION
   -- Exclusive, Shipto pattern match
  SELECT item_id, shipto_id, ipshead_effective as effective, ipshead_expires as expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_item_id=item_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN shiptoinfo ON (shipto_num ~ ipsass_shipto_pattern)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_shipto_pattern), 0) > 0)
   AND (ipsass_shipto_id != -1)
  UNION
  SELECT item_id, shipto_id, ipshead_effective as effective, ipshead_expires as expires
  FROM item
    JOIN ipsiteminfo ON (ipsitem_prodcat_id=item_prodcat_id)
    JOIN ipshead ON (ipshead_id=ipsitem_ipshead_id)
    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    JOIN shiptoinfo ON (shipto_num ~ ipsass_shipto_pattern)
  WHERE (item_exclusive)
   AND (item_sold)
   AND (COALESCE(length(ipsass_shipto_pattern), 0) > 0)
   AND (ipsass_shipto_id != -1)

$$);
