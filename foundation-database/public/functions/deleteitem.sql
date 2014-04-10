CREATE OR REPLACE FUNCTION deleteItem(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _result INTEGER;

BEGIN

  SELECT bomitem_id INTO _result
  FROM bomitem
  WHERE (bomitem_item_id=pItemid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  SELECT itemsite_id INTO _result
  FROM itemsite
  WHERE (itemsite_item_id=pItemid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  SELECT itemsub_id INTO _result
  FROM itemsub
  WHERE (itemsub_sub_item_id=pItemid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  IF (fetchmetricbool('RevControl')) THEN
    SELECT rev_id INTO _result
    FROM rev
    WHERE ((rev_target_id=pItemid)
    AND (rev_target_type = 'BOM'))
    LIMIT 1;
    IF (FOUND) THEN
      RETURN -6;
    END IF;
  END IF;

  DELETE FROM bomhead
  WHERE (bomhead_item_id=pItemid);
  DELETE FROM bomitem
  WHERE (bomitem_item_id=pItemid);

  DELETE FROM itemcost
  WHERE (itemcost_item_id=pItemid);
  DELETE FROM costhist
  WHERE (costhist_item_id=pItemid);

  DELETE FROM itemsub
  WHERE (itemsub_parent_item_id=pItemid);
  DELETE FROM itemsub
  WHERE (itemsub_sub_item_id=pItemid);

  DELETE FROM itemsrcp
  WHERE (itemsrcp_itemsrc_id IN (SELECT itemsrc_id FROM itemsrc WHERE (itemsrc_item_id=pItemid)));
  DELETE FROM itemsrc
  WHERE (itemsrc_item_id=pItemid);

  DELETE FROM itemalias
  WHERE (itemalias_item_id=pItemid);

  DELETE FROM itemgrpitem
  WHERE (itemgrpitem_item_id=pItemid);

  DELETE FROM ipsiteminfo
  WHERE (ipsitem_item_id=pItemid);

  DELETE FROM imageass
  WHERE ( (imageass_source='I')
    AND   (imageass_source_id=pItemid) );

  DELETE FROM locitem
  WHERE (locitem_item_id=pItemid);

  DELETE FROM itemtax
   WHERE(itemtax_item_id=pItemid);

  DELETE FROM itemsite
  WHERE (itemsite_item_id=pItemid);

  DELETE FROM itemuom
   WHERE(itemuom_itemuomconv_id IN (SELECT itemuomconv_id
                                      FROM itemuomconv
                                     WHERE(itemuomconv_item_id=pItemid)));

  DELETE FROM itemuomconv
   WHERE(itemuomconv_item_id=pItemid);

  DELETE FROM item
  WHERE (item_id=pItemid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
