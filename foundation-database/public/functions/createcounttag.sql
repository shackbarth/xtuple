CREATE OR REPLACE FUNCTION createCountTag(int, text, bool, bool) RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pComments ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pFreeze ALIAS FOR $4;
BEGIN
  RETURN createCountTag(pItemsiteid, pComments, pPriority, pFreeze, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createcounttag(integer, text, boolean, boolean, integer)
  RETURNS integer AS $$

-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pComments ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pFreeze ALIAS FOR $4;
  pLocationid ALIAS FOR $5;
  _invcntid INTEGER;
  _whs		RECORD;
  _type CHARACTER;
  _controlmethod        CHARACTER;

BEGIN

  SELECT item_type, itemsite_controlmethod INTO _type, _controlmethod
    FROM itemsite, item
   WHERE ((itemsite_item_id=item_id)
     AND  (itemsite_id=pItemsiteid));

  IF (NOT FOUND OR _type IN ('F', 'R', 'L','J') OR _controlmethod = 'N') THEN
    RETURN 0; -- We simply do not do these item types.
  END IF;

  -- Test for existing tags
   IF (pLocationid IS NULL) THEN
       SELECT invcnt_id INTO _invcntid
       FROM invcnt
       WHERE ((NOT invcnt_posted)
       AND (invcnt_location_id IS NULL)
       AND (invcnt_itemsite_id=pItemsiteid));
  
  ELSE

    SELECT invcnt_id INTO _invcntid
     FROM invcnt
     WHERE ((NOT invcnt_posted)
     AND (invcnt_itemsite_id=pItemsiteid)
     AND (invcnt_location_id=pLocationid));
  END IF;

  IF (NOT FOUND) THEN
    SELECT NEXTVAL('invcnt_invcnt_id_seq') INTO _invcntid;

    SELECT whsinfo.* INTO _whs
      FROM whsinfo, itemsite
     WHERE ((warehous_id=itemsite_warehous_id)
       AND  (itemsite_id=pItemsiteid));

    INSERT INTO invcnt (
      invcnt_id, invcnt_itemsite_id, invcnt_tagdate,
      invcnt_tagnumber,
      invcnt_tag_username, invcnt_posted,
      invcnt_priority, invcnt_comments, invcnt_location_id
    ) VALUES (
      _invcntid, pItemsiteid, CURRENT_TIMESTAMP,
      (_whs.warehous_counttag_prefix || _whs.warehous_counttag_number::TEXT),
      getEffectiveXtUser(), FALSE,
      pPriority, pComments, pLocationid
    );

    UPDATE whsinfo
    SET warehous_counttag_number=(warehous_counttag_number + 1)
    WHERE (warehous_id=_whs.warehous_id);

    IF (pFreeze) THEN
      UPDATE itemsite
      SET itemsite_freeze=TRUE
      WHERE (itemsite_id=pItemsiteid);
    END IF;

  END IF;

  RETURN _invcntid;
END;
$$ LANGUAGE 'plpgsql';
