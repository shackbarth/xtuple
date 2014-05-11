CREATE OR REPLACE FUNCTION postMiscCount(pItemsiteid INTEGER,
                                         pQty NUMERIC,
                                         pComments TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pComments ALIAS FOR $3;
  _invcntid INTEGER;
  _result INTEGER;

BEGIN

--  Make sure the passed itemsite points to a real item
  IF ( ( SELECT (item_type IN ('R', 'F') OR itemsite_costmethod = 'J')
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

  SELECT invcnt_id INTO _invcntid
  FROM invcnt
  WHERE ( (NOT invcnt_posted)
   AND (invcnt_itemsite_id=pItemsiteid) );

  IF (_invcntid IS NULL) THEN
    _invcntid := NEXTVAL('invcnt_invcnt_id_seq');

    INSERT INTO invcnt
     ( invcnt_id, invcnt_itemsite_id, invcnt_tagdate,
       invcnt_qoh_before, invcnt_qoh_after,
       invcnt_tag_username, invcnt_cntdate, invcnt_cnt_username,
       invcnt_postdate, invcnt_post_username, invcnt_posted,
       invcnt_priority, invcnt_comments )
    SELECT _invcntid, pItemsiteid, now(),
           itemsite_qtyonhand, pQty,
           getEffectiveXtUser(), now(), getEffectiveXtUser(),
           now(), getEffectiveXtUser(), FALSE,
           FALSE, pComments
    FROM itemsite
    WHERE (itemsite_id=pItemsiteid);

    SELECT postCountTag(_invcntid, FALSE) INTO _result;
    IF (_result < 0) THEN
      DELETE FROM invcnt
      WHERE (invcnt_id=_invcntid);
    END IF;

    RETURN _result;
  ELSE
    RETURN -2;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
