
CREATE OR REPLACE FUNCTION deleteCustomer(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;

BEGIN

  PERFORM shipto_id
  FROM shiptoinfo
  WHERE (shipto_cust_id=pCustid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  PERFORM cohead_id
  FROM cohead
  WHERE (cohead_cust_id=pCustid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  PERFORM cmhead_id
  FROM cmhead
  WHERE (cmhead_cust_id=pCustid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  PERFORM cohist_id
  FROM cohist
  WHERE (cohist_cust_id=pCustid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  PERFORM aropen_id
  FROM aropen
  WHERE (aropen_cust_id=pCustid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -5;
  END IF;

  PERFORM checkhead_recip_id
    FROM checkhead
   WHERE ((checkhead_recip_id=pCustid)
     AND  (checkhead_recip_type='C'))
   LIMIT 1;
   IF (FOUND) THEN
     RETURN -6;
   END IF;

  PERFORM invchead_id
     FROM invchead
    WHERE(invchead_cust_id=pCustid)
    LIMIT 1;
  IF (FOUND) THEN
    RETURN -7;
  END IF;

  PERFORM quhead_id
     FROM quhead
    WHERE(quhead_cust_id=pCustid)
    LIMIT 1;
  IF (FOUND) THEN
    RETURN -8;
  END IF;

  DELETE FROM taxreg
   WHERE ((taxreg_rel_type='C')
     AND  (taxreg_rel_id=pCustid));

  DELETE FROM ipsass
  WHERE (ipsass_cust_id=pCustid);

  DELETE FROM custinfo
  WHERE (cust_id=pCustid);

  UPDATE crmacct SET crmacct_cust_id = NULL
  WHERE (crmacct_cust_id=pCustid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

