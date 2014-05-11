CREATE OR REPLACE FUNCTION currExchangeCheckOverlap () RETURNS trigger AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
    numberOfOverlaps INTEGER NOT NULL := 0;
    curr_string VARCHAR(16);
    new_id INTEGER;
BEGIN
  new_id := NEW.curr_id;
  -- ensure that effective date <= expiration date
  IF NEW.curr_effective > NEW.curr_expires THEN
    RAISE EXCEPTION
      ''Effective date % must be earlier than expiration date %'',
      NEW.curr_effective, NEW.curr_expires;
  END IF;

  -- ensure new exchange rate does not overlap in time with any others
  SELECT count(*) INTO numberOfOverlaps
    FROM curr_rate
    WHERE curr_id = NEW.curr_id
      AND curr_rate_id != NEW.curr_rate_id
      AND (
          (curr_effective BETWEEN
              NEW.curr_effective AND NEW.curr_expires OR
           curr_expires BETWEEN
              NEW.curr_effective AND NEW.curr_expires)
         OR (curr_effective <= NEW.curr_effective AND
             curr_expires   >= NEW.curr_expires)
      );
  IF numberOfOverlaps > 0 THEN
    SELECT currConcat(curr_symbol, curr_abbr)
      INTO curr_string
      FROM curr_symbol
      WHERE curr_id = new_id;
    RAISE EXCEPTION
      ''The date range % to % overlaps with another date range.'',
      NEW.curr_effective, NEW.curr_expires;
  END IF;
  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS currExchangeCheckOverlap ON curr_rate;
CREATE TRIGGER currExchangeCheckOverlap BEFORE INSERT OR UPDATE ON curr_rate
    FOR EACH ROW EXECUTE PROCEDURE currExchangeCheckOverlap();
