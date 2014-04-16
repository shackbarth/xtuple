DROP AGGREGATE IF EXISTS concatagg(TEXT);

CREATE OR REPLACE FUNCTION concataggSfunc(TEXT, TEXT) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  prevstate     ALIAS FOR $1;
  newval        ALIAS FOR $2;
BEGIN
  RETURN prevstate || newval;
END;
$$
LANGUAGE 'plpgsql';

CREATE AGGREGATE concatagg (TEXT) (
  SFUNC = concataggSfunc,
  STYPE = TEXT,
  INITCOND = ''
);
