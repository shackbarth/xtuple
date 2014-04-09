CREATE OR REPLACE FUNCTION applyapcredits(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendId   ALIAS FOR $1;
  _result   INTEGER;
  _apopenid INTEGER;
  _r        RECORD;

BEGIN

  -- Fetch credit memo(s) for the vendor
  FOR _r IN SELECT apopen_id, apopen_duedate
            FROM apopen JOIN vendinfo ON (apopen_vend_id = vend_id)
            WHERE ((apopen_doctype = 'C')
               AND (apopen_status = 'O')
               AND (vend_id = pVendId))
            ORDER BY apopen_duedate
  LOOP
    -- Apply credit memo(s) according to due date
    SELECT applyapcreditmemotobalance(_r.apopen_id) INTO _result;

    -- Post the credit memo if applied
    IF (_result = 1) THEN
      SELECT postapcreditmemoapplication(_r.apopen_id) INTO _apopenid;
      IF (_apopenid < 0) THEN
        RETURN -1;
      END IF;
    ELSE
      RETURN -1;
    END IF;

  END LOOP;

RETURN 1;

END;
$$ LANGUAGE 'plpgsql' VOLATILE;
