
CREATE OR REPLACE FUNCTION calculatetaxdetail(integer, integer, date, integer, numeric)
  RETURNS SETOF taxdetail AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxZoneId ALIAS FOR  $1;
  pTaxTypeId ALIAS FOR  $2;
  pDate ALIAS FOR  $3;
  pCurrId ALIAS FOR $4;
  pAmount ALIAS FOR $5;
  _row taxdetail%ROWTYPE;
  _x RECORD;
  _y RECORD;
  _z RECORD;
  _currcum numeric := 0;  -- Current cumulative tax
  _currseq numeric := 0;  -- Current group sequence
  _prevcum numeric := 0;  -- Previous cumulative tax
  _tax numeric := 0;      -- Calculated tax amount
  _taxbasis numeric := 0;  -- Used for calculating sub taxes

BEGIN

  IF ((COALESCE(pTaxTypeId,-1) = -1) OR (COALESCE(pTaxZoneId,-1) = -1)) THEN
    RETURN;
  END IF;

  SELECT DISTINCT
    COALESCE(taxass_taxzone_id, -1) AS taxzone_id,
    COALESCE(taxass_taxtype_id, -1) AS taxtype_id,
    taxass_tax_id,
    CASE
      WHEN ((taxass_taxzone_id IS NOT NULL) AND (taxass_taxtype_id IS NOT NULL)) THEN
        0
      WHEN ((taxass_taxzone_id IS NOT NULL) AND (taxass_taxtype_id IS NULL)) THEN
        1
      WHEN ((taxass_taxzone_id IS NULL) AND (taxass_taxtype_id IS NOT NULL)) THEN
        2
      ELSE
        3
    END AS sequence
    INTO _x
  FROM taxass
  WHERE  ((COALESCE(taxass_taxzone_id, pTaxZoneId, -1) = COALESCE(pTaxZoneId,-1))
  AND    (COALESCE(taxass_taxtype_id, pTaxTypeId, -1) = COALESCE(pTaxTypeId,-1)))
  ORDER BY sequence LIMIT 1;

  --Now loop through each tax detail record and return calculated result
  FOR _y IN
    SELECT  --the data required by taxdetail type.  Coalesce group sequence to 0 if no class.
    tax_id
    ,tax_code
    ,tax_descrip
    ,tax_basis_tax_id
    ,taxrate_percent
    ,taxrate_amount
    ,0 as taxdetail_level 
    ,taxclass_id
    ,taxclass_code
    ,COALESCE(taxclass_sequence, 0) AS taxclass_sequence
    ,0 as taxdetail_tax
    ,curr_id
    ,curr_abbr	
    FROM taxass, taxclass RIGHT OUTER JOIN tax  
      LEFT OUTER JOIN taxrate ON (taxrate_tax_id=tax_id)
    ON (tax_taxclass_id=taxclass_id),
    curr_symbol 
    WHERE 
    taxass_tax_id=tax_id
    AND taxrate_curr_id=curr_id
    AND COALESCE(taxass_taxzone_id, -1) = _x.taxzone_id
    AND COALESCE(taxass_taxtype_id, -1) = _x.taxtype_id
    AND pDate BETWEEN COALESCE(taxrate_effective, startoftime()) AND COALESCE(taxrate_expires, endoftime())
    ORDER BY COALESCE(taxclass_sequence, 0)
  LOOP
    -- If sequence has changed, cache the previous cumulative tax
    IF (_currseq != _x.sequence) THEN
      _prevcum := _currcum;
    END IF;

    -- Calculate the tax amount.  Convert currency for flat rate amounts
    SELECT 
    ROUND((_y.taxrate_percent * (pAmount + _prevcum) + currToCurr(_y.curr_id, pCurrId, _y.taxrate_amount, pDate)), 6) 
    INTO _tax
    FROM tax JOIN  taxrate ON (tax_id = taxrate_tax_id)
    WHERE (tax_id=_x.taxass_tax_id)
    AND (pDate BETWEEN COALESCE(taxrate_effective, startoftime()) AND COALESCE(taxrate_expires, endoftime()));

    --Map fields to _row

    _row.taxdetail_tax_id := _y.tax_id;
    _row.taxdetail_tax_code := _y.tax_code;
    _row.taxdetail_tax_descrip := _y.tax_descrip;
    _row.taxdetail_tax_basis_tax_id := _y.tax_basis_tax_id;
    _row.taxdetail_taxrate_percent := _y.taxrate_percent;
    _row.taxdetail_taxrate_amount := _y.taxrate_amount;
    _row.taxdetail_level := _y.taxdetail_level;
    _row.taxdetail_taxclass_id := _y.taxclass_id;
    _row.taxdetail_taxclass_code := _y.taxclass_code;
    _row.taxdetail_taxclass_sequence := _y.taxclass_sequence;
    _row.taxdetail_tax := _tax;
    _row.taxdetail_curr_id := _y.curr_id;
    _row.taxdetail_curr_abbr := _y.curr_abbr;
  
    RETURN NEXT _row;

    -- Increment cumulative balance and sequence number
    IF(_y.taxclass_sequence <> 0) THEN
      _currcum := _currcum + _tax;
    END IF;
    _currseq := _y.taxclass_sequence;

    -- Loop to Calculate sub taxes
    FOR _z IN
    SELECT *
    FROM calculateSubTax(_y.tax_id,pDate, pCurrId, _tax, 0)
    LOOP
     --Mapping of data
    _row.taxdetail_tax_id := _z.taxdetail_tax_id;
    _row.taxdetail_tax_code := _z.taxdetail_tax_code;
    _row.taxdetail_tax_descrip := _z.taxdetail_tax_descrip;
    _row.taxdetail_tax_basis_tax_id := _z.taxdetail_tax_basis_tax_id;
    _row.taxdetail_taxrate_percent := _z.taxdetail_taxrate_percent;
    _row.taxdetail_taxrate_amount := _z.taxdetail_taxrate_amount;
    _row.taxdetail_level := _z.taxdetail_level;
    _row.taxdetail_taxclass_id := _z.taxdetail_taxclass_id;
    _row.taxdetail_taxclass_code := _z.taxdetail_taxclass_code;
    _row.taxdetail_taxclass_sequence := _z.taxdetail_taxclass_sequence;
    _row.taxdetail_tax := _z.taxdetail_tax;
    _row.taxdetail_curr_id := _z.taxdetail_curr_id;
    _row.taxdetail_curr_abbr := _z.taxdetail_curr_abbr;

     RETURN NEXT _row;
     --Add to cumulative counter (_curcum)
     _currcum := _currcum + _z.taxdetail_tax ;

    END LOOP;

   END LOOP;
 
END;
 $BODY$
  LANGUAGE 'plpgsql' VOLATILE;
