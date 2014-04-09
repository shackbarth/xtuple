CREATE OR REPLACE FUNCTION postbillingselectionconsolidated(integer)
  RETURNS integer AS
$$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;

BEGIN

  RAISE NOTICE 'postBillingselectionConsolidated(integer) has been deprecated.  Please use createInvoiceConsolidated(integer).';
  RETURN createInvoiceConsolidated(pCustid);

END;
$$
  LANGUAGE 'plpgsql' VOLATILE;
