CREATE OR REPLACE FUNCTION copyItem(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSItemid ALIAS FOR $1;
  pTItemNumber ALIAS FOR $2;
  _itemid INTEGER;
  _r RECORD;
  _id INTEGER;

BEGIN

  SELECT NEXTVAL('item_item_id_seq') INTO _itemid;
  INSERT INTO item
  ( item_id, item_number, item_descrip1, item_descrip2,
    item_classcode_id, item_type,
    item_active, item_picklist, item_sold, item_fractional,
    item_maxcost, item_prodweight, item_packweight,
    item_prodcat_id,item_exclusive, item_listprice, item_listcost,
    item_config, item_comments, item_extdescrip,
    item_upccode, item_inv_uom_id, item_price_uom_id )
  SELECT _itemid, pTItemNumber, item_descrip1, item_descrip2,
         item_classcode_id, item_type,
         item_active, item_picklist, item_sold, item_fractional,
         item_maxcost, item_prodweight, item_packweight,
         item_prodcat_id, item_exclusive, item_listprice, item_listcost,
         item_config, item_comments, item_extdescrip,
         item_upccode, item_inv_uom_id, item_price_uom_id
  FROM item
  WHERE (item_id=pSItemid);

  INSERT INTO imageass
  (imageass_source_id, imageass_source, imageass_image_id, imageass_purpose)
  SELECT _itemid, 'I', imageass_image_id, imageass_purpose
  FROM imageass
  WHERE ((imageass_source_id=pSItemid)
  AND (imageass_source='I'));
  
  INSERT INTO url
  (url_source_id, url_source, url_title, url_url)
  SELECT _itemid, 'I', url_title, url_url
  FROM url
  WHERE ((url_source_id=pSItemid)
  AND (url_source='I'));

  INSERT INTO itemtax
        (itemtax_item_id, itemtax_taxzone_id, itemtax_taxtype_id)
  SELECT _itemid, itemtax_taxzone_id, itemtax_taxtype_id
    FROM itemtax
   WHERE(itemtax_item_id=pSItemid);

  INSERT INTO charass
  ( charass_target_type, charass_target_id,
    charass_char_id, charass_value )
  SELECT 'I', _itemid, charass_char_id, charass_value
  FROM charass
  WHERE ( (charass_target_type='I')
   AND (charass_target_id=pSItemid) );

  FOR _r IN SELECT itemuomconv_id,
                   itemuomconv_from_uom_id,
                   itemuomconv_from_value,
                   itemuomconv_to_uom_id,
                   itemuomconv_to_value,
                   itemuomconv_fractional
              FROM itemuomconv
             WHERE(itemuomconv_item_id=pSItemid) LOOP
    SELECT nextval('itemuomconv_itemuomconv_id_seq') INTO _id;
    INSERT INTO itemuomconv
          (itemuomconv_id, itemuomconv_item_id,
           itemuomconv_from_uom_id, itemuomconv_from_value,
           itemuomconv_to_uom_id, itemuomconv_to_value,
           itemuomconv_fractional)
    VALUES(_id, _itemid,
           _r.itemuomconv_from_uom_id, _r.itemuomconv_from_value,
           _r.itemuomconv_to_uom_id, _r.itemuomconv_to_value,
           _r.itemuomconv_fractional);

    INSERT INTO itemuom
          (itemuom_itemuomconv_id, itemuom_uomtype_id)
    SELECT _id, itemuom_uomtype_id
      FROM itemuom
     WHERE(itemuom_itemuomconv_id=_r.itemuomconv_id);
  END LOOP;

  RETURN _itemid;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION copyItem(INTEGER, TEXT, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSItemid ALIAS FOR $1;
  pTItemNumber ALIAS FOR $2;
  pCopyBOM ALIAS FOR $3;
  pCopyBOO ALIAS FOR $4;        -- deprecated - xtmfg-specific
  pCopyCosts ALIAS FOR $5;
BEGIN
  RAISE NOTICE 'copyItem(INTEGER, TEXT, BOOLEAN, BOOLEAN, BOOLEAN) has been deprecated.  Use copyItem(INTEGER, TEXT) or copyItem(INTEGER, TEXT, BOOLEAN, BOOLEAN) or a package-specific version instead.';
  RETURN copyItem(pSItemid, pTItemNumber, pCopyBOM, pCopyCosts);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION copyItem(INTEGER, TEXT, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSItemid      ALIAS FOR $1;
  pTItemNumber  ALIAS FOR $2;
  pCopyBOM      ALIAS FOR $3;
  pCopyCosts    ALIAS FOR $4;

  _itemid       INTEGER;
BEGIN

  _itemid := copyItem(pSItemid, pTItemNumber);

  IF (pCopyBOM) THEN
    PERFORM copyBOM(pSItemid, _itemid, FALSE);
  END IF;

  IF (pCopyCosts) THEN
    INSERT INTO itemcost
    ( itemcost_item_id, itemcost_costelem_id, itemcost_lowlevel,
      itemcost_stdcost, itemcost_posted,
      itemcost_actcost, itemcost_curr_id, itemcost_updated )
    SELECT _itemid, itemcost_costelem_id, itemcost_lowlevel,
      itemcost_stdcost, CURRENT_DATE,
      itemcost_actcost, itemcost_curr_id, CURRENT_DATE
    FROM itemcost
    WHERE (itemcost_item_id=pSItemid);
  END IF;

  RETURN _itemid;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION copyItem(INTEGER, TEXT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSItemid ALIAS FOR $1;
  pTItemNumber ALIAS FOR $2;
  pCopyBOM ALIAS FOR $3;
  pCopyBOO ALIAS FOR $4;        -- deprecated - xtmfg-specific
  pCopyCosts ALIAS FOR $5;
  pCopyUsedAt ALIAS FOR $6;     -- deprecated - xtmfg-specific
BEGIN
  RETURN copyItem(pSItemid, pTItemNumber, pCopyBOM, pCopyCosts);
END;
$$ LANGUAGE 'plpgsql';
