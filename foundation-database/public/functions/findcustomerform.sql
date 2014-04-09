CREATE OR REPLACE FUNCTION findCustomerForm(INTEGER, CHARACTER(1)) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;
  pFormtype ALIAS FOR $2;
  _f RECORD;
  _found BOOLEAN;

BEGIN

--  Check for a Customer Type specific Form
  SELECT custform.* INTO _f
    FROM custform
    JOIN custinfo ON (custform_custtype_id=cust_custtype_id)
  WHERE (cust_id=pCustid);

  IF (FOUND) THEN
    _found := TRUE;
  ELSE
--  Check for a Customer Type pattern
    SELECT custform.* INTO _f
      FROM custform
      JOIN custtype ON (custtype_code ~ custform_custtype)
      JOIN custinfo ON (cust_custtype_id=custtype_id)
    WHERE ((custform_custtype_id=-1)
       AND (cust_id=pCustid));

    IF (FOUND) THEN
      _found := TRUE;
    ELSE
      _found := FALSE;
    END IF;
  END IF;

  IF (_found) THEN
    IF ( (pFormType = 'I') AND (_f.custform_invoice_report_name IS NOT NULL) ) THEN
      RETURN _f.custform_invoice_report_name;

    ELSIF ( (pFormType = 'C') AND (_f.custform_creditmemo_report_name IS NOT NULL) ) THEN
      RETURN _f.custform_creditmemo_report_name;

    ELSIF ( (pFormType = 'S') AND (_f.custform_statement_report_name IS NOT NULL) ) THEN
      RETURN _f.custform_statement_report_name;

    ELSIF ( (pFormType = 'Q') AND (_f.custform_quote_report_name IS NOT NULL) ) THEN
      RETURN _f.custform_quote_report_name;

    ELSIF ( (pFormType = 'P') AND (_f.custform_packinglist_report_name IS NOT NULL) ) THEN
      RETURN _f.custform_packinglist_report_name;

    ELSIF ( (pFormType = 'L') AND (_f.custform_sopicklist_report_name IS NOT NULL) ) THEN
      RETURN _f.custform_sopicklist_report_name;
    END IF;

  END IF;

  IF (pFormType = 'I') THEN
    RETURN 'Invoice';
  ELSIF (pFormType = 'C') THEN
    RETURN 'CreditMemo';
  ELSIF (pFormType = 'S') THEN
    RETURN 'Statement';
  ELSIF (pFormType = 'Q') THEN
    RETURN 'Quote';
  ELSIF (pFormType = 'P') THEN
    RETURN 'PackingList-Shipment';
  ELSIF (pFormType = 'L') THEN
    RETURN 'PackingList';
  END IF;

END;
$$ LANGUAGE 'plpgsql';
