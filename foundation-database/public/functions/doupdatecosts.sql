CREATE OR REPLACE FUNCTION doUpdateCosts(BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  plowerMaterial ALIAS FOR $1;
  pdirectLabor ALIAS FOR $2;
  plowerDirectLabor ALIAS FOR $3;
  poverhead ALIAS FOR $4;
  plowerOverhead ALIAS FOR $5;
  pmachOverhead ALIAS FOR $6;
  plowerMachOverhead ALIAS FOR $7;
  plowerUser ALIAS FOR $8;
  prollUp ALIAS FOR $9;

BEGIN
  RETURN doUpdateCosts(plowerMaterial, pdirectLabor, plowerDirectLabor,
		       poverhead, plowerOverhead, pmachOverhead,
		       plowerMachOverhead, plowerUser, prollUp, TRUE);
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION doUpdateCosts(BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  plowerMaterial ALIAS FOR $1;
  pdirectLabor ALIAS FOR $2;
  plowerDirectLabor ALIAS FOR $3;
  poverhead ALIAS FOR $4;
  plowerOverhead ALIAS FOR $5;
  pmachOverhead ALIAS FOR $6;
  plowerMachOverhead ALIAS FOR $7;
  plowerUser ALIAS FOR $8;
  prollUp ALIAS FOR $9;
  pActual ALIAS FOR $10;
  _item RECORD;
  _bom RECORD;
  _result INTEGER := 0;

BEGIN

  PERFORM resetLowLevelCode(-1);

  FOR _item IN SELECT costUpdate_item_id
            FROM costUpdate
            ORDER BY costUpdate_lowlevel_code DESC LOOP
    PERFORM doUpdateCosts(_item.costUpdate_item_id, false, plowerMaterial,
		  pdirectLabor, plowerDirectLabor, poverhead, plowerOverhead,
		  pmachOverhead, plowerMachOverhead, plowerUser, prollUp,
		  pActual);
  END LOOP;

  RETURN _result;

END;
 ' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION doUpdateCosts(INTEGER, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  pItemId ALIAS FOR $1;
  pResetLowLevel ALIAS FOR $2;
  plowerMaterial ALIAS FOR $3;
  pdirectLabor ALIAS FOR $4;
  plowerDirectLabor ALIAS FOR $5;
  poverhead ALIAS FOR $6;
  plowerOverhead ALIAS FOR $7;
  pmachOverhead ALIAS FOR $8;
  plowerMachOverhead ALIAS FOR $9;
  plowerUser ALIAS FOR $10;
  prollUp ALIAS FOR $11;

BEGIN
    RETURN doUpdateCosts(pItemId, pResetLowLevel, plowerMaterial, pdirectLabor,
			 plowerDirectLabor, poverhead, plowerOverhead,
			 pmachOverhead, plowerMachOverhead, plowerUser, prollUp,
			 TRUE);
END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION doUpdateCosts(INTEGER, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  pItemId ALIAS FOR $1;
  pResetLowLevel ALIAS FOR $2;
  plowerMaterial ALIAS FOR $3;
  pdirectLabor ALIAS FOR $4;
  plowerDirectLabor ALIAS FOR $5;
  poverhead ALIAS FOR $6;
  plowerOverhead ALIAS FOR $7;
  pmachOverhead ALIAS FOR $8;
  plowerMachOverhead ALIAS FOR $9;
  plowerUser ALIAS FOR $10;
  prollUp ALIAS FOR $11;
  pUpdateActual ALIAS FOR $12;
  _item RECORD;
  _bom RECORD;
  _result INTEGER := 0;
  _resultFromReset INTEGER;
  _counterNum INTEGER;
  _feedBackNum INTEGER;

BEGIN

    IF (pResetLowLevel) THEN
	PERFORM resetLowLevelCode(pItemId);
    END IF;

    SELECT costUpdate_item_id AS item_id, costUpdate_item_type AS item_type
	INTO _item
    FROM costUpdate
    WHERE costUpdate_item_id = pItemId;

    IF ((plowerMaterial) AND ((_item.item_type <> ''P'') AND (_item.item_type <> ''O''))) THEN    
      PERFORM updateSorACost(_item.item_id, ''Material'', TRUE, lowerCost(_item.item_id, ''Material'', pUpdateActual), pUpdateActual);
    END IF;

    IF (pdirectLabor) THEN    
      PERFORM updateSorACost(_item.item_id, ''Direct Labor'', FALSE, xtmfg.directLaborCost(_item.item_id), pUpdateActual);
    END IF;

    IF (plowerDirectLabor) THEN    
      PERFORM updateSorACost(_item.item_id, ''Direct Labor'', TRUE, lowerCost(_item.item_id, ''Direct Labor'', pUpdateActual), pUpdateActual);
    END IF;

    IF (poverhead) THEN    
      PERFORM updateSorACost(_item.item_id, ''Overhead'', FALSE, xtmfg.overheadCost(_item.item_id), pUpdateActual);
    END IF;

    IF (plowerOverhead) THEN    
      PERFORM updateSorACost(_item.item_id, ''Overhead'', TRUE, lowerCost(_item.item_id, ''Overhead'', pUpdateActual), pUpdateActual);
    END IF;

    IF (pmachOverhead) THEN    
      PERFORM updateSorACost(_item.item_id, ''Machine Overhead'', FALSE, xtmfg.machineOverheadCost(_item.item_id), pUpdateActual);
    END IF;

    IF (plowerMachOverhead) THEN    
      PERFORM updateSorACost(_item.item_id, ''Machine Overhead'', TRUE, lowerCost(_item.item_id, ''Machine Overhead'', pUpdateActual), pUpdateActual);
    END IF;

    IF (plowerUser) THEN    
      PERFORM updateLowerUserCosts(_item.item_id, pUpdateActual);
    END IF;

    IF (prollUp) THEN    
      PERFORM rollUpSorACost(_item.item_id, pUpdateActual);
    END IF;

    RETURN _result;

END;
 ' LANGUAGE 'plpgsql';

