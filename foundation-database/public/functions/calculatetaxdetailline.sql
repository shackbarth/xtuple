
CREATE OR REPLACE FUNCTION calculatetaxdetailline(text, integer)
  RETURNS SETOF taxdetail AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOrderType ALIAS FOR $1;
  pOrderId ALIAS FOR $2;
  _row taxdetail%ROWTYPE;
  _qry text;
  _totaltax numeric;
  _y RECORD;
  _table text;

BEGIN
   _totaltax=0.0;

   IF pOrderType = 'II' THEN
     _table := 'invcitemtax';
   ELSIF pOrderType = 'BI' THEN
     _table := 'cobilltax';
   ELSIF pOrderType = 'CI' THEN
     _table := 'cmitemtax';
   ELSIF pOrderType = 'VI' THEN
     _table := 'voitemtax';
   ELSIF pOrderType = 'TI' THEN
     _table := 'toitemtax';
   ELSIF pOrderType = 'AR' THEN
     _table := 'aropentax';
   ELSIF pOrderType = 'AP' THEN
     _table := 'apopentax';
   END IF;

   _qry := 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, COALESCE(taxhist_sequence,0) AS taxhist_sequence
            FROM ' || _table || '
             JOIN tax ON (taxhist_tax_id=tax_id)
            WHERE ( (taxhist_parent_id = ' || pOrderId || ') );';

   FOR _y IN  EXECUTE _qry
   LOOP
     _row.taxdetail_tax_id=_y.tax_id;
     _row.taxdetail_tax_code = _y.tax_code;
     _row.taxdetail_tax_descrip = _y.tax_descrip;
     _row.taxdetail_tax = _y.taxhist_tax;
     _row.taxdetail_level= 0 ;
     _row.taxdetail_taxclass_sequence= _y.taxhist_sequence;
     _totaltax = _totaltax + _y.taxhist_tax;
     RETURN NEXT _row;
   END LOOP;
 END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
