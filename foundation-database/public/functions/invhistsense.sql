CREATE OR REPLACE FUNCTION invhistSense(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvhistId ALIAS FOR $1;
  _count INTEGER;
  _row RECORD;
  _sense INTEGER;
BEGIN

  SELECT invhist_transtype, invhist_ordnumber, itemsite_warehous_id
  INTO _row 
  FROM invhist 
    JOIN itemsite ON (itemsite_id=invhist_itemsite_id)
  WHERE (invhist_id=pInvhistId);

  GET DIAGNOSTICS _count = ROW_COUNT;
  IF (_count = 0) THEN
    RAISE EXCEPTION 'Record not found for invhist_id=%',pInvhistId;
  END IF;
  
  -- increase inventory: AD RM RT RP RR RS RX RB TR
  -- decrease inventory: IM IB IT SH SI EX RI
  -- TS and TR are special: shipShipment and recallShipment should not change
  -- QOH at the Transfer Order src whs (as this was done by issueToShipping)
  -- but postReceipt should change QOH at the transit whs
  IF (_row.invhist_transtype='TS') THEN
       _sense := CASE WHEN (SELECT tohead_trns_warehous_id=_row.itemsite_warehous_id
                                  FROM tohead
                                  WHERE (tohead_number=_row.invhist_ordnumber)) THEN -1
                ELSE 0
                END;
  ELSIF (_row.invhist_transtype='TR') THEN
      _sense := CASE WHEN (SELECT tohead_src_warehous_id=_row.itemsite_warehous_id
                                  FROM tohead
                                  WHERE (tohead_number=_row.invhist_ordnumber)) THEN 0
                ELSE 1
                END;
  ELSIF (_row.invhist_transtype IN ('IM', 'IB', 'IT', 'SH', 'SI', 'EX', 'RI')) THEN
      _sense := -1;
    ELSE
      _sense := 1;
    END IF;

  RETURN _sense;
END;
$$ LANGUAGE 'plpgsql';
