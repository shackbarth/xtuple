CREATE OR REPLACE FUNCTION rollUpSorACost(INTEGER, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid	ALIAS FOR $1;
  pActual	ALIAS FOR $2;
  _counter INTEGER;
  _setid INTEGER;
  _consumers RECORD;

BEGIN

  _counter := 0;

  SELECT indentedWhereUsed(pItemid) INTO _setid;

  FOR _consumers IN SELECT bomwork_item_id
                    FROM bomwork
                    WHERE (bomwork_set_id=_setid)
                    ORDER BY bomwork_level LOOP
    PERFORM updateSorACost( _consumers.bomwork_item_id, costelem_type, TRUE,
			    lowerCost(_consumers.bomwork_item_id,
				      costelem_type, pActual),
			    pActual )
    FROM costelem
    WHERE (costelem_sys);

    PERFORM updateLowerUserCosts(_consumers.bomwork_item_id, pActual);

    _counter := _counter + 1;

  END LOOP;

  PERFORM deleteBOMWorkset(_setid);

  RETURN _counter;

END;
' LANGUAGE 'plpgsql';
