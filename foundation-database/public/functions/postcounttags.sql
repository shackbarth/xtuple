CREATE OR REPLACE FUNCTION postCountTags(INTEGER, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWarehousid ALIAS FOR $1;
  pThaw ALIAS FOR $2;
  _invcnt RECORD;
  _result INTEGER := 0;
  _return INTEGER := 0;

BEGIN

  FOR _invcnt IN SELECT invcnt_id
                 FROM invcnt, itemsite
                 WHERE ( (invcnt_itemsite_id=itemsite_id)
                  AND ( (pWarehousid=-1) OR (itemsite_warehous_id=pWarehousid) )
                  AND (invcnt_qoh_after IS NOT NULL)
                  AND (NOT invcnt_posted) ) LOOP
    SELECT postCountTag(_invcnt.invcnt_id, pThaw) INTO _result;
    IF (_result < _return) THEN
      _return := _result;
    END IF;
  END LOOP;

  RETURN _return;

END;
' LANGUAGE 'plpgsql';
