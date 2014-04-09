CREATE OR REPLACE FUNCTION currConcat(VARCHAR(3), VARCHAR(9))
	RETURNS VARCHAR(15) AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  curr_abbr   ALIAS FOR $1;
  curr_symbol ALIAS FOR $2;
  returnVal   VARCHAR(15) := '';
BEGIN
  IF length(trim(curr_abbr)) > 0 AND length(trim(curr_symbol)) > 0 THEN
      returnVal := trim(curr_abbr) || ' - ' || trim(curr_symbol);

  ELSIF length(trim(curr_abbr)) > 0 THEN
      returnVal := curr_abbr;

  ELSIF length(trim(curr_symbol)) > 0 THEN
      returnVal := curr_symbol;
  END IF;

  RETURN returnVal;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION currConcat(INTEGER) RETURNS VARCHAR(15) AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  id ALIAS FOR $1;
  returnVal   VARCHAR(15) := '';
BEGIN
  SELECT currConcat(curr_abbr, curr_symbol) INTO returnVal
      FROM curr_symbol WHERE curr_id = id;
  RETURN returnVal;
END;
$$ LANGUAGE plpgsql;
