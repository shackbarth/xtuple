CREATE OR REPLACE FUNCTION summarizeTransactions(INTEGER, DATE, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _startDate DATE;
  _endDate DATE;
  _invhist RECORD;
  _itemuom TEXT;
  _transCounter INTEGER;
  _itemlocSeries INTEGER;

BEGIN

--  Cache the uom_name
  SELECT uom_name INTO _itemuom
  FROM itemsite, item, uom
  WHERE ((itemsite_item_id=item_id)
    AND (item_inv_uom_id=uom_id)
    AND (itemsite_id=pItemsiteid));

--  Can't summarize into the future...
  IF (pEndDate > CURRENT_DATE) THEN
    _endDate := CURRENT_DATE;
  ELSE
    _endDate := pEndDate;
  END IF;

--  Verify date bounds
  IF (pStartDate > pEndDate) THEN
    _startDate := pEndDate;
  ELSE
    _startDate := pStartDate;
  END IF;

--  Verify that history is not referenced elsewhere
  SELECT invhist_id INTO _transCounter
  FROM invhist JOIN womatlpost ON (womatlpost_invhist_id=invhist_id)
  WHERE ((invhist_itemsite_id=pItemsiteid)
    AND (invhist_transdate::DATE BETWEEN _startDate AND _endDate))
  LIMIT 1;
  IF (FOUND) THEN
    RETURN 0;
  END IF;

  SELECT invhist_id INTO _transCounter
  FROM invhist JOIN shipitem ON (shipitem_invhist_id=invhist_id)
  WHERE ((invhist_itemsite_id=pItemsiteid)
    AND (invhist_transdate::DATE BETWEEN _startDate AND _endDate))
  LIMIT 1;
  IF (FOUND) THEN
    RETURN 0;
  END IF;

  _transCounter := 0;
  _itemlocSeries := NEXTVAL('itemloc_series_seq');

  FOR _invhist IN SELECT invhist_transtype, invhist_costmethod, SUM(invhist_invqty) AS qty
                  FROM invhist
                  WHERE ((invhist_itemsite_id=pItemsiteid)
                   AND (invhist_transdate::DATE BETWEEN _startDate AND _endDate))
                  GROUP BY invhist_transtype, invhist_costmethod LOOP

    DELETE FROM invhist
    WHERE ((invhist_transdate::DATE BETWEEN _startDate AND _endDate)
     AND (invhist_transtype=_invhist.invhist_transtype)
     AND (invhist_itemsite_id=pItemsiteid));

    INSERT INTO invhist
    ( invhist_itemsite_id, invhist_transdate, invhist_transtype,
      invhist_invqty, invhist_qoh_before, invhist_qoh_after,
      invhist_invuom, invhist_user, invhist_ordnumber,
      invhist_costmethod, invhist_value_before, invhist_value_after,
      invhist_series )
    VALUES
    ( pItemsiteid, _endDate, _invhist.invhist_transtype,
      _invhist.qty, 0, 0,
      _itemuom, getEffectiveXtUser(), 'Summary',
      _invhist.invhist_costmethod, 0, 0,
      _itemlocSeries );

    _transCounter := (_transCounter + 1);

  END LOOP;

  RETURN _transCounter;

END;
$$ LANGUAGE 'plpgsql';
