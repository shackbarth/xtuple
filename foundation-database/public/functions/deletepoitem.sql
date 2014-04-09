
CREATE OR REPLACE FUNCTION deletepoitem(integer) RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoitemid ALIAS FOR $1;
  _poheadid INTEGER := -1;
  _status CHARACTER;

BEGIN
  SELECT poitem_pohead_id, poitem_status INTO _poheadid, _status
  FROM poitem
  WHERE (poitem_id=pPoitemid);

  IF NOT(FOUND) THEN
    RETURN 0;
  END IF;

  IF ( _status = 'U' ) THEN
    DELETE FROM poitem
    WHERE (poitem_id=pPoitemid);
  ELSE   
    IF ( _status = 'O' ) THEN
      PERFORM recv_id
      FROM recv
      WHERE ( (recv_order_type='PO')
       AND (recv_orderitem_id=pPoitemid) );
      IF (FOUND) THEN
        RETURN -10;
      ELSE
        RETURN -20;
      END IF;
    ELSE
      RETURN -10;
    END IF;
  END IF;

  PERFORM poitem_id
  FROM poitem
  WHERE poitem_pohead_id = _poheadid;

  IF NOT(FOUND) THEN
    DELETE FROM pohead
    WHERE (pohead_id = _poheadid);
  END IF;
  
  RETURN 0;

END;
$$ LANGUAGE 'plpgsql' VOLATILE;
