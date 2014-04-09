CREATE OR REPLACE FUNCTION updateCost(INTEGER, NUMERIC) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemcostid ALIAS FOR $1;
  pCost ALIAS FOR $2;

BEGIN
  RETURN updateCost(pItemcostid, pCost, baseCurrId());
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION updateCost(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
    pItemcostid ALIAS FOR $1;
    pCost ALIAS FOR $2;
    pCurrId ALIAS FOR $3;

BEGIN
  IF ( ( SELECT (itemcost_stdcost > 0)
           FROM itemcost
          WHERE (itemcost_id=pItemcostid) )  OR
        (pCost > 0) ) THEN
    UPDATE itemcost
       SET itemcost_actcost=pCost, itemcost_updated=CURRENT_DATE,
           itemcost_curr_id=pCurrId
     WHERE (itemcost_id=pItemcostid);

    RETURN pItemcostid;

  ELSE
    DELETE FROM itemcost
     WHERE (itemcost_id=pItemcostid);

    RETURN -1;
  END IF;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION updateCost(INTEGER, TEXT, BOOLEAN, NUMERIC) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  returnVal INTEGER;

BEGIN
  SELECT updateCost($1, $2, $3, $4, baseCurrId()) INTO returnVal;
  RETURN returnVal;
END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION updateCost(INTEGER, INTEGER, BOOLEAN, NUMERIC) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  returnVal INTEGER;

BEGIN
  SELECT updateCost($1, $2, $3, $4, baseCurrId()) INTO returnVal;
  RETURN returnVal;
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION updateCost(INTEGER, TEXT, BOOLEAN, NUMERIC, INTEGER) RETURNS integer AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCosttype ALIAS FOR $2;
  pLevel ALIAS FOR $3;
  pCost ALIAS FOR $4;
  pCurrid ALIAS FOR $5;
  _cost NUMERIC;
  _currId INTEGER;
  _p RECORD;
  _itemcostid INTEGER;

BEGIN

  IF (pCost IS NULL) THEN
    _cost = 0;
  ELSE
    _cost = pCost;
  END IF;

  IF (pCurrId IS NULL) THEN
    _currId := baseCurrID();
  ELSE
    _currId := pCurrId;
  END IF;

  SELECT itemcost_id, itemcost_stdcost INTO _p
  FROM itemcost, costelem
  WHERE ( (itemcost_costelem_id=costelem_id)
   AND (itemcost_item_id=pItemid)
   AND (itemcost_lowlevel=pLevel)
   AND (costelem_type=pCosttype) );

  IF (NOT FOUND) THEN
    IF (_cost > 0) THEN
      SELECT NEXTVAL(''itemcost_itemcost_id_seq'') INTO _itemcostid;
      INSERT INTO itemcost
      ( itemcost_id, itemcost_item_id, itemcost_costelem_id, itemcost_lowlevel,
        itemcost_stdcost, itemcost_posted, itemcost_actcost, itemcost_updated,
        itemcost_curr_id )
      SELECT _itemcostid, pItemid, costelem_id, pLevel,
             0, startOfTime(), _cost, CURRENT_DATE,
             _currId
      FROM costelem
      WHERE (costelem_type=pCosttype);

      RETURN _itemcostid;

    ELSE
      RETURN -1;
    END IF;

  ELSIF ( (_p.itemcost_stdcost > 0) OR (_cost > 0) ) THEN
    UPDATE itemcost
    SET itemcost_actcost=_cost,
        itemcost_curr_id = _currId,
        itemcost_updated=CURRENT_DATE
    WHERE (itemcost_id=_p.itemcost_id);

    RETURN _p.itemcost_id;

  ELSE
    DELETE FROM itemcost
    WHERE (itemcost_id=_p.itemcost_id);
 
    RETURN -1;
  END IF;

END;
' LANGUAGE 'plpgsql'; 


CREATE OR REPLACE FUNCTION updateCost(INTEGER, INTEGER, BOOLEAN, NUMERIC, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCostelemid ALIAS FOR $2;
  pLevel ALIAS FOR $3;
  pCost ALIAS FOR $4;
  pCurrid ALIAS FOR $5;
  _cost NUMERIC;
  _currId INTEGER;
  _p RECORD;
  _itemcostid INTEGER;

BEGIN

  IF (pCost IS NULL) THEN
    _cost = 0;
  ELSE
    _cost = pCost;
  END IF;

  IF (pCurrId IS NULL) THEN
    _currId := baseCurrID();
  ELSE
    _currId := pCurrId;
  END IF;

  SELECT itemcost_id, itemcost_stdcost INTO _p
  FROM itemcost
  WHERE ((itemcost_costelem_id=pCostelemid)
   AND (itemcost_item_id=pItemid)
   AND (itemcost_lowlevel=pLevel) );

  IF (NOT FOUND) THEN
    IF (_cost > 0) THEN
      SELECT NEXTVAL(''itemcost_itemcost_id_seq'') INTO _itemcostid;
      INSERT INTO itemcost
      ( itemcost_id, itemcost_item_id, itemcost_costelem_id, itemcost_lowlevel,
        itemcost_stdcost, itemcost_posted, itemcost_actcost, itemcost_updated,
        itemcost_curr_id )
      SELECT _itemcostid, pItemid, costelem_id, pLevel,
             0, startOfTime(), _cost, CURRENT_DATE,
             _currId
      FROM costelem
      WHERE (costelem_id=pCostelemid);

      RETURN _itemcostid;

    ELSE
      RETURN -1;
    END IF;

  ELSIF ( (_p.itemcost_stdcost > 0) OR (_cost > 0) ) THEN
    UPDATE itemcost
    SET itemcost_actcost=_cost,
        itemcost_curr_id = _currId,
        itemcost_updated=CURRENT_DATE
    WHERE (itemcost_id=_p.itemcost_id);

    RETURN _p.itemcost_id;

  ELSE
    DELETE FROM itemcost
    WHERE (itemcost_id=_p.itemcost_id);
 
    RETURN -1;
  END IF;

END;
' LANGUAGE 'plpgsql'; 
