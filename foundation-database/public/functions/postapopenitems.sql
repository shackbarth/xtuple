CREATE OR REPLACE FUNCTION postApopenItems() RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  UPDATE apopen
  SET apopen_posted=TRUE
  WHERE (NOT apopen_posted);

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';
