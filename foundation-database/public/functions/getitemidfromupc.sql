
CREATE OR REPLACE FUNCTION getitemidfromupc(text)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemUPC ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pItemUPC IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT item_id INTO _returnVal
  FROM item
  WHERE (item_upccode=UPPER(pItemUPC));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Item % not found.', pItemUPC;
  END IF;

  RETURN _returnVal;
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;

