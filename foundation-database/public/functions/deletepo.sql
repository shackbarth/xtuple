CREATE OR REPLACE FUNCTION deletePo(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoheadid ALIAS FOR $1;
  _poitemid INTEGER;

BEGIN

  IF ( ( SELECT pohead_status
         FROM pohead
         WHERE (pohead_id=pPoheadid) ) = 'U' ) THEN

    -- Unlink from any Sales Orders
    UPDATE coitem SET coitem_order_type=NULL,
                      coitem_order_id=NULL
    FROM poitem 
    WHERE ( (coitem_order_type='P')
      AND   (coitem_order_id=poitem_id)
      AND   (poitem_pohead_id=pPoheadid) );

    DELETE FROM poitem
    WHERE (poitem_pohead_id=pPoheadid);

    DELETE FROM pohead
    WHERE (pohead_id=pPoheadid);

    RETURN TRUE;

  ELSE
    RETURN FALSE;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
