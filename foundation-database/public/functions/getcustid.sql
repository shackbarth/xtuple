CREATE OR REPLACE FUNCTION getCustId(pCustNumber text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  
  SELECT getCustId(pCustNumber,false) INTO _returnVal;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getCustId(pCustNumber text,
                                     pInclProspects boolean) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pCustNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT cust_id INTO _returnVal
  FROM custinfo
  WHERE (cust_number=UPPER(pCustNumber));
  
  IF (_returnVal IS NULL) THEN
    IF (pInclProspects) THEN
      SELECT prospect_id INTO _returnVal
      FROM prospect
      WHERE (UPPER(prospect_number)=UPPER(pCustNumber));
      IF (_returnVal IS NULL) THEN
        RAISE EXCEPTION 'Neither Customer nor Prospect Number % found.', pCustNumber;
      END IF;
    ELSE
      RAISE EXCEPTION 'Customer Number % not found.', pCustNumber;
    END IF;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
