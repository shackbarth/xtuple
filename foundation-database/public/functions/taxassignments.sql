
CREATE OR REPLACE FUNCTION taxassignments(integer, integer)
  RETURNS SETOF taxassign AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxZoneId ALIAS FOR $1;
  pTaxTypeId ALIAS FOR $2;
  _row taxassign%ROWTYPE;
  _qry text;
  _x RECORD;
  _y RECORD;
  _z RECORD;

BEGIN
  _qry = 'SELECT DISTINCT COALESCE(taxass_taxzone_id, -1) AS taxass_taxzone_id, COALESCE(taxass_taxtype_id, -1) AS taxass_taxtype_id, ';
  _qry = _qry || 'taxzone_code, taxtype_name FROM taxass LEFT OUTER JOIN taxzone ON (taxass_taxzone_id=taxzone_id) ';
  _qry = _qry || 'LEFT OUTER JOIN taxtype ON (taxass_taxtype_id=taxtype_id) ';

  IF ((pTaxZoneId > 0) OR (pTaxTypeId > 0)) THEN
    _qry := _qry || ' WHERE ';
    IF (pTaxZoneId > 0) THEN
      _qry := _qry || ' (taxass_taxzone_id = ' || pTaxZoneId ||')';
      IF (pTaxTypeId > 0) THEN
        _qry := _qry || ' AND ';
      END IF;
    END IF;
    IF (pTaxTypeId > 0) THEN
      _qry := _qry || ' (taxass_taxtype_id = ' || pTaxTypeId || ')';
    END IF;
  END IF;

  --This first query gets all the distinct tax zone and type groupings as if it were its own table.
  --This allows us to have a level 0 record as pictured in Tax Assignments window that code assignements will
  --Subordinate to.
  FOR _x IN  EXECUTE _qry
  LOOP
    --Map values to _row here
    _row.taxassign_taxzone_id = _x.taxass_taxzone_id;
    _row.taxassign_taxtype_id = _x.taxass_taxtype_id;
    _row.taxassign_level = 0;
    _row.taxassign_zone_code = _x.taxzone_code;
    _row.taxassign_type_descrip = _x.taxtype_name;
    _row.taxassign_taxclass_code = '';
    _row.taxassign_taxclass_sequence = NULL;
    RETURN NEXT _row; --so we get a level tax zone/type 0 record.
  
    -- Now get all the tax code assignments that belong to this Zone and Type pair
    FOR _y IN
      SELECT taxass_id, COALESCE(taxzone_id, -1) AS taxzone_id, tax_id,
      tax_code, tax_descrip, COALESCE(taxtype_id, -1) AS taxtype_id, taxzone_code, 
      taxtype_descrip, taxclass_code, 
      COALESCE(taxclass_sequence, 0) AS taxclass_sequence
      FROM taxass JOIN tax 
         LEFT OUTER JOIN taxclass ON (tax_taxclass_id = taxclass_id)
      ON (taxass_tax_id = tax_id)
      LEFT OUTER JOIN taxzone ON (taxass_taxzone_id = taxzone_id)
      LEFT OUTER JOIN taxtype ON (taxass_taxtype_id = taxtype_id)
      WHERE COALESCE(taxass_taxzone_id, -1) = _x.taxass_taxzone_id
      AND   COALESCE(taxass_taxtype_id, -1) = _x.taxass_taxtype_id
    LOOP
      --Map results to _row
      _row.taxassign_taxzone_id = _y.taxzone_id;
      _row.taxassign_taxtype_id = _y.taxtype_id;
      _row.taxassign_level = 1;
      _row.taxassign_zone_code = _y.tax_code;
      _row.taxassign_type_descrip = _y.tax_descrip;
      _row.taxassign_taxclass_code = _y.taxclass_code;
      _row.taxassign_taxclass_sequence = _y.taxclass_sequence;
      RETURN NEXT _row; --to get code detail record;
      
      FOR _z IN SELECT * FROM getsubtax(_y.tax_id, 1) --a new recursive function described above
      LOOP
        --Map results to _row
        _row.taxassign_taxzone_id = _y.taxzone_id;
        _row.taxassign_taxtype_id = _y.taxtype_id;
        _row.taxassign_level = _z.subtax_taxcode_level;
        _row.taxassign_zone_code = _z.subtax_taxcode_code;
        _row.taxassign_type_descrip = _z.subtax_taxcode_descrip;
        _row.taxassign_taxclass_code = _y.taxclass_code;
        _row.taxassign_taxclass_sequence = _y.taxclass_sequence;
        RETURN NEXT _row;
      END  LOOP;

    END LOOP;

  END LOOP;

END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
