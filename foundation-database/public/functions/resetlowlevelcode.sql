CREATE OR REPLACE FUNCTION resetLowLevelCode(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

    pItemId ALIAS FOR $1;
    _result	INTEGER;
    _counterNum	INTEGER	:= 1;
    _feedBackNum INTEGER := 1;
    _r                  RECORD;

BEGIN
    DELETE FROM costUpdate;

    IF pItemId = -1 THEN 	-- -1 is an invalid item_id => do them all
	INSERT INTO costUpdate ( costUpdate_item_id, costUpdate_item_type )
			SELECT item_id, item_type
			FROM   item;

        -- Recalculate the Item Lowlevel codes
        WHILE _feedBackNum > 0 LOOP
            SELECT updateLowlevel(_counterNum) INTO _feedBackNum;
            _counterNum := _counterNum + 1;
        END LOOP;

    ELSE
	INSERT INTO costUpdate ( costUpdate_item_id, costUpdate_item_type )
			SELECT item_id, item_type
			FROM   item
                        WHERE (item_id=pItemId);
      FOR _r IN SELECT item_id, bomdata_bomwork_level, item_type
                FROM item,
                     indentedBOM(pItemId, getActiveRevId('BOM',pItemId),0,0)
                WHERE (bomdata_item_id=item_id)
                ORDER BY bomdata_bomwork_level LOOP

        -- this only works because of the ORDER BY in the loop SELECT
        UPDATE costUpdate
        SET costupdate_lowlevel_code = _r.bomdata_bomwork_level
        WHERE (costupdate_item_id=_r.item_id);

        IF (NOT FOUND) THEN
          INSERT INTO costUpdate (
            costUpdate_item_id, costUpdate_lowlevel_code, costUpdate_item_type
          ) VALUES (
            _r.item_id, _r.bomdata_bomwork_level, _r.item_type
          );
        END IF;
      END LOOP;

    END IF;

    SELECT count(*) INTO _result
    FROM costUpdate;

    RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

