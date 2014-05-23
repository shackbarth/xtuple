
CREATE OR REPLACE FUNCTION calculatetaxdetailsummary(text, integer, text)
  RETURNS SETOF taxdetail AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOrderType ALIAS FOR $1;
  pOrderId ALIAS FOR $2;
  pDisplayType ALIAS FOR $3;
  _row taxdetail%ROWTYPE;
  _qry text := '';
  _qry1 text;
  _totaltax numeric;
  _x RECORD;
  _y RECORD;
  _table text;

BEGIN
 _totaltax=0.0;
 IF pOrderType IN ('S','Q','RA','PO') THEN

   IF pOrderType = 'S' THEN
     _qry := 'SELECT ' || 'COALESCE(cohead_taxzone_id, -1) AS taxzone_id, cohead_orderdate AS order_date,
                cohead_curr_id AS curr_id, COALESCE(coitem_taxtype_id, -1) AS taxtype_id,
                ROUND((coitem_qtyord * coitem_qty_invuomratio) * (coitem_price / coitem_price_invuomratio),2) AS amount
              FROM cohead, coitem
              WHERE ( (coitem_cohead_id = ' || pOrderId || ')
               AND (' || 'cohead_id = coitem_cohead_id)
               AND ( coitem_status != ''X'') )';
   ELSEIF  pOrderType = 'Q' THEN
     _qry := 'SELECT ' || 'COALESCE(quhead_taxzone_id, -1) AS taxzone_id, quhead_quotedate AS order_date,
                quhead_curr_id AS curr_id, COALESCE(quitem_taxtype_id, -1) AS taxtype_id,
                ROUND((quitem_qtyord * quitem_qty_invuomratio) * (quitem_price / quitem_price_invuomratio),2) AS amount
              FROM quhead, quitem
              WHERE ( (quitem_quhead_id = ' || pOrderId || ')
               AND (quhead_id = quitem_quhead_id) )';
   ELSEIF  pOrderType = 'RA' THEN
     _qry := 'SELECT ' || 'COALESCE(rahead_taxzone_id, -1) AS taxzone_id, rahead_authdate AS order_date,
                rahead_curr_id AS curr_id, COALESCE(raitem_taxtype_id, -1) AS taxtype_id,
                ROUND((raitem_qtyauthorized * raitem_qty_invuomratio) * (raitem_unitprice / raitem_price_invuomratio),2) AS amount
              FROM rahead, raitem
              WHERE ( (raitem_rahead_id = ' || pOrderId || ')
               AND (rahead_id = raitem_rahead_id) )';
   ELSEIF  pOrderType = 'PO' THEN
     _qry := 'SELECT ' || 'COALESCE(pohead_taxzone_id, -1) AS taxzone_id, pohead_orderdate AS order_date,
                pohead_curr_id AS curr_id, COALESCE(poitem_taxtype_id, -1) AS taxtype_id,
                ROUND(poitem_qty_ordered * poitem_unitprice, 2) AS amount
              FROM pohead, poitem
              WHERE ( (poitem_pohead_id = ' || pOrderId || ')
               AND (pohead_id = poitem_pohead_id) )';
  END IF;

  FOR _x IN EXECUTE _qry
  LOOP
    _qry1 := 'SELECT * from calculatetaxdetail(' || _x.taxzone_id || ',' || _x.taxtype_id || ',''' || _x.order_date || ''',' || _x.curr_id  || ',' || _x.amount || ')';
    FOR _y IN  EXECUTE _qry1
    LOOP
      _row.taxdetail_tax_id=_y.taxdetail_tax_id;
      _row.taxdetail_tax_code = _y.taxdetail_tax_code;
      _row.taxdetail_tax_descrip = _y.taxdetail_tax_descrip;
      _row.taxdetail_tax = _y.taxdetail_tax;
      _row.taxdetail_level=_y.taxdetail_level;
      _row.taxdetail_taxclass_sequence= _y.taxdetail_taxclass_sequence;
      _totaltax = _totaltax + _y.taxdetail_tax;
      RETURN NEXT _row;
    END LOOP;
  END LOOP;

  IF pDisplayType = 'T' AND pOrderType <> 'PO' THEN
   IF pOrderType = 'S' THEN
    _qry := 'SELECT COALESCE(cohead_taxzone_id, -1) AS taxzone_id, cohead_orderdate AS order_date,
               cohead_curr_id AS curr_id, cohead_freight AS freight
             FROM cohead WHERE cohead_id = ' || pOrderId ;
   ELSEIF  pOrderType = 'Q' THEN
    _qry := 'SELECT COALESCE(quhead_taxzone_id, -1) AS taxzone_id, quhead_quotedate AS order_date,
               quhead_curr_id AS curr_id, COALESCE(quhead_freight,0) AS freight
             FROM quhead WHERE quhead_id = ' || pOrderId;
   ELSEIF pOrderType = 'RA' THEN
    _qry := 'SELECT COALESCE(rahead_taxzone_id, -1) AS taxzone_id, COALESCE(rahead_authdate,CURRENT_DATE) AS order_date,
               rahead_curr_id AS curr_id, COALESCE(rahead_freight,0) AS freight
             FROM rahead WHERE rahead_id = ' || pOrderId;
   END IF;

  FOR _x IN EXECUTE _qry
  LOOP
     _qry1 := 'SELECT * from calculatetaxdetail(' || _x.taxzone_id || ', getfreighttaxtypeid(),''' || _x.order_date || ''',' || _x.curr_id  || ',' || _x.freight || ')';
    FOR _y IN  EXECUTE _qry1
    LOOP
       _row.taxdetail_tax_id=_y.taxdetail_tax_id;
       _row.taxdetail_tax_code = _y.taxdetail_tax_code;
       _row.taxdetail_tax_descrip = _y.taxdetail_tax_descrip;
       _row.taxdetail_tax = _y.taxdetail_tax;
       _row.taxdetail_level=_y.taxdetail_level;
       _row.taxdetail_taxclass_sequence= _y.taxdetail_taxclass_sequence;
       _totaltax = _totaltax + _y.taxdetail_tax;
       RETURN NEXT _row;
     END LOOP;
   END LOOP;
  END IF;

 ELSEIF pOrderType IN ('I','B','CM', 'VO','TO') THEN
   IF (pOrderType='I') THEN
     _table := 'invcheadtax';
   ELSIF (pOrderType='B') THEN
     _table := 'cobmisctax';
   ELSIF (pOrderType='CM') THEN
     _table := 'cmheadtax';
   ELSIF (pOrderType='VO') THEN
     _table := 'voheadtax';
   ELSIF (pOrderType='TO') THEN
     _table := 'tohead';
   END IF;

   IF pOrderType = 'I' AND (pDisplayType IN ('L','T')) THEN
     _qry := 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, taxhist_sequence
              FROM invchead, invcitemtax LEFT OUTER JOIN tax ON (taxhist_tax_id=tax_id)
               LEFT OUTER JOIN invcitem ON (invcitem_id=taxhist_parent_id)
              WHERE invcitem_invchead_id = ' || pOrderId || '
               AND invchead_id = invcitem_invchead_id ';
   ELSIF pOrderType = 'B' AND (pDisplayType IN ('L','T')) THEN
    _qry := 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, taxhist_sequence
             FROM cobmisc, cobilltax LEFT OUTER JOIN tax ON (taxhist_tax_id=tax_id)
             LEFT OUTER JOIN cobill ON (cobill_id=taxhist_parent_id)
             WHERE cobill_cobmisc_id = ' || pOrderId || '
             AND cobmisc_id = cobill_cobmisc_id ';
   ELSIF pOrderType = 'CM' AND (pDisplayType IN ('L','T')) THEN
    _qry := 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, taxhist_sequence
             FROM cmhead, cmitemtax LEFT OUTER JOIN tax ON (taxhist_tax_id=tax_id)
             LEFT OUTER JOIN cmitem ON (cmitem_id=taxhist_parent_id)
             WHERE cmitem_cmhead_id = ' || pOrderId || '
             AND cmhead_id = cmitem_cmhead_id ';
   ELSIF pOrderType = 'VO' AND (pDisplayType IN ('L','T')) THEN
    _qry := 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, taxhist_sequence
             FROM vohead, voitemtax LEFT OUTER JOIN tax ON (taxhist_tax_id=tax_id)
             LEFT OUTER JOIN voitem ON (voitem_id=taxhist_parent_id)
             WHERE voitem_vohead_id = ' || pOrderId || '
             AND vohead_id = voitem_vohead_id ';
   ELSIF pOrderType = 'TO' AND (pDisplayType IN ('L','T')) THEN
    _qry := 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, taxhist_sequence
             FROM tohead, toitemtax LEFT OUTER JOIN tax ON (taxhist_tax_id=tax_id)
             LEFT OUTER JOIN toitem ON (toitem_id=taxhist_parent_id)
             WHERE toitem_tohead_id = ' || pOrderId || '
             AND tohead_id = toitem_tohead_id ';
   END IF;
   IF pDisplayType IN ('F','T') AND pOrderType <> 'VO' THEN
     IF (length(_qry) > 0) THEN
       _qry := _qry || ' UNION ALL ';
     END IF;
     _qry := _qry || 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, taxhist_sequence
              FROM ' || _table || '
               JOIN tax ON (taxhist_tax_id=tax_id)
              WHERE ( (taxhist_parent_id = ' || pOrderId || ')
               AND (taxhist_taxtype_id=getfreighttaxtypeid()) )';
   END IF;
   IF pDisplayType IN ('A','T') THEN
     IF (length(_qry) > 0) THEN
       _qry := _qry || ' UNION ALL ';
     END IF;
     _qry := _qry || 'SELECT taxhist_tax_id as tax_id, tax_code, tax_descrip, taxhist_tax, taxhist_sequence
              FROM ' || _table || '
               JOIN tax ON (taxhist_tax_id=tax_id)
              WHERE ( (taxhist_parent_id = ' || pOrderId || ')
               AND (taxhist_taxtype_id=getadjustmenttaxtypeid()) )';

   END IF;
   FOR _y IN  EXECUTE _qry
   LOOP
     _row.taxdetail_tax_id=_y.tax_id;
     _row.taxdetail_tax_code = _y.tax_code;
     _row.taxdetail_tax_descrip = _y.tax_descrip;
     _row.taxdetail_tax = _y.taxhist_tax;
     _row.taxdetail_level= 0 ;
     _row.taxdetail_taxclass_sequence= COALESCE(_y.taxhist_sequence,0);
     _totaltax = _totaltax + _y.taxhist_tax;
     RETURN NEXT _row;
   END LOOP;
 END IF;
 END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
