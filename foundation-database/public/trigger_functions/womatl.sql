CREATE OR REPLACE FUNCTION _womatlAfterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  IF (TG_OP = 'INSERT') THEN

  --  Create any required P/R's
    PERFORM createPr('W', NEW.womatl_id)
       FROM itemsite 
      WHERE ((itemsite_id=NEW.womatl_itemsite_id)
        AND  (itemsite_createpr));

  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'womatlAfterTrigger');
CREATE TRIGGER womatlAfterTrigger AFTER INSERT OR UPDATE OR DELETE ON womatl FOR EACH ROW EXECUTE PROCEDURE _womatlAfterTrigger();
