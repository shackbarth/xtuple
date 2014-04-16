CREATE OR REPLACE FUNCTION asofinvbal(INTEGER, DATE) RETURNS SETOF invbal STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  pAsofDate ALIAS FOR $2;
  _result invbal%ROWTYPE;
  _i RECORD;
  _h RECORD;
  _r RECORD;
  _prevCostmethod TEXT := 'A';
  _prevDate TIMESTAMP WITH TIME ZONE;
  _runningQty NUMERIC := 0;
  _runningNn NUMERIC := 0;
  _runningValue NUMERIC := 0;
  _runningNnval NUMERIC := 0;

BEGIN
  /* This is a base function to gather data.  Because it is STABLE it should only need
  to be calculated once, even though it is likely to be called several times by other
  functions in parent query to present the various data.
  */
  
  -- First make sure inventory balance is forward updated
  PERFORM forwardUpdateItemsite(pItemsiteId);

  -- Next find the previous period balace to use as a starting point
  SELECT invbal.*, period_start, itemsite_costmethod INTO _i
  FROM invbal 
    JOIN itemsite ON (invbal_itemsite_id=itemsite_id) 
    JOIN period ON (invbal_period_id=period_id)
  WHERE ((invbal_itemsite_id=pItemsiteId)
    AND  (pAsofDate >= period_start))
  ORDER BY period_start DESC
  LIMIT 1;

  _runningQty := _i.invbal_qoh_beginning;
  _runningNn := _i.invbal_nn_beginning;
  _runningValue := _i.invbal_value_beginning;
  _runningNnval := _i.invbal_nnval_beginning;
  _prevDate := _i.period_start;
  _prevCostmethod := _i.itemsite_costmethod;

  FOR _r IN 
    SELECT invhist_id, invhist_created, invhist_invqty, invhist_transtype, invhist_unitcost,
      invhist_costmethod, itemsite_item_id, invhistSense(invhist_id) AS sense
    FROM invhist
      JOIN itemsite ON (itemsite_id=invhist_itemsite_id)
    WHERE ((invhist_itemsite_id=pItemsiteId)
    AND (invhist_transdate::date BETWEEN _i.period_start AND pAsofdate))
    ORDER BY invhist_created, invhist_id
  LOOP
    -- Update balances changed by any standard cost update between transactions
    IF (_prevCostmethod = 'S' AND _runningQty != 0) THEN
      FOR _h IN
        SELECT costhist_oldcost, costhist_newcost
        FROM costhist
          JOIN item ON (costhist_item_id=item_id)
          JOIN itemsite ON (itemsite_item_id=item_id)
        WHERE ((itemsite_id=pItemsiteId)
          AND (costhist_date BETWEEN _prevDate AND _r.invhist_created)
          AND (costhist_type IN ('S','D')))
      LOOP
        _runningValue := _runningValue + round((_h.costhist_newcost-_h.costhist_oldcost) * _runningQty,2);
        _runningNnval := _runningNnval + round((_h.costhist_newcost-_h.costhist_oldcost) * _runningNn,2);
      END LOOP;
    END IF;

    _prevDate := _r.invhist_created;
    _prevCostmethod := _r.invhist_costmethod;
    _runningQty := _runningQty + _r.invhist_invqty * _r.sense;
    _runningValue := _runningValue + round( _r.invhist_invqty * _r.sense * _r.invhist_unitcost,2);
    IF (_r.invhist_transtype = 'NN') THEN
      _runningNn := _runningNn + _r.invhist_invqty * -1;
      _runningNnval := _runningNnval + round( _r.invhist_invqty * -1 * _r.invhist_unitcost,2);
    END IF;
    
  END LOOP;

  _prevDate := COALESCE(_prevDate, _i.period_start);
  _prevCostmethod := COALESCE(_r.invhist_costmethod, _i.itemsite_costmethod);
  
  IF (_prevCostmethod = 'S' AND _runningQty != 0) THEN
    FOR _h IN
      SELECT costhist_oldcost, costhist_newcost
      FROM costhist
        JOIN item ON (costhist_item_id=item_id)
        JOIN itemsite ON (itemsite_item_id=item_id)
      WHERE ((itemsite_id=pItemsiteId)
        AND (costhist_date BETWEEN _prevDate AND CAST(pAsofDate + 1 AS TIMESTAMP WITH TIME ZONE))
        AND (costhist_type IN ('S','D')))
    LOOP
      _runningValue := _runningValue + round((_h.costhist_newcost-_h.costhist_oldcost) * _runningQty,2);
      _runningNnval := _runningNnval + round((_h.costhist_newcost-_h.costhist_oldcost) * _runningNn,2);
    END LOOP;
  END IF;

  _result := _i;
  _result.invbal_qoh_ending := _runningQty;
  _result.invbal_value_ending := _runningValue;
  _result.invbal_nn_ending := _runningNn;
  _result.invbal_nnval_ending := _runningNnval;

  RETURN NEXT _result;

  RETURN;
  
END;
$$ LANGUAGE 'plpgsql';

