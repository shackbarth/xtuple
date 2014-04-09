CREATE OR REPLACE FUNCTION deletePr(CHAR, INTEGER) RETURNS BOOL AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pParentType ALIAS FOR $1;
  pParentId ALIAS FOR $2;

BEGIN

  DELETE FROM pr
  WHERE ((pr_status=''O'')
   AND (pr_order_type=pParentType)
   AND (pr_order_id=pParentId));

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION deletePr(INTEGER) RETURNS BOOL AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrid ALIAS FOR $1;

BEGIN

  DELETE FROM pr
  WHERE ( (pr_status=''O'')
   AND (pr_id=pPrid) );

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';
