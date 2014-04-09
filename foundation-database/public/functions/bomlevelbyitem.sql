CREATE OR REPLACE FUNCTION bomLevelByItem(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _cnt INTEGER;
  _result INTEGER;
  _bomitem RECORD;

BEGIN
  _cnt := 0;

  BEGIN
  FOR _bomitem IN SELECT bomitem_parent_item_id
                    FROM bomitem
                   WHERE ((bomitem_item_id=pItemid)
                     AND  (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
                     AND  (CURRENT_DATE BETWEEN bomitem_effective AND (bomitem_expires - 1)))
  LOOP
    SELECT bomLevelByItem(_bomitem.bomitem_parent_item_id) + 1 INTO _result;
    IF (_result > _cnt) THEN
      _cnt := _result;
    END IF;
  END LOOP;
  EXCEPTION WHEN statement_too_complex THEN
      RAISE EXCEPTION 'potential recursive BOM found for item_id %', pItemid;
  END;

  return _cnt;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION bomLevelByItem(INTEGER,INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pBomrevid ALIAS FOR $2;
  _cnt INTEGER;
  _result INTEGER;
  _bomitem RECORD;

BEGIN
  _cnt := 0;

  BEGIN
  FOR _bomitem IN SELECT bomitem_parent_item_id
                    FROM bomitem
                   WHERE ((bomitem_item_id=pItemid)
                     AND  (bomitem_rev_id=pBomrevid)
                     AND  (CURRENT_DATE BETWEEN bomitem_effective AND (bomitem_expires - 1)))
  LOOP
    SELECT bomLevelByItem(_bomitem.bomitem_parent_item_id, pBomrevid) + 1 INTO _result;
    IF (_result > _cnt) THEN
      _cnt := _result;
    END IF;
  END LOOP;
  EXCEPTION WHEN statement_too_complex THEN
      RAISE EXCEPTION 'potential recursive BOM found for item_id %', pItemid;
  END;

  return _cnt;
END;
$$ LANGUAGE 'plpgsql';
