CREATE OR REPLACE FUNCTION deleteItemUOMConv(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemuomconvid ALIAS FOR $1;
  _fromuomid     INTEGER;
  _invuomid      INTEGER;
  _itemid        INTEGER;
  _touomid       INTEGER;

BEGIN
  SELECT itemuomconv_item_id, item_inv_uom_id,
         itemuomconv_from_uom_id, itemuomconv_to_uom_id
          INTO _itemid, _invuomid, _fromuomid, _touomid
  FROM itemuomconv JOIN item ON (itemuomconv_item_id=item_id)
  WHERE (itemuomconv_id=pItemuomconvid);

  IF EXISTS(SELECT *
            FROM uomusedforitem(_itemid)
            WHERE ((uom_id IN (_fromuomid, _touomid))
               AND (uom_id != _invuomid)) ) THEN
    RETURN -1;
  END IF;

  DELETE FROM itemuom WHERE itemuom_itemuomconv_id=pItemuomconvid;
  DELETE FROM itemuomconv WHERE itemuomconv_id=pItemuomconvid;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';
