CREATE OR REPLACE FUNCTION updateABCClass(TEXT, NUMERIC, NUMERIC, DATE, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pClassCodePattern ALIAS FOR $1;
  pACutoff ALIAS FOR $2;
  pBCutoff ALIAS FOR $3;
  pStartDate ALIAS FOR $4;
  pEndDate ALIAS FOR $5;
  _result INTEGER;

BEGIN

  SELECT updateABCClass(pClassCodePattern, -1, pACutoff, pBCutoff, pStartDate, pEndDate) INTO _result;
  RETURN _result;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION updateABCClass(TEXT, INTEGER, NUMERIC, NUMERIC, DATE, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pClassCodePattern ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  pACutoff ALIAS FOR $3;
  pBCutoff ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pEndDate ALIAS FOR $6;
  _updateCount INTEGER;
  _totalValue NUMERIC;
  _cumulativeValue NUMERIC;
  _itemsite RECORD;

BEGIN

  SELECT COUNT(*) INTO _updateCount
  FROM itemsite, item, classcode
  WHERE ( (itemsite_item_id=item_id)
   AND (item_classcode_id=classcode_id)
   AND (itemsite_autoabcclass)
   AND (classcode_code ~ pClassCodePattern)
   AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) );

  IF (_updateCount IS NULL) THEN
    RETURN 0;
  ELSE

    UPDATE itemsite
    SET itemsite_abcclass=''T''
    FROM item, classcode
    WHERE ( (itemsite_item_id=item_id)
     AND (item_classcode_id=classcode_id)
     AND (itemsite_autoabcclass)
     AND (classcode_code ~ pClassCodePattern)
     AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) );

    SELECT SUM(ABS(invhist_qoh_before - invhist_qoh_after) * invhist_unitcost) INTO _totalValue
    FROM invhist, itemsite, item, classcode
    WHERE ( (invhist_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (item_classcode_id=classcode_id)
     AND (invhist_analyze)
     AND (invhist_transtype ~ ''^[IR]'')
     AND (itemsite_autoabcclass)
     AND (classcode_code ~ pClassCodePattern)
     AND (invhist_transdate::DATE BETWEEN pStartDate AND pEndDate)
     AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) );

    IF ( (_totalValue IS NULL) OR (_totalValue = 0) ) THEN
      UPDATE itemsite
      SET itemsite_abcclass=''A''
      WHERE (itemsite_abcclass=''T'');
    ELSE

      _cumulativeValue := 0;

      FOR _itemsite IN SELECT itemsite_id, item_number,
                              SUM(ABS(invhist_qoh_before - invhist_qoh_after) * invhist_unitcost) AS value
                       FROM invhist, itemsite, item, classcode
                       WHERE ( (invhist_itemsite_id=itemsite_id)
                        AND (itemsite_item_id=item_id)
                        AND (item_classcode_id=classcode_id)
                        AND (invhist_analyze)
                        AND (invhist_transtype ~ ''^[IR]'')
                        AND (itemsite_autoabcclass)
                        AND (classcode_code ~ pClassCodePattern)
                        AND (invhist_transdate::DATE BETWEEN pStartDate AND pEndDate)
                        AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) )
                       GROUP BY itemsite_id, item_number
                       ORDER BY value DESC LOOP

        IF (_itemsite.value IS NOT NULL) THEN
          _cumulativeValue := _cumulativeValue + _itemsite.value;
        END IF;

        IF ((_cumulativeValue / _totalValue) <= pACutoff) THEN
          UPDATE itemsite
          SET itemsite_abcclass=''A''
          WHERE (itemsite_id=_itemsite.itemsite_id);
        ELSE
          IF ((_cumulativeValue / _totalValue) <= pBCutoff) THEN
            UPDATE itemsite
            SET itemsite_abcclass=''B''
            WHERE (itemsite_id=_itemsite.itemsite_id);
          ELSE
            UPDATE itemsite
            SET itemsite_abcclass=''C''
            WHERE (itemsite_id=_itemsite.itemsite_id);
          END IF;
        END IF;

      END LOOP;

      UPDATE itemsite
      SET itemsite_abcclass=''C''
      WHERE (itemsite_abcclass=''T'');
    END IF;

  END IF;

  RETURN _updateCount;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION updateABCClass(INTEGER, NUMERIC, NUMERIC, DATE, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pClasscodeid ALIAS FOR $1;
  pACutoff ALIAS FOR $2;
  pBCutoff ALIAS FOR $3;
  pStartDate ALIAS FOR $4;
  pEndDate ALIAS FOR $5;
  _result INTEGER;

BEGIN

  SELECT updateABCClass(pClassCodeid, -1, pACutoff, pBCutoff, pStartDate, pEndDate) INTO _result;
  RETURN _result;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION updateABCClass(INTEGER, INTEGER, NUMERIC, NUMERIC, DATE, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pClasscodeid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  pACutoff ALIAS FOR $3;
  pBCutoff ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pEndDate ALIAS FOR $6;
  _updateCount INTEGER;
  _totalValue NUMERIC;
  _cumulativeValue NUMERIC;
  _itemsite RECORD;

BEGIN

  SELECT COUNT(*) INTO _updateCount
  FROM itemsite, item
  WHERE ( (itemsite_item_id=item_id)
   AND ((item_classcode_id=pClasscodeid) OR (pClasscodeid=-1))
   AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) );

  IF (_updateCount IS NULL) THEN
    _updateCount := 0;
  ELSE

    UPDATE itemsite
    SET itemsite_abcclass=''T''
    FROM item
    WHERE ( (itemsite_item_id=item_id)
     AND ((item_classcode_id=pClasscodeid) OR (pClasscodeid=-1))
     AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) );

    SELECT SUM(ABS(invhist_qoh_before - invhist_qoh_after) * invhist_unitcost) INTO _totalValue
    FROM invhist, itemsite, item
    WHERE ( (invhist_itemsite_id=itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (invhist_analyze)
     AND (invhist_transtype ~ ''^[IR]'')
     AND ((item_classcode_id=pClasscodeid) OR (pClasscodeid=-1))
     AND (invhist_transdate::DATE BETWEEN pStartDate AND pEndDate)
     AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) );

    IF ( (_totalValue IS NULL) OR (_totalValue = 0) ) THEN
      UPDATE itemsite
      SET itemsite_abcclass=''A''
      WHERE (itemsite_abcclass=''T'');
    ELSE

      _cumulativeValue := 0;

      FOR _itemsite IN SELECT itemsite_id, item_number,
                              SUM(ABS(invhist_qoh_before - invhist_qoh_after) * invhist_unitcost) AS value
                       FROM invhist, itemsite, item
                       WHERE ( (invhist_itemsite_id=itemsite_id)
                        AND (itemsite_item_id=item_id)
                        AND (invhist_analyze)
                        AND (invhist_transtype ~ ''^[IR]'')
                        AND ((item_classcode_id=pClasscodeid) OR (pClasscodeid=-1))
                        AND (invhist_transdate::DATE BETWEEN pStartDate AND pEndDate)
                        AND ((itemsite_warehous_id=pWarehousid) OR (pWarehousid=-1)) )
                       GROUP BY itemsite_id, item_number
                       ORDER BY value DESC LOOP

        IF (_itemsite.value IS NOT NULL) THEN
          _cumulativeValue := _cumulativeValue + _itemsite.value;
        END IF;

        IF ((_cumulativeValue / _totalValue) <= pACutoff) THEN
          UPDATE itemsite
          SET itemsite_abcclass=''A''
          WHERE (itemsite_id=_itemsite.itemsite_id);
        ELSE
          IF ((_cumulativeValue / _totalValue) <= pBCutoff) THEN
            UPDATE itemsite
            SET itemsite_abcclass=''B''
            WHERE (itemsite_id=_itemsite.itemsite_id);
          ELSE
            UPDATE itemsite
            SET itemsite_abcclass=''C''
            WHERE (itemsite_id=_itemsite.itemsite_id);
          END IF;
        END IF;

      END LOOP;

      UPDATE itemsite
      SET itemsite_abcclass=''C''
      WHERE (itemsite_abcclass=''T'');
    END IF;

  END IF;

  RETURN _updateCount;

END;
' LANGUAGE 'plpgsql';
