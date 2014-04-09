
CREATE OR REPLACE FUNCTION forwardUpdateInvBalance(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvbalid ALIAS FOR $1;
  _p RECORD;
  _r RECORD;
  _qohEnding NUMERIC;
  _valueEnding NUMERIC;
  _nnEnding NUMERIC;
  _nnvalEnding NUMERIC;

BEGIN

  SELECT invbal_itemsite_id, 
         invbal_qoh_ending,
         invbal_value_ending,
         invbal_nn_ending,
         invbal_nnval_ending,
         period_end INTO _p
  FROM invbal
    JOIN period ON (invbal_period_id=period_id)
    JOIN itemsite ON (invbal_itemsite_id=itemsite_id)
  WHERE (invbal_id=pInvbalid);

  _qohEnding = _p.invbal_qoh_ending;
  _valueEnding = _p.invbal_value_ending;
  _nnEnding = _p.invbal_nn_ending;
  _nnvalEnding = _p.invbal_nnval_ending;

--  Find all of the subsequent periods and their inventory balance, if they exist
  FOR _r IN SELECT period_id, period_end,
                   invbal_id, 
                   invbal_qty_in, invbal_qty_out,
                   invbal_value_in, invbal_value_out,
                   invbal_nn_in, invbal_nn_out,
                   invbal_nnval_in, invbal_nnval_out
            FROM period 
              LEFT OUTER JOIN invbal
                 ON ( (invbal_period_id=period_id) AND (invbal_itemsite_id=_p.invbal_itemsite_id) )
            WHERE (period_start > _p.period_end)
            ORDER BY period_start LOOP

    IF (_r.invbal_id IS NULL) THEN

      INSERT INTO invbal
      ( invbal_period_id, invbal_itemsite_id,
        invbal_qoh_beginning, invbal_qoh_ending,
        invbal_qty_in, invbal_qty_out,
        invbal_value_beginning, invbal_value_ending,
        invbal_value_in, invbal_value_out, 
        invbal_nn_beginning, invbal_nn_ending,
        invbal_nn_in, invbal_nn_out,
        invbal_nnval_beginning, invbal_nnval_ending,
        invbal_nnval_in, invbal_nnval_out, 
        invbal_dirty )
      VALUES
      ( _r.period_id, _p.invbal_itemsite_id,
        _qohEnding, _qohEnding,
        0, 0, 
        _valueEnding, _valueEnding,
        0, 0,
        _nnEnding, _nnEnding,
        0, 0, 
        _nnvalEnding, _nnvalEnding,
        0, 0,
        FALSE );
    ELSE
      UPDATE invbal
      SET invbal_qoh_beginning = (_qohEnding),
          invbal_qoh_ending = (_qohEnding + _r.invbal_qty_in - _r.invbal_qty_out),
          invbal_value_beginning = (_valueEnding),
          invbal_value_ending = (_valueEnding + _r.invbal_value_in - _r.invbal_value_out),
          invbal_nn_beginning = (_nnEnding),
          invbal_nn_ending = (_nnEnding + _r.invbal_nn_in - _r.invbal_nn_out),
          invbal_nnval_beginning = (_nnvalEnding),
          invbal_nnval_ending = (_nnvalEnding + _r.invbal_nnval_in - _r.invbal_nnval_out),
          invbal_dirty = FALSE
      WHERE (invbal_id=_r.invbal_id);

      _qohEnding = (_qohEnding + _r.invbal_qty_in - _r.invbal_qty_out);
      _valueEnding = (_valueEnding + _r.invbal_value_in - _r.invbal_value_out);
      _nnEnding = (_nnEnding + _r.invbal_nn_in - _r.invbal_nn_out);
      _nnvalEnding = (_nnvalEnding + _r.invbal_nnval_in - _r.invbal_nnval_out);
    END IF;
  END LOOP;

  UPDATE invbal
  SET invbal_dirty = false
  WHERE (invbal_id=pInvbalid);

  RETURN pInvbalid;

END;
$$ LANGUAGE 'plpgsql';

