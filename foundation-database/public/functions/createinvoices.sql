
CREATE OR REPLACE FUNCTION createInvoices() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _counter INTEGER;
  _cobmisc RECORD;

BEGIN

  _counter := 0;

  FOR _cobmisc IN SELECT cobmisc_id
                  FROM cobmisc
                  WHERE (NOT cobmisc_posted) LOOP

    PERFORM createinvoice(_cobmisc.cobmisc_id);
    _counter := (_counter + 1);

  END LOOP;

  RETURN _counter;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createInvoices(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN createinvoices($1, false);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createInvoices(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustTypeId ALIAS FOR $1;
  pConsolidate ALIAS FOR $2;
  _counter INTEGER;
  _tcounter INTEGER;
  _cobmisc RECORD;

BEGIN

  _counter := 0;

  IF (pConsolidate) THEN
    FOR _cobmisc IN SELECT DISTINCT cust_id
                      FROM cobmisc, cohead, custinfo
                     WHERE((NOT cobmisc_posted)
                       AND (cohead_id=cobmisc_cohead_id)
                       AND (cust_id=cohead_cust_id)
                       AND (cust_custtype_id=pCustTypeId)) LOOP

      SELECT createinvoiceConsolidated(_cobmisc.cust_id)
        INTO _tcounter;
      _counter := (_counter + _tcounter);
    END LOOP;
  ELSE
    FOR _cobmisc IN SELECT cobmisc_id
                      FROM cobmisc, cohead, custinfo
                     WHERE((NOT cobmisc_posted)
                       AND (cohead_id=cobmisc_cohead_id)
                       AND (cust_id=cohead_cust_id)
                       AND (cust_custtype_id=pCustTypeId)) LOOP
  
      PERFORM createinvoice(_cobmisc.cobmisc_id);
      _counter := (_counter + 1);

    END LOOP;
  END IF;

  RETURN _counter;
END;
$$ LANGUAGE 'plpgsql';

