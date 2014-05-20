CREATE OR REPLACE FUNCTION changeWoProject(INTEGER, INTEGER, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  pPrjid ALIAS FOR $2;
  changeChildren ALIAS FOR $3;
  woStatus CHAR(1);
  _result INTEGER;

BEGIN

  SELECT wo_status INTO woStatus
  FROM wo
  WHERE (wo_id=pWoid);

  UPDATE wo
  SET wo_prj_id=pPrjid
  WHERE (wo_id=pWoid);

  IF (woStatus = ''E'' AND changeChildren) THEN
    _result := ( SELECT MIN(changeWoProject(wo_id, pPrjid, TRUE))
                   FROM womatl, wo
                  WHERE ((womatl_itemsite_id=wo_itemsite_id)
                    AND (wo_ordtype=''W'')
                    AND (womatl_wo_id=pWoid)
                    AND (wo_ordid=pWoid)) );

    UPDATE pr SET pr_prj_id=pPrjid
      FROM womatl
     WHERE ((womatl_wo_id=pWoid)
       AND  (pr_order_type=''W'')
       AND  (pr_order_id=womatl_id));
  ELSE
    _result = 1;
  END IF;

  RETURN _result;
END;
' LANGUAGE 'plpgsql';
