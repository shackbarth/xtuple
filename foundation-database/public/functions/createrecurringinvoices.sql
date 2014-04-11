CREATE OR REPLACE FUNCTION createRecurringInvoices() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE 'createRecurringInvoices() has been deprecated; use createRecurringItems(NULL, ''I'') instead.';

  RETURN createRecurringItems(NULL, 'I');
END;
$$ LANGUAGE 'plpgsql';
