CREATE OR REPLACE FUNCTION invoiceTotal(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvoiceId ALIAS FOR $1;
  _linesum   NUMERIC;
  _linetax   NUMERIC;
  _result    NUMERIC;
  _allocated NUMERIC;
  _posted    BOOLEAN;

BEGIN

  SELECT SUM(ROUND(COALESCE((invcitem_billed * invcitem_qty_invuomratio) *
                             (invcitem_price / COALESCE(invcitem_price_invuomratio,1)), 0),2))
                          INTO _linesum
  FROM invcitem
  WHERE (invcitem_invchead_id=pInvoiceId);

  -- TODO: why sum on the result of select round(sum(), 2)?
  SELECT SUM(tax) INTO _linetax
    FROM (SELECT ROUND(SUM(COALESCE(taxdetail_tax, 0)),2) AS tax 
            FROM tax 
            JOIN calculateTaxDetailSummary('I', pInvoiceId, 'T') ON (taxdetail_tax_id=tax_id)
	  GROUP BY tax_id) AS data;

  SELECT noNeg(invchead_freight + invchead_misc_amount + COALESCE(_linetax, 0) + COALESCE(_linesum, 0)),
         invchead_posted INTO _result, _posted
  FROM invchead
  WHERE (invchead_id=pInvoiceId);

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  IF (_posted) THEN
    SELECT COALESCE(SUM(currToCurr(arapply_curr_id, aropen_curr_id,
                                   arapply_applied, aropen_docdate)),0) INTO _allocated
     FROM arapply, aropen, invchead
    WHERE ( (invchead_posted)
      AND   (invchead_id=pInvoiceId)
      AND   (aropen_docnumber=invchead_invcnumber)
      AND   (aropen_doctype='I')
      AND   (arapply_target_aropen_id=aropen_id)
      AND   (arapply_reftype='S')
      AND   (invchead_posted) ) ;
  ELSE
    SELECT COALESCE(SUM(CASE WHEN((aropen_amount - aropen_paid) >=
                       currToCurr(aropenalloc_curr_id, aropen_curr_id,
                          aropenalloc_amount, aropen_docdate))
           THEN currToCurr(aropenalloc_curr_id, invchead_curr_id,
                   aropenalloc_amount, aropen_docdate)
           ELSE currToCurr(aropen_curr_id, invchead_curr_id,
                   aropen_amount - aropen_paid, aropen_docdate)
           END),0) INTO _allocated
     FROM invchead LEFT OUTER JOIN cohead ON (cohead_number=invchead_ordernumber)
                   JOIN aropenalloc ON ((aropenalloc_doctype='I' AND aropenalloc_doc_id=invchead_id) OR
                                        (aropenalloc_doctype='S' AND aropenalloc_doc_id=cohead_id))
                   JOIN aropen ON (aropen_id=aropenalloc_aropen_id AND (aropen_amount - aropen_paid) > 0.0)
    WHERE ( (NOT invchead_posted)
      AND   (invchead_id=pInvoiceId) );
  END IF;
  
  RETURN _result - COALESCE(_allocated, 0);

END;
$$ LANGUAGE 'plpgsql';
