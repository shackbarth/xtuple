CREATE OR REPLACE FUNCTION buildInvBal(integer) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  _r RECORD;
  _prevCostmethod TEXT := 'A';
  _prevDate TIMESTAMP WITH TIME ZONE;
  _runningQty NUMERIC := 0;
  _runningNn NUMERIC := 0;

BEGIN
  -- Validate
  IF (SELECT (count(invhist_id) > 0)
      FROM invhist
      WHERE ((invhist_itemsite_id=pItemsiteId)
      AND (NOT invhist_posted))) THEN

    SELECT item_number, warehous_code INTO _r
    FROM itemsite
      JOIN item ON (item_id=itemsite_item_id)
      JOIN whsinfo ON (itemsite_warehous_id=warehous_id)
    WHERE (itemsite_id=pItemsiteId);
    
    RAISE EXCEPTION 'Unposted inventory transactions exist for % at % [xtuple: buildInvBal, -1, %, %]',
                    _r.item_number, _r.warehous_code,
                    _r.item_number, _r.warehous_code;
  END IF;

  -- Remove any old records
  DELETE FROM invbal WHERE invbal_itemsite_id=pItemsiteId;

  FOR _r IN 
    SELECT invhist.*,
      itemsite_item_id, invhistSense(invhist_id) AS sense,
      item_number, warehous_code
    FROM invhist
      JOIN itemsite ON (itemsite_id=invhist_itemsite_id)
      JOIN item ON (itemsite_item_id=item_id)
      JOIN whsinfo ON (itemsite_warehous_id=warehous_id)
    WHERE (invhist_itemsite_id=pItemsiteId)
    ORDER BY invhist_created, invhist_id
  LOOP
    RAISE NOTICE 'Calculating balances for Item % at Site % against transaction %, transtype %, sense %, qty %, %', _r.item_number, _r.warehous_code, _r.invhist_id, _r.invhist_transtype, _r.sense, _r.invhist_invqty, _r.invhist_comments;
    -- Update balances changed by any standard cost update between transactions
    IF (_prevCostmethod = 'S' AND _runningQty != 0) THEN
      PERFORM postValueintoInvBalance(pItemsiteid, costhist_date::date, _runningQty, _runningNn, costhist_oldcost, costhist_newcost )
      FROM costhist
      WHERE ((costhist_item_id=_r.itemsite_item_id)
        AND (costhist_date BETWEEN _prevDate AND _r.invhist_created)
        AND (costhist_type IN ('S','D')));
    END IF;

    -- Post transaction into inventory balance table
    PERFORM postIntoInvBalance(_r.invhist_id);

    _prevDate := _r.invhist_created;
    _prevCostmethod := _r.invhist_costmethod;
    _runningQty := _runningQty + _r.invhist_invqty * _r.sense;
    IF (_r.invhist_transtype = 'NN') THEN
      _runningNn := _runningNn + _r.invhist_invqty * -1;
    END IF;
    
  END LOOP;

  -- Update balances changed by any standard cost since last transaction
  IF (_prevCostmethod = 'S' AND _runningQty != 0) THEN
    PERFORM postValueintoInvBalance(pItemsiteid, costhist_date::date, _runningQty, _runningNn, costhist_oldcost, costhist_newcost )
    FROM costhist
    WHERE ((costhist_item_id=_r.itemsite_item_id)
      AND (costhist_date > _prevDate)
      AND (costhist_type IN ('S','D')));
  END IF;

  -- Forward update changes through all the balances
  PERFORM forwardupdateitemsite(pItemsiteId);
  
  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';

