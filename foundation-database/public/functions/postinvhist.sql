CREATE OR REPLACE FUNCTION postInvHist( INTEGER ) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvhistId ALIAS FOR $1;
  _r RECORD;
BEGIN

    IF ( SELECT metric_value
        FROM metric
        WHERE ((metric_name = 'EnableAsOfQOH')
        AND (metric_value = 't'))) THEN
      IF (NOT postIntoInvBalance(pInvhistId)) THEN
        RAISE EXCEPTION 'Post into Inventory Balance for invhist_id=% was unsuccessful',pInvhistId;
      END IF;
    END IF;

    --Update itemsite qoh and change posted flag
    UPDATE itemsite SET 
      itemsite_qtyonhand = (itemsite_qtyonhand + (invhist_invqty * invhistSense(invhist_id))),
      itemsite_value = itemsite_value + invhist_value_after - invhist_value_before
    FROM invhist
    WHERE ( (itemsite_id=invhist_itemsite_id)
    AND (invhist_id=pInvhistId)
    AND (NOT invhist_posted) );

    --Flag as posted
    UPDATE invhist SET
      invhist_posted=TRUE
    WHERE ( (invhist_id=pInvhistId)
    AND (invhist_posted=FALSE) );

RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';
