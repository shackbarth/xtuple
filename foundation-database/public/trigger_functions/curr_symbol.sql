CREATE OR REPLACE FUNCTION currOneBase() RETURNS trigger AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  baseCount INTEGER := 0;
BEGIN
  IF NEW.curr_base = TRUE THEN
    SELECT count(*)
      INTO baseCount
      FROM curr_symbol
      WHERE curr_base = TRUE
        AND curr_id != NEW.curr_id;
    IF baseCount > 0 THEN
      RAISE EXCEPTION
          ''Cannot make % - % the base currency because one is already defined.'',
          NEW.curr_symbol, NEW.curr_abbr;
    ELSE
      SELECT count(*)
        INTO baseCount
        FROM curr_rate
        WHERE curr_id = NEW.curr_id;
      IF baseCount = 0 THEN
        -- put a row in the curr_rate table to avoid special-case
        -- code for converting base currency to base currency
        INSERT INTO curr_rate
          (curr_id, curr_rate, curr_effective, curr_expires) VALUES
          (NEW.curr_id, 1, startOfTime(), endOfTime());
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS currOneBase ON curr_symbol;
CREATE TRIGGER currOneBase AFTER INSERT OR UPDATE ON curr_symbol
    FOR EACH ROW EXECUTE PROCEDURE currOneBase();
