CREATE OR REPLACE FUNCTION getSoitemStatus(pCoitemid INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result TEXT;

BEGIN

  SELECT
      (CASE WHEN (coitem_status='O' AND (SELECT cust_creditstatus FROM custinfo WHERE cust_id=cohead_cust_id)='H') THEN 'H'
            WHEN (coitem_status='O' AND ((SELECT SUM(invcitem_billed)
                                            FROM invchead, invcitem
                                           WHERE ((CAST(invchead_ordernumber AS text)=cohead_number)
                                             AND  (invcitem_invchead_id=invchead_id)
                                             AND  (invcitem_item_id=itemsite_item_id)
                                             AND  (invcitem_warehous_id=itemsite_warehous_id)
                                             AND  (invcitem_linenumber=coitem_linenumber))) >= coitem_qtyord)) THEN 'I'
            WHEN (coitem_status='O' AND ((SELECT SUM(invcitem_billed)
                                            FROM invchead, invcitem
                                           WHERE ((CAST(invchead_ordernumber AS text)=cohead_number)
                                             AND  (invcitem_invchead_id=invchead_id)
                                             AND  (invcitem_item_id=itemsite_item_id)
                                             AND  (invcitem_warehous_id=itemsite_warehous_id)
                                             AND  (invcitem_linenumber=coitem_linenumber))) > 0)) THEN 'P'
            WHEN (coitem_status='O' AND (qtyAvailable(itemsite_id) - qtyAllocated(itemsite_id, CURRENT_DATE)
                                         + qtyOrdered(itemsite_id, CURRENT_DATE))
                                          >= ((coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned) * coitem_qty_invuomratio)) THEN 'R'
            ELSE coitem_status END
       || CASE WHEN (coitem_firm) THEN 'F' ELSE '' END
       ) INTO _result
  FROM coitem JOIN cohead ON (cohead_id=coitem_cohead_id)
              JOIN custinfo ON (cust_id=cohead_cust_id)
              JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
  WHERE (coitem_id=pCoitemid);

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql' STABLE;
