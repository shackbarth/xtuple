
CREATE OR REPLACE FUNCTION reorderDate(INTEGER, INTEGER, BOOL) RETURNS DATE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pLookAhead ALIAS FOR $2;
  pIncludePlanned ALIAS FOR $3;
  _runningAvailability NUMERIC;
  _reorderLevel NUMERIC;
  _availability RECORD;

BEGIN

--  Make sure that we know how to handle the passed part
  IF ( SELECT (NOT (item_type IN (''M'', ''P'')))
       FROM item, itemsite
       WHERE ( (itemsite_item_id=item_id)
        AND (itemsite_id=pItemsiteid) ) ) THEN
    RETURN NULL;
  END IF;

--  Load the initial QOH
  SELECT itemsite_qtyonhand INTO _runningAvailability
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid);

--  Grab the Reorder Level, if any
  IF ( ( SELECT itemsite_useparams
         FROM itemsite
         WHERE (itemsite_id=pItemsiteid) ) ) THEN
    SELECT itemsite_reorderlevel INTO _reorderLevel
    FROM itemsite
    WHERE (itemsite_id=pItemsiteid);
  ELSE
    _reorderLevel := 0;
  END IF;

--  If we are already below the Reorder Level then we should order ASAP
  IF (_runningAvailability <= _reorderLevel) THEN
    RETURN CURRENT_DATE;
  END IF;

--  Grab all of the availability trigger points
  FOR _availability IN SELECT 1 AS seq,
                              wo_duedate AS orderdate,
                              (noNeg(wo_qtyord - wo_qtyrcv)) AS balance
                       FROM wo
                       WHERE ((wo_status IN (''O'', ''E'', ''R'', ''I''))
                        AND (wo_duedate <= (CURRENT_DATE + pLookAhead))
                        AND (wo_itemsite_id=pItemsiteid))

                      UNION SELECT 2 AS seq,
                                   womatl_duedate AS orderdate,
                                   (noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - womatl_qtyiss)) * -1) AS balance
                      FROM womatl, wo, itemsite
                      WHERE ((wo_status IN (''O'', ''E'', ''R'', ''I''))
                       AND (womatl_wo_id=wo_id)
                       AND (womatl_itemsite_id=itemsite_id)
                       AND (womatl_duedate <= (CURRENT_DATE + pLookahead))
                       AND (womatl_itemsite_id=pItemsiteid))

                      UNION SELECT 1 AS seq,
                                   poitem_duedate AS orderdate,
                                   (noNeg(poitem_qty_ordered - poitem_qty_received) * poitem_invvenduomratio) AS balance
                      FROM pohead, poitem
                      WHERE ((poitem_pohead_id=pohead_id)
                       AND (poitem_status = ''O'')
                       AND (poitem_duedate <= (CURRENT_DATE + pLookAhead))
                       AND (poitem_itemsite_id=pItemsiteid))

                      UNION SELECT 2 AS seq,
                                   coitem_scheddate AS orderdate,
                                   (noNeg(coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned) * -1) AS balance
                      FROM coitem, cohead
                      WHERE ((coitem_status = ''O'')
                       AND (coitem_cohead_id=cohead_id)
                       AND (coitem_scheddate <= (CURRENT_DATE + pLookAhead))
                       AND (coitem_itemsite_id=pItemsiteid))

                      UNION SELECT 2 AS seq,
                                   planord_startdate AS orderdate,
                                   (planreq_qty * -1) AS balance
                      FROM planreq, planord
                      WHERE ( (pIncludePlanned)
                       AND (planreq_source=''P'')
                       AND (planreq_source_id=planord_id)
                       AND (planord_startdate <= (CURRENT_DATE + pLookAhead))
                       AND (planord_itemsite_id=pItemsiteid) )

                      UNION SELECT 1 AS seq,
                                   planord_duedate AS orderdate,
                                   planord_qty AS balance
                      FROM planord
                      WHERE ( (pIncludePlanned)
                       AND (planord_duedate <= (CURRENT_DATE + pLookAhead))
                       AND (planord_itemsite_id=pItemsiteid) )

                      ORDER BY orderdate, seq LOOP

--  Calculate the new projected availability
    _runningAvailability := (_runningAvailability + _availability.balance);

--  Check to see if the project availability drop below the reorder level
    IF (_runningAvailability < _reorderLevel) THEN
      RETURN _availability.orderdate;
    END IF;

  END LOOP;

--  The reorder level was not reached within the look ahead period
  RETURN NULL;

END;
' LANGUAGE 'plpgsql';

