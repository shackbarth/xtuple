
CREATE OR REPLACE FUNCTION calculatesubtax(integer, date, integer, numeric, integer)
  RETURNS SETOF taxdetail AS
$$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxCodeId ALIAS FOR $1;
  pDate ALIAS FOR $2;
  pCurrId ALIAS FOR $3;
  pAmount ALIAS FOR $4;
  pLevel ALIAS FOR $5;
  _row taxdetail%ROWTYPE;
  _rownumber INTEGER := 1;
  _calc_tax Numeric :=0;
  _x RECORD;
  _y RECORD;

BEGIN
  FOR _x IN 

  SELECT tax_id, tax_code, tax_descrip, tax_basis_tax_id,
    taxrate_id, taxrate_percent, taxrate_curr_id, taxrate_amount,  
    taxclass_id, taxclass_code, COALESCE(taxclass_sequence,0) AS taxclass_sequence,
    curr_id, curr_abbr
  FROM tax, taxrate, taxclass, curr_symbol
  WHERE ((tax_id = taxrate_tax_id)
  AND (tax_taxclass_id = taxclass_id)
  AND (taxrate_curr_id = curr_id)
  AND (tax_basis_tax_id = pTaxCodeId)
  AND (pDate BETWEEN taxrate_effective AND taxrate_expires)
  AND (taxrate_curr_id = pCurrId))
  
  LOOP
    SELECT 
      ROUND((_x.taxrate_percent * pAmount + currToCurr(_x.curr_id, pCurrId, _x.taxrate_amount, pDate)), 6) 
    INTO _calc_tax;

    _row.taxdetail_tax_id = _x.tax_id;
    _row.taxdetail_tax_code = _x.tax_code;
    _row.taxdetail_tax_descrip = _x.tax_descrip;
    _row.taxdetail_tax_basis_tax_id = _x.tax_basis_tax_id ;
    _row.taxdetail_taxrate_percent = _x.taxrate_percent;
    _row.taxdetail_taxrate_amount = _x.taxrate_amount;
    _row.taxdetail_level = pLevel + 1;
    _row.taxdetail_taxclass_id = _x.taxclass_id ; 
    _row.taxdetail_taxclass_code = _x.taxclass_code;
    _row.taxdetail_taxclass_sequence = _x.taxclass_sequence;
    _row.taxdetail_tax = _calc_tax;
    _row.taxdetail_curr_id = _x.curr_id;
    _row.taxdetail_curr_abbr = _x.curr_abbr;

    RETURN NEXT _row;
    _rownumber := _rownumber + 1;

    FOR _y IN  
    SELECT * 
    FROM calculateSubTax( _x.tax_id, pDate, pCurrId, _calc_tax, pLevel + 1)
    LOOP
      _row.taxdetail_tax_id = _y.taxdetail_tax_id;
      _row.taxdetail_tax_code = _y.taxdetail_tax_code;
      _row.taxdetail_tax_descrip = _y.taxdetail_tax_descrip;
      _row.taxdetail_tax_basis_tax_id = _y.taxdetail_tax_basis_tax_id ;
      _row.taxdetail_taxrate_percent = _y.taxdetail_taxrate_percent;
      _row.taxdetail_taxrate_amount = _y.taxdetail_taxrate_amount;
      _row.taxdetail_level = _y.taxdetail_level + 1;
      _row.taxdetail_taxclass_id = _y.taxdetail_taxclass_id ; 
      _row.taxdetail_taxclass_code = _y.taxdetail_taxclass_code;
      _row.taxdetail_taxclass_sequence = _y.taxdetail_taxclass_sequence;
      _row.taxdetail_tax = _y.taxdetail_tax;
      _row.taxdetail_curr_id = _y.taxdetail_curr_id;
      _row.taxdetail_curr_abbr = _y.taxdetail_curr_abbr;
      
      RETURN NEXT _row;
      _rownumber := _rownumber + 1;

    END LOOP;

  END LOOP;

END;
$$
  LANGUAGE 'plpgsql' VOLATILE;
