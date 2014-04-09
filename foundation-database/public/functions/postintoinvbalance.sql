
CREATE OR REPLACE FUNCTION postIntoInvBalance(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvhistId ALIAS FOR $1;
  _invbalid INTEGER;
  _r RECORD;
  _count INTEGER;
  _qty NUMERIC;

BEGIN

--  Grab the invhist record to post
--  Special fix for transit sites when transtype=TS and invqty<0
--  Set the sense to 1 to correct invhist populated incorrectly.
  SELECT invhist.*,
         CASE WHEN (invhist_transtype='TS' AND invhist_invqty < 0.0 AND warehous_transit) THEN 1
              ELSE invhistSense(invhist_id)
         END AS sense,
         period_id INTO _r
  FROM invhist
    JOIN itemsite ON (itemsite_id=invhist_itemsite_id)
    JOIN whsinfo ON (warehous_id=itemsite_warehous_id)
    LEFT OUTER JOIN period ON (invhist_transdate::date BETWEEN period_start AND period_end)
  WHERE ( invhist_id=pInvhistId );

  GET DIAGNOSTICS _count = ROW_COUNT;

--  If we can post into a Inv Balance, do so
  IF ( _count > 0 ) THEN

--  Validate
    IF (_r.period_id IS NULL) THEN
      RAISE EXCEPTION 'No accounting period exists for invhist_id %, transaction date %.  Transaction can not be posted.', _r.invhist_id, formatDate(_r.invhist_transdate);
    END IF;

--  If cycle count, then we need to reference balance which needs to be accurate
--    IF (_r.invhist_transtype = 'CC') THEN
--      PERFORM forwardupdateitemsite(_r.invhist_itemsite_id);
--    END IF;

--  Try to find an existing invbal
    SELECT 
      invbal_id, 
--      CASE WHEN (_r.invhist_transtype != 'CC') THEN _r.invhist_invqty ELSE _r.invhist_invqty - invbal_qoh_ending END 
      _r.invhist_invqty
      INTO _invbalid, _qty
    FROM invbal
    WHERE ( (invbal_period_id=_r.period_id)
      AND (invbal_itemsite_id=_r.invhist_itemsite_id) );

    GET DIAGNOSTICS _count = ROW_COUNT;
    IF (_count > 0) THEN

--  We found a invbal, update it with the Inventory Transaction
--  Note - two stage update to avoid any funny value caching logic
    IF (_r.sense * _qty > 0) THEN
      UPDATE invbal SET 
        invbal_qty_in = (invbal_qty_in + abs(_qty)),
        invbal_value_in = (invbal_value_in + abs(_qty) * _r.invhist_unitcost)
      WHERE (invbal_id=_invbalid);
    ELSIF (_r.sense * _qty < 0) THEN
      UPDATE invbal SET 
        invbal_qty_out = (invbal_qty_out + abs(_qty)),
        invbal_value_out = (invbal_value_out + abs(_qty) *  _r.invhist_unitcost)
      WHERE (invbal_id=_invbalid);
    END IF;

    -- Non-netable transactions have their own balances
    IF (_r.invhist_transtype = 'NN') THEN
      UPDATE invbal SET 
        invbal_nn_in = (invbal_nn_in + _qty * -1),
        invbal_nnval_in = (invbal_nnval_in + _qty * -1 * _r.invhist_unitcost)
      WHERE (invbal_id=_invbalid);
    END IF;

    UPDATE invbal SET 
      invbal_qoh_ending = (invbal_qoh_beginning + invbal_qty_in - invbal_qty_out),
      invbal_value_ending = (invbal_value_beginning + invbal_value_in - invbal_value_out),
      invbal_nn_ending = (invbal_nn_beginning + invbal_nn_in - invbal_nn_out),
      invbal_nnval_ending = (invbal_nnval_beginning + invbal_nnval_in - invbal_nnval_out),
      invbal_dirty=true
    WHERE (invbal_id=_invbalid);
  ELSE

--  No existing invbal, make one
    SELECT NEXTVAL('invbal_invbal_id_seq') INTO _invbalid;
      INSERT INTO invbal
        ( invbal_id, invbal_itemsite_id, invbal_period_id,
          invbal_qoh_beginning,
          invbal_qoh_ending,
          invbal_qty_in,
          invbal_qty_out,
          invbal_value_beginning,
          invbal_value_ending,
          invbal_value_in,
          invbal_value_out,
          invbal_nn_beginning,
          invbal_nn_ending,
          invbal_nn_in,
          invbal_nn_out,
          invbal_nnval_beginning,
          invbal_nnval_ending,
          invbal_nnval_in,
          invbal_nnval_out,
          invbal_dirty )
      VALUES
        ( _invbalid, _r.invhist_itemsite_id, _r.period_id,
         -- Netable
          0, 
          _r.invhist_invqty * _r.sense,
          CASE WHEN (_r.sense > 0) THEN _r.invhist_invqty
               ELSE 0
          END,
          CASE WHEN (_r.sense < 0) THEN (_r.invhist_invqty)
               ELSE 0
          END,
          0,
          _r.invhist_invqty * _r.invhist_unitcost * _r.sense,
          CASE WHEN (_r.sense > 0) THEN _r.invhist_invqty * _r.invhist_unitcost
               ELSE 0
          END,
          CASE WHEN (_r.sense < 0) THEN (_r.invhist_invqty  * _r.invhist_unitcost)
               ELSE 0
          END,
          -- Non netable
          0, 
          CASE WHEN (_r.invhist_transtype='NN') THEN _r.invhist_invqty * -1
               ELSE 0
          END,
          CASE WHEN (_r.sense > 0 AND _r.invhist_transtype='NN') THEN _r.invhist_invqty * -1
               ELSE 0
          END,
          CASE WHEN (_r.sense < 0 AND _r.invhist_transtype='NN') THEN _r.invhist_invqty * -1
               ELSE 0
          END,
          0,
          CASE WHEN (_r.invhist_transtype='NN') THEN _r.invhist_invqty * _r.invhist_unitcost * -1
               ELSE 0
          END,
          CASE WHEN (_r.sense > 0 AND _r.invhist_transtype='NN') THEN _r.invhist_invqty * -1 * _r.invhist_unitcost
               ELSE 0
          END,
          CASE WHEN (_r.sense < 0 AND _r.invhist_transtype='NN') THEN (_r.invhist_invqty  * -1 * _r.invhist_unitcost)
               ELSE 0
          END,
          true );
    END IF;
  ELSE
    RETURN FALSE;
  END IF;

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

