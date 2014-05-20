CREATE OR REPLACE FUNCTION cntctselectcol(integer, integer) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCntctId ALIAS FOR $1;
  pColNumber ALIAS FOR $2;

BEGIN

  IF (pColNumber = 2 OR pColNumber = 3) THEN
    UPDATE cntctsel SET cntctsel_mrg_crmacct_id=false WHERE (cntctsel_mrg_crmacct_id AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_crmacct_id=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 4) THEN
    UPDATE cntctsel SET cntctsel_mrg_honorific=false WHERE (cntctsel_mrg_honorific AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_honorific=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 5) THEN
    UPDATE cntctsel SET cntctsel_mrg_first_name=false WHERE (cntctsel_mrg_first_name AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_first_name=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 6) THEN
    UPDATE cntctsel SET cntctsel_mrg_middle=false WHERE (cntctsel_mrg_middle AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_middle=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 7) THEN
    UPDATE cntctsel SET cntctsel_mrg_last_name=false WHERE (cntctsel_mrg_last_name AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_last_name=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 8) THEN
    UPDATE cntctsel SET cntctsel_mrg_suffix=false WHERE (cntctsel_mrg_suffix AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_suffix=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 9) THEN
    UPDATE cntctsel SET cntctsel_mrg_initials=false WHERE (cntctsel_mrg_initials AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_initials=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 10) THEN
    UPDATE cntctsel SET cntctsel_mrg_phone=false WHERE (cntctsel_mrg_phone AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_phone=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 11) THEN
    UPDATE cntctsel SET cntctsel_mrg_phone2=false WHERE (cntctsel_mrg_phone2 AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_phone2=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 12) THEN
    UPDATE cntctsel SET cntctsel_mrg_fax=false WHERE (cntctsel_mrg_fax AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_fax=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 13) THEN
    UPDATE cntctsel SET cntctsel_mrg_email=false WHERE (cntctsel_mrg_email AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_email=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 14) THEN
    UPDATE cntctsel SET cntctsel_mrg_webaddr=false WHERE (cntctsel_mrg_webaddr AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_webaddr=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 15) THEN
    UPDATE cntctsel SET cntctsel_mrg_title=false WHERE (cntctsel_mrg_title AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_title=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 16) THEN
    UPDATE cntctsel SET cntctsel_mrg_owner_username=false WHERE (cntctsel_mrg_owner_username AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_owner_username=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber = 17) THEN
    UPDATE cntctsel SET cntctsel_mrg_notes=false WHERE (cntctsel_mrg_notes AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_notes=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  ELSIF (pColNumber >= 18) THEN
    UPDATE cntctsel SET cntctsel_mrg_addr_id=false WHERE (cntctsel_mrg_addr_id AND cntctsel_cntct_id != pCntctId);
    UPDATE cntctsel SET cntctsel_mrg_addr_id=true WHERE (cntctsel_cntct_id = pCntctId);
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE 'plpgsql';
