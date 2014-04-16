/*  TODO: push this code into the crmacct before trigger?
          then convert customer -> prospect becomes simply
          UPDATE crmacct SET crmacct_prospect_id=crmacct_cust_id,
                             crmacct_cust_id=NULL
                WHERE crmacct_cust_id=pCustId;
 */
CREATE OR REPLACE FUNCTION convertCustomerToProspect(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustId     ALIAS FOR $1;
  _c          RECORD;
BEGIN
  SELECT * INTO _c
  FROM custinfo
  WHERE (cust_id=pCustId);

  INSERT INTO prospect (
        prospect_id, prospect_active, prospect_number,
        prospect_name, prospect_cntct_id, prospect_taxzone_id,
        prospect_salesrep_id, prospect_warehous_id, prospect_comments
  ) VALUES (
       _c.cust_id, _c.cust_active, _c.cust_number,
       _c.cust_name, _c.cust_cntct_id, _c.cust_taxzone_id,
       CASE WHEN(_c.cust_salesrep_id > 0) THEN _c.cust_salesrep_id
            ELSE NULL
       END,
       CASE WHEN(_c.cust_preferred_warehous_id > 0) THEN _c.cust_preferred_warehous_id
            ELSE NULL
       END,
       _c.cust_comments);

  DELETE FROM custinfo WHERE (cust_id=pCustId);

  RETURN pCustId;
END;
$$ LANGUAGE 'plpgsql';

