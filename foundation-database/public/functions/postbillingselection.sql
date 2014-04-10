CREATE OR REPLACE FUNCTION postbillingselection(integer)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCobmiscid ALIAS FOR $1;

BEGIN

  RAISE NOTICE 'postBillingselection(integer) has been deprecated.  Please use createInvoice(integer).';
  RETURN createInvoice(pCobmiscid);

END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
