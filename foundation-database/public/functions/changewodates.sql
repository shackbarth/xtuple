
CREATE OR REPLACE FUNCTION changeWoDates(INTEGER, DATE, DATE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE 
  pWoid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pDueDate ALIAS FOR $3;
  changeChildren ALIAS FOR $4;
  _p RECORD;
  returnCode INTEGER;
  _vtemp NUMERIC;

BEGIN

  SELECT wo_status, wo_startdate, itemsite_warehous_id INTO _p
  FROM wo
  Inner Join itemsite on
      wo_itemsite_id=itemsite_id
  WHERE (wo_id=pWoid);

  IF (_p.wo_status = 'C') THEN 
    returnCode := 0;

  ELSIF (_p.wo_status IN ('R','I')) THEN
    PERFORM postEvent('RWoDueDateRequestChange', 'W', wo_id,
                      itemsite_warehous_id, formatWoNumber(wo_id),
                      NULL, NULL, pDueDate, wo_duedate)
    FROM wo JOIN itemsite ON (itemsite_id=wo_itemsite_id)
            JOIN item ON (item_id=itemsite_item_id)
    WHERE (wo_id=pWoid);

     returnCode := 0;

  END IF;
  
--  Reschedule operations if routings enabled
  IF (fetchMetricBool('Routings')) THEN

--    Reschedule wooper
    IF (fetchMetricBool('UseSiteCalendar')) THEN
      UPDATE xtmfg.wooper
      SET wooper_scheduled = calculatenextworkingdate(itemsite_warehous_id,DATE(pStartDate),
                             CAST(calculateworkdays(itemsite_warehous_id, DATE(wo_startdate), DATE(wooper_scheduled)) as INTEGER))
      FROM wo JOIN itemsite ON (wo_itemsite_id=itemsite_id)
      WHERE ( (wooper_wo_id=wo_id)
        AND   (wo_id=pWoid) );
    ELSE
      UPDATE xtmfg.wooper
      SET wooper_scheduled = (wooper_scheduled::DATE + (pStartDate - wo_startdate))
      FROM wo
      WHERE ( (wooper_wo_id=wo_id)
        AND   (wo_id=pWoid) );
    END IF;

--    Reschedule any womatl that is linked to wooper items
--    and is set to be scheduled with the wooper in question
    UPDATE womatl
    SET womatl_duedate=wooper_scheduled
    FROM xtmfg.wooper
    WHERE ( (womatl_schedatwooper)
     AND (womatl_wooper_id=wooper_id)
     AND (womatl_wo_id=pWoid) );

  END IF;

-- Reschedule any womatl that is not linked to wooper items
  UPDATE womatl
  SET womatl_duedate=pStartDate
  WHERE ( (NOT womatl_schedatwooper)
   AND (womatl_wo_id=pWoid) );

--  Reschedule the W/O
  UPDATE wo
  SET wo_startdate=pStartDate,
      wo_duedate=pDueDate
  WHERE (wo_id=pWoid);

--  Do the same for the children
  IF (changeChildren) THEN
    SELECT MAX(changeWoDates(wo_id, (pStartDate - itemsite_leadtime), pStartDate, TRUE)) INTO returnCode
    FROM wo, itemsite
    WHERE ( (wo_itemsite_id=itemsite_id)
     AND (wo_ordtype='W')
     AND (wo_ordid=pWoid) );
  END IF;

  IF (returnCode IS NULL) THEN
    returnCode := 0;
  END IF;

  RETURN returnCode;

END;
$$ LANGUAGE 'plpgsql';
