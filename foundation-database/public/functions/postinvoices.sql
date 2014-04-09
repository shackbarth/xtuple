CREATE OR REPLACE FUNCTION postInvoices(BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPostUnprinted ALIAS FOR $1;
BEGIN
  RETURN postInvoices(pPostUnprinted, FALSE);
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION postInvoices(BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPostUnprinted ALIAS FOR $1;
  pInclZeros     ALIAS FOR $2;
BEGIN
  RETURN postInvoices(pPostUnprinted, pInclZeros, fetchJournalNumber('AR-IN'));
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION postInvoices(BOOLEAN, BOOLEAN, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPostUnprinted ALIAS FOR $1;
  pInclZeros     ALIAS FOR $2;
  pJournalNumber ALIAS FOR $3;
  _invcheadid    INTEGER;
  _itemlocSeries INTEGER;
  _counter INTEGER;
  _r RECORD;

BEGIN

  _itemlocSeries := 0;

  IF (pInclZeros) THEN

    FOR _invcheadid IN
      SELECT invchead_id
      FROM invchead
      WHERE ( (NOT invchead_posted)
       AND (checkInvoiceSitePrivs(invchead_id))
       AND (pPostUnprinted OR invchead_printed) ) LOOP

      SELECT postInvoice(_invcheadid, pJournalNumber, _itemlocSeries) INTO _itemlocSeries;
      IF (_itemlocSeries < 0) THEN
        RETURN _itemlocSeries;
      END IF;
    END LOOP;

  ELSE

    FOR _invcheadid IN
      SELECT invchead_id
      FROM invchead LEFT OUTER JOIN invcitem ON (invchead_id=invcitem_invchead_id)
                    LEFT OUTER JOIN item ON (invcitem_item_id=item_id)  
      WHERE((NOT invchead_posted)
        AND (checkInvoiceSitePrivs(invchead_id))
        AND (pPostUnprinted OR invchead_printed))
      GROUP BY invchead_id, invchead_freight, invchead_misc_amount
      HAVING (COALESCE(SUM(round((invcitem_billed * invcitem_qty_invuomratio) * (invcitem_price /  
              CASE WHEN (item_id IS NULL) THEN 1 
              ELSE invcitem_price_invuomratio END), 2)),0)
             + invchead_freight + invchead_misc_amount) > 0 LOOP

      SELECT postInvoice(_invcheadid, pJournalNumber, _itemlocSeries) INTO _itemlocSeries;
      IF (_itemlocSeries < 0) THEN
        RETURN _itemlocSeries;
      END IF;
    END LOOP;

  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE plpgsql;
