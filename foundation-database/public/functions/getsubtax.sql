
CREATE OR REPLACE FUNCTION getsubtax(integer, integer)
  RETURNS SETOF subtax AS
$$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxCodeId ALIAS FOR $1;
  pLevel ALIAS FOR $2;
  _row subtax%ROWTYPE;
  _x RECORD;
  _y RECORD;

BEGIN

  FOR _x IN --Select all tax codes whose calculation basis is pTaxCodeId
    SELECT tax_id, tax_code, tax_descrip
    FROM tax
    WHERE tax_basis_tax_id = pTaxCodeId
    
    
    LOOP
    _row.subtax_taxcode_id := _x.tax_id;
    _row.subtax_taxcode_code := _x.tax_code;
    _row.subtax_taxcode_descrip := _x.tax_descrip;
    _row.subtax_taxcode_level := pLevel + 1;

   RETURN NEXT _row;  
  
    FOR _y IN SELECT * from getSubTax(_x.tax_id, pLevel + 1) --This is the recursive part.
    LOOP

      _row.subtax_taxcode_id := _y.subtax_taxcode_id;
      _row.subtax_taxcode_code := _y.subtax_taxcode_code ;
      _row.subtax_taxcode_descrip := _y.subtax_taxcode_descrip;
      _row.subtax_taxcode_level := pLevel + 2;

      RETURN NEXT _row;

    END LOOP;
 
  END LOOP;

END;
$$
  LANGUAGE 'plpgsql' VOLATILE;
