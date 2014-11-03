CREATE OR REPLACE FUNCTION thawItemSite(pItemsiteid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qoh            NUMERIC := 0;
  _value          NUMERIC := 0;
  _itemlocid INTEGER;
  _itemloc RECORD;
  _invhist RECORD;
  _coarse RECORD;
  _fine RECORD;

BEGIN

  IF ( SELECT itemsite_freeze
       FROM itemsite
       WHERE (itemsite_id=pItemsiteid) ) THEN

    SELECT invhist_id INTO _invhist
    FROM invhist
    WHERE ( (invhist_itemsite_id=pItemsiteid)
     AND (NOT invhist_posted) )
    LIMIT 1;
    IF (NOT FOUND) THEN
      UPDATE itemsite
      SET itemsite_freeze=FALSE
      WHERE (itemsite_id=pItemsiteid);
   END IF;

--  Run through any invdetail if this itemsite is still MLC and/or Lot/Serial
    IF ( SELECT ( (itemsite_loccntrl) OR
                  (itemsite_controlmethod IN ('L', 'S')) )
         FROM itemsite
         WHERE (itemsite_id=pItemsiteid) ) THEN

--  Grab all of the itemsite/location/lot/serial combinations
--  that have unposted detail
      FOR _coarse IN SELECT DISTINCT invdetail_location_id, invdetail_ls_id,
                                     invdetail_expiration, invdetail_warrpurc
                     FROM invhist, invdetail
                     WHERE ( (invdetail_invhist_id=invhist_id)
                      AND (NOT invhist_posted)
                      AND (invhist_itemsite_id=pItemsiteid) )
                     ORDER BY invdetail_location_id, invdetail_ls_id LOOP

--  Cache the initial qty of the itemloc specified by the
--  itemsite/location/lot/serial
        SELECT itemloc_id, itemloc_qty
        INTO _itemloc
        FROM itemloc
        WHERE ( (itemloc_itemsite_id=pItemsiteid)
         AND (itemloc_location_id=_coarse.invdetail_location_id)
         AND (COALESCE(itemloc_ls_id,-1)=COALESCE(_coarse.invdetail_ls_id,-1))
         AND (COALESCE(itemloc_expiration,endOfTime())=COALESCE(_coarse.invdetail_expiration,endOfTime()))
         AND (COALESCE(itemloc_warrpurc,endOfTime())=COALESCE(_coarse.invdetail_warrpurc,endOfTime())) );

--  If the itemloc in question cannot be found, create it
        IF (NOT FOUND) THEN
          SELECT NEXTVAL('itemloc_itemloc_id_seq') INTO _itemlocid;
          INSERT INTO itemloc
          ( itemloc_id, itemloc_itemsite_id,
            itemloc_location_id, itemloc_ls_id,
            itemloc_qty, itemloc_expiration )
          VALUES
          ( _itemlocid, pItemsiteid,
            _coarse.invdetail_location_id, _coarse.invdetail_ls_id,
            0, endOfTime() );

        _qoh := 0.0;

        ELSE
          _itemlocid := _itemloc.itemloc_id;
          _qoh := _itemloc.itemloc_qty;
        END IF;

--  Now step through each unposted invdetail record for a given
--  itemsite/location/lot/serial
        FOR _fine IN SELECT invdetail_id, invdetail_qty
                     FROM invhist, invdetail
                     WHERE ( (invdetail_invhist_id=invhist_id)
                      AND (NOT invhist_posted)
                      AND (invhist_itemsite_id=pItemsiteid)
                      AND (invdetail_location_id=_coarse.invdetail_location_id)
                      AND (COALESCE(invdetail_ls_id,-1)=COALESCE(_coarse.invdetail_ls_id,-1))
                      AND (COALESCE(invdetail_expiration,endOfTime())=COALESCE(_coarse.invdetail_expiration,endOfTime()))
                      AND (COALESCE(invdetail_warrpurc,endOfTime())=COALESCE(_coarse.invdetail_warrpurc,endOfTime())) )
                     ORDER BY invhist_transdate LOOP

--  Update the running qoh fields in the detail record
          UPDATE invdetail
          SET invdetail_qty_before = _qoh,
              invdetail_qty_after = (_qoh + invdetail_qty)
          WHERE (invdetail_id=_fine.invdetail_id);

--  Update the running qoh
          _qoh = (_qoh + _fine.invdetail_qty);

        END LOOP;

--  If the running qoh end up at 0, delete the itemloc in question
        IF (_qoh = 0) THEN
          DELETE FROM itemloc
          WHERE (itemloc_id=_itemlocid);

--  Otherwise, update the itemloc in question with the resultant qty
        ELSE
          UPDATE itemloc
          SET itemloc_qty=_qoh
          WHERE (itemloc_id=_itemlocid);
        END IF;

      END LOOP;

    END IF; 

--  Cache the inital qoh of the itemsite
    SELECT itemsite_qtyonhand, itemsite_value INTO _qoh, _value
    FROM itemsite
    WHERE (itemsite_id=pItemsiteid);

--  We have to un-freeze the itemsite before update-ing its QOH
--  so that that itemsite trigger won't block the QOH update.
--  Also so the invhist trigger won't block the posted update.

    UPDATE itemsite
    SET itemsite_freeze=FALSE
    WHERE (itemsite_id=pItemsiteid);

    FOR _invhist IN SELECT invhist_id,
                           invhist_qoh_before, invhist_qoh_after,
                           invhist_value_before, invhist_value_after
                      FROM invhist
                     WHERE((invhist_itemsite_id=pItemsiteid)
                       AND (NOT invhist_posted))
                     ORDER BY invhist_transdate LOOP

      UPDATE invhist
      SET invhist_qoh_before = _qoh,
          invhist_qoh_after = ( _qoh +
                                _invhist.invhist_qoh_after -
                                _invhist.invhist_qoh_before ),
          invhist_value_before = _value,
          invhist_value_after = ( _value +
                                  _invhist.invhist_value_after -
                                  _invhist.invhist_value_before ),
          invhist_posted = TRUE
      WHERE (invhist_id=_invhist.invhist_id);

      _qoh := (_qoh + (_invhist.invhist_qoh_after - _invhist.invhist_qoh_before));
      _value := (_value + (_invhist.invhist_value_after - _invhist.invhist_value_before));

    END LOOP;

    UPDATE itemsite
       SET itemsite_qtyonhand = _qoh,
           itemsite_value = CASE WHEN ((itemsite_costmethod='A') AND (_value < 0.0)) THEN 0.0
                                 ELSE _value END
     WHERE(itemsite_id=pItemsiteid);

  END IF;

  RETURN pItemsiteid;

END;
$$ LANGUAGE plpgsql;
