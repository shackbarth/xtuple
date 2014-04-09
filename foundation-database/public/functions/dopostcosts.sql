CREATE OR REPLACE FUNCTION doPostCosts(BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  pMaterial ALIAS FOR $1;
  plowerMaterial ALIAS FOR $2;
  pdirectLabor ALIAS FOR $3;
  plowerDirectLabor ALIAS FOR $4;
  poverhead ALIAS FOR $5;
  plowerOverhead ALIAS FOR $6;
  pmachOverhead ALIAS FOR $7;
  plowerMachOverhead ALIAS FOR $8;
  pUser ALIAS FOR $9;
  plowerUser ALIAS FOR $10;
  prollUp ALIAS FOR $11;
  _item RECORD;
  _result INTEGER := 0;

BEGIN

  PERFORM resetLowLevelCode(-1);

  FOR _item IN SELECT costUpdate_item_id
            FROM costUpdate
            ORDER BY costUpdate_lowlevel_code DESC LOOP
    PERFORM doPostCosts(_item.costUpdate_item_id, FALSE,
		       pMaterial, plowerMaterial, pdirectLabor,
		       plowerDirectLabor, poverhead, plowerOverhead,
		       pmachOverhead, plowerMachOverhead,
		       puser, plowerUser, prollUp);
  END LOOP;

  RETURN _result;

END;
 ' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION doPostCosts(INTEGER, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  pItemId ALIAS FOR $1;
  pResetLowLevel ALIAS FOR $2;
  pMaterial ALIAS FOR $3;
  plowerMaterial ALIAS FOR $4;
  pdirectLabor ALIAS FOR $5;
  plowerDirectLabor ALIAS FOR $6;
  poverhead ALIAS FOR $7;
  plowerOverhead ALIAS FOR $8;
  pmachOverhead ALIAS FOR $9;
  plowerMachOverhead ALIAS FOR $10;
  pUser ALIAS FOR $11;
  plowerUser ALIAS FOR $12;
  prollUp ALIAS FOR $13;
  _itemcost RECORD;
  _result INTEGER;

BEGIN

    IF (pResetLowLevel) THEN
	PERFORM resetLowLevelCode(pItemId);
    END IF;

    FOR _itemcost IN SELECT itemcost_id, costelem_sys, costelem_type,
			    itemcost_lowlevel,
			    costUpdate_lowlevel_code, costUpdate_item_type
            FROM itemcost, costelem, costUpdate
            WHERE itemcost_item_id = pItemId
	      AND costUpdate_item_id = itemcost_item_id
              AND itemcost_costelem_id = costelem_id LOOP
      IF (NOT _itemcost.costelem_sys) THEN
        IF ( (pUser) AND ( NOT _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
        IF ( (plowerUser) AND ( _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
      END IF;

      IF (_itemcost.costelem_type = ''Material'') THEN
        IF ( (pMaterial) AND ( NOT _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
        IF ( (plowerMaterial) AND ( _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
      END IF;

      IF (_itemcost.costelem_type = ''Direct Labor'') THEN
        IF ( (pdirectLabor) AND ( NOT _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
        IF ( (plowerDirectLabor) AND ( _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
      END IF;

      IF (_itemcost.costelem_type = ''Overhead'') THEN
        IF ( (poverhead) AND ( NOT _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
        IF ( (plowerOverhead) AND ( _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
      END IF;

      IF (_itemcost.costelem_type = ''Machine Overhead'') THEN
        IF ( (pmachOverhead) AND ( NOT _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
        IF ( (plowerMachOverhead) AND ( _itemcost.itemcost_lowlevel) ) THEN
          PERFORM postCost(_itemcost.itemcost_id);
          _result := _result + 1;
        END IF;
      END IF;

    END LOOP;

    IF (prollUp) THEN    
      PERFORM rollUpStandardCost(pItemId);
      _result := _result + 1;
    END IF;

    RETURN _result;

END;
 ' LANGUAGE 'plpgsql';

