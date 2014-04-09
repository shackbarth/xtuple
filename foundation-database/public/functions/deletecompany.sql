CREATE OR REPLACE FUNCTION deleteCompany(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pcompanyid ALIAS FOR $1;

BEGIN
  IF (EXISTS(SELECT accnt_id
             FROM accnt, company
             WHERE ((accnt_company=company_number)
               AND  (company_id=pcompanyid))
            )) THEN
    RETURN -1;
  END IF;

  DELETE FROM company
  WHERE (company_id=pcompanyid);

  RETURN pcompanyid;

END;
' LANGUAGE 'plpgsql';
