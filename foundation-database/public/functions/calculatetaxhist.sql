CREATE OR REPLACE FUNCTION calculatetaxhist(text, integer, integer, integer, date, integer, numeric)
  RETURNS boolean AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTableName ALIAS FOR $1;
  pParentId  ALIAS FOR $2;
  pTaxZoneId ALIAS FOR $3;
  pTaxTypeId ALIAS FOR $4;
  pDate      ALIAS FOR $5;
  pCurrId    ALIAS FOR $6;
  pAmount    ALIAS FOR $7;
  _qry TEXT;
  
BEGIN
  IF (pTableName IS NULL) THEN
    RAISE EXCEPTION 'A table name is required to calculate tax history';
  ELSEIF (pParentId IS NULL) THEN
    RAISE EXCEPTION 'A parent ID is required to calculate tax history';
  ELSEIF (pDate IS NULL) THEN
    RAISE EXCEPTION 'A date is required to calculate tax history';
  ELSEIF (pAmount IS NULL) THEN
     RAISE EXCEPTION 'An amount is required to calculate tax history';
  END IF;

  -- Build a query that deletes any previous tax history for this document record
  _qry := 'DELETE FROM ' || pTableName || ' WHERE taxhist_parent_id = ' || pParentId || ' AND taxhist_taxtype_id <> getadjustmenttaxtypeid();';
  EXECUTE _qry;

  -- Next, build and execute query that inserts new rows.
  _qry := 'INSERT INTO ' || pTableName || ' (
             taxhist_parent_id, taxhist_taxtype_id, taxhist_tax_id, taxhist_basis,
             taxhist_basis_tax_id, taxhist_sequence, taxhist_percent, 
             taxhist_amount, taxhist_tax, taxhist_docdate)
           SELECT ' || pParentId || ',';
  IF (pTaxTypeId IS NULL) THEN
    _qry := _qry || 'NULL';
  ELSE
    _qry := _qry || pTaxTypeId;
  END If;
  _qry := _qry || ', taxdetail_tax_id,' || pAmount || ', 
             taxdetail_tax_basis_tax_id, taxdetail_taxclass_sequence, taxdetail_taxrate_percent,
             taxdetail_taxrate_amount, taxdetail_tax, ''' || pDate || '''
           FROM calculatetaxdetail(' || COALESCE(pTaxZoneId,-1) || ',' || COALESCE(pTaxTypeId,-1) ||',''' || pDate || ''',' || pCurrId || ',' || pAmount || ');';
  EXECUTE _qry;

  RETURN true;
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
