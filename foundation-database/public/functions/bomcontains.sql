CREATE OR REPLACE FUNCTION BOMContains(INTEGER, INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pparentitemid	ALIAS FOR $1;
  pchilditemid	ALIAS FOR $2;
  _bomworksetid	INTEGER;
  _result	BOOLEAN;

BEGIN
  _bomworksetid := indentedWhereUsed(pchilditemid);
  _result := EXISTS(SELECT bomwork_id
		    FROM bomwork
		    WHERE ((bomwork_set_id=_bomworksetid)
		      AND  (bomwork_item_id=pparentitemid) ));

  PERFORM deleteBOMWorkset(_bomworksetid);

  RETURN _result;
END;
' LANGUAGE 'plpgsql';

