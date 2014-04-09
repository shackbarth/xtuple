CREATE OR REPLACE FUNCTION baseCurrID ()
    RETURNS INTEGER IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  returnVal INTEGER;
BEGIN
  SELECT curr_id INTO returnVal
    FROM curr_symbol
   WHERE curr_base = TRUE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No base currency found';
  END IF;
  RETURN returnVal;
END;
$$ LANGUAGE plpgsql;
