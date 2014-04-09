CREATE OR REPLACE FUNCTION public.deletetax(integer)
  RETURNS integer AS
$$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ptaxid	ALIAS FOR $1;
BEGIN
  -- these checks allow nice error reporting instead of throwing an SQL error
  IF EXISTS(SELECT taxass_id FROM taxass WHERE (taxass_tax_id=ptaxid)) THEN
    RETURN -10;
  END IF;
  IF EXISTS(SELECT taxhist_id FROM taxhist WHERE (taxhist_tax_id=ptaxid)) THEN
    RETURN -20;
  END IF;

  DELETE FROM taxrate WHERE (taxrate_tax_id = ptaxid);
  DELETE FROM tax WHERE (tax_id = ptaxid);

  RETURN ptaxid;

END;
$$
  LANGUAGE 'plpgsql' VOLATILE;
