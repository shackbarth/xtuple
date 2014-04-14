CREATE OR REPLACE FUNCTION forwardUpdateItemsite(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  _r RECORD;
  _invbalid INTEGER;

BEGIN
  SELECT invbal_id INTO _r
  FROM invbal
      JOIN period ON (invbal_period_id=period_id)
  WHERE (invbal_itemsite_id=pItemsiteid)
  ORDER BY period_start
  LIMIT 1;

  IF (FOUND) THEN
    RETURN forwardUpdateInvbalance(_r.invbal_id);
  ELSE
      _invbalid := nextval('invbal_invbal_id_seq');
      
      INSERT INTO invbal
      ( invbal_id,
        invbal_period_id, invbal_itemsite_id,
        invbal_qoh_beginning, invbal_qoh_ending,
        invbal_qty_in, invbal_qty_out,
        invbal_value_beginning, invbal_value_ending,
        invbal_value_in, invbal_value_out,
        invbal_nn_beginning, invbal_nn_ending,
        invbal_nn_in, invbal_nn_out,
        invbal_nnval_beginning, invbal_nnval_ending,
        invbal_nnval_in, invbal_nnval_out,
        invbal_dirty )
      SELECT
        _invbalid,
        period_id, pItemsiteid,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        false
      FROM period
      ORDER BY period_start LIMIT 1;

      RETURN forwardUpdateInvbalance(_invbalid);
  END IF;

  RETURN -1;
END;
$$ LANGUAGE 'plpgsql';

