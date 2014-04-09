
CREATE OR REPLACE FUNCTION initEffectiveXtUser() RETURNS VOID AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  -- Effective users use a temporary table to store the user information
  -- and this function, called by the other functions, makes sure the temp
  -- tables exist first.
  PERFORM *
     FROM pg_catalog.pg_class
    WHERE relname = 'effective_user'
      AND relnamespace = pg_catalog.pg_my_temp_schema();

  IF NOT FOUND THEN
    CREATE TEMPORARY TABLE effective_user (
      effective_key TEXT,
      effective_value TEXT
    );
    CREATE UNIQUE INDEX effective_user_pkey ON effective_user (effective_key);
  END IF;
END;
$$ LANGUAGE 'plpgsql' VOLATILE;

