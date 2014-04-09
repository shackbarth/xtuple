CREATE OR REPLACE FUNCTION postValueintoInvBalance(INTEGER, DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  pDate ALIAS FOR $2;
  pQoh ALIAS FOR $3;
  pNn ALIAS FOR $4;
  pOldCost ALIAS FOR $5;
  pNewCost ALIAS FOR $6;
  _invbalid INTEGER;
  _r RECORD;
  _count INTEGER;
  _valChange NUMERIC;
  _nnvalChange NUMERIC;

BEGIN

--  Grab the costhist record to post
  SELECT period_id INTO _r
  FROM period
  WHERE (pDate BETWEEN period_start AND period_end);

  GET DIAGNOSTICS _count = ROW_COUNT;
  
--  Find an inventory balance to post into
  IF ( _count > 0 ) THEN
--  Try to find an existing invbal
    SELECT invbal_id INTO _invbalid
    FROM invbal
    WHERE ( (invbal_period_id=_r.period_id)
      AND (invbal_itemsite_id=pItemsiteId) );

    GET DIAGNOSTICS _count = ROW_COUNT;
    IF (_count = 0) THEN
      -- Wasn't there, so forward update
      PERFORM forwardUpdateItemsite(pItemsiteId);

      --  Try to find an existing invbal again
      SELECT invbal_id INTO _invbalid
      FROM invbal
      WHERE ( (invbal_period_id=_r.period_id)
        AND (invbal_itemsite_id=pItemsiteId) );

      GET DIAGNOSTICS _count = ROW_COUNT;
      IF (_count = 0) THEN
        RAISE EXCEPTION 'An inventory balance record was not found for updating standard costs';
      END IF;
    END IF;

    _valChange := round((pNewCost - pOldCost) * pQoh, 2);
    _nnvalChange := round((pNewCost - pOldCost) * pNn, 2);
    
--  We found an invbal, update it with the change
    IF (_valChange > 0) THEN
      UPDATE invbal SET 
        invbal_value_in = (invbal_value_in + _valChange)
      WHERE (invbal_id=_invbalid);
    ELSE
      UPDATE invbal SET 
        invbal_value_out = (invbal_value_out - _valChange)
      WHERE (invbal_id=_invbalid);
    END IF;

    IF (_nnvalChange > 0) THEN
      UPDATE invbal SET 
        invbal_nnval_in = (invbal_nnval_in + _nnvalChange)
      WHERE (invbal_id=_invbalid);
    ELSE
      UPDATE invbal SET 
        invbal_nnval_out = (invbal_nnval_out - _nnvalChange)
      WHERE (invbal_id=_invbalid);
    END IF;

    UPDATE invbal SET 
      invbal_value_ending = (invbal_value_beginning + invbal_value_in - invbal_value_out),
      invbal_nnval_ending = (invbal_nnval_beginning + invbal_nnval_in - invbal_nnval_out),
      invbal_dirty=true
    WHERE (invbal_id=_invbalid);  

  ELSE
    RAISE EXCEPTION 'No period exists for date %.', pDate;
  END IF;

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

