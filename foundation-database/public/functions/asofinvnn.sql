CREATE OR REPLACE FUNCTION asofinvnn(INTEGER, DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  pAsofDate ALIAS FOR $2;
  _result NUMERIC;

BEGIN

  SELECT invbal_nn_ending INTO _result
  FROM asofinvbal(pItemsiteId, pAsofDate);

  RETURN COALESCE(_result, 0);
  
END;
$$ LANGUAGE 'plpgsql';
