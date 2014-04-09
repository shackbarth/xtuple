CREATE OR REPLACE FUNCTION postProduction(INTEGER, NUMERIC, BOOLEAN, INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid          ALIAS FOR $1;
  pQty           ALIAS FOR $2;
  pBackflush     ALIAS FOR $3;
  pItemlocSeries ALIAS FOR $4;
  pGlDistTS      ALIAS FOR $5;
  _test          INTEGER;
  _invhistid     INTEGER;
  _itemlocSeries INTEGER;
  _parentQty     NUMERIC;
  _r             RECORD;
  _sense         TEXT;
  _wipPost       NUMERIC;
  _woNumber      TEXT;
  _ucost         NUMERIC;

BEGIN

  IF (pQty = 0) THEN
    RETURN 0;
  ELSIF (pQty > 0) THEN
    _sense = 'from';
  ELSE
    _sense = 'to';
  END IF;

  IF ( ( SELECT wo_status
         FROM wo
         WHERE (wo_id=pWoid) ) NOT IN  ('R','E','I') ) THEN
    RETURN -1;
  END IF;

--  Make sure that all Component Item Sites exist
  SELECT bomitem_id INTO _test
  FROM wo, bomitem, itemsite
  WHERE ( (wo_itemsite_id=itemsite_id)
   AND (itemsite_item_id=bomitem_parent_item_id)
   AND (woEffectiveDate(wo_startdate) BETWEEN bomitem_effective AND (bomitem_expires - 1))
   AND (wo_id=pWoid)
   AND (bomitem_rev_id=wo_bom_rev_id)
   AND (bomitem_item_id NOT IN
        ( SELECT component.itemsite_item_id
          FROM itemsite AS component, itemsite AS parent
          WHERE ( (wo_itemsite_id=parent.itemsite_id)
           AND (parent.itemsite_item_id=bomitem_parent_item_id)
           AND (bomitem_item_id=component.itemsite_item_id)
           AND (woEffectiveDate(wo_startdate) BETWEEN bomitem_effective AND (bomitem_expires - 1))
           AND (bomitem_rev_id=wo_bom_rev_id)
           AND (component.itemsite_active)
           AND (component.itemsite_warehous_id=parent.itemsite_warehous_id) ) ) ) )
  LIMIT 1;
  IF (FOUND AND pBackflush) THEN
    RETURN -2;
  END IF;

  SELECT formatWoNumber(pWoid) INTO _woNumber;

  SELECT roundQty(item_fractional, pQty) INTO _parentQty
  FROM wo, itemsite, item
  WHERE ((wo_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (wo_id=pWoid));

--  Create the material receipt transaction
  IF (pItemlocSeries = 0) THEN
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  ELSE
    _itemlocSeries = pItemlocSeries;
  END IF;

  IF (pBackflush) THEN
    FOR _r IN SELECT womatl_id, womatl_qtyiss + 
		     (CASE 
		       WHEN (womatl_qtywipscrap >  ((womatl_qtyfxd + (_parentQty + wo_qtyrcv) * womatl_qtyper) * womatl_scrap)) THEN
                         (womatl_qtyfxd + (_parentQty + wo_qtyrcv) * womatl_qtyper) * womatl_scrap
		       ELSE 
		         womatl_qtywipscrap 
		      END) AS consumed,
		     (womatl_qtyfxd + ((_parentQty + wo_qtyrcv) * womatl_qtyper)) * (1 + womatl_scrap) AS expected
	      FROM womatl, wo, itemsite, item
	      WHERE ((womatl_issuemethod IN ('L', 'M'))
		AND  (womatl_wo_id=pWoid)
		AND  (womatl_wo_id=wo_id)
		AND  (womatl_itemsite_id=itemsite_id)
		AND  (itemsite_item_id=item_id)) LOOP
      -- Don't issue more than should have already been consumed at this point
      IF (pQty > 0) THEN
        IF (noNeg(_r.expected - _r.consumed) > 0) THEN
          SELECT issueWoMaterial(_r.womatl_id, noNeg(_r.expected - _r.consumed), _itemlocSeries, pGlDistTS) INTO _itemlocSeries;
        END IF;
      ELSE
        -- Used by postMiscProduction of disassembly
        SELECT returnWoMaterial(_r.womatl_id, (_r.expected * -1.0), _itemlocSeries, CURRENT_TIMESTAMP, true) INTO _itemlocSeries;
      END IF;

      UPDATE womatl
      SET womatl_issuemethod='L'
      WHERE ( (womatl_issuemethod='M')
       AND (womatl_id=_r.womatl_id) );

    END LOOP;
  END IF;

  SELECT CASE WHEN (pQty < 0 AND itemsite_costmethod='S') THEN stdcost(itemsite_item_id) * pQty
              WHEN (pQty < 0) THEN avgcost(itemsite_id) * pQty
              WHEN (wo_cosmethod = 'D') THEN wo_wipvalue
              ELSE  round((wo_wipvalue - (wo_postedvalue / wo_qtyord * (wo_qtyord -
                    CASE WHEN (wo_qtyord < wo_qtyrcv + pQty) THEN wo_qtyord
                         ELSE wo_qtyrcv + pQty
                    END ))),2)
         END INTO _wipPost
  FROM wo
    JOIN itemsite ON (wo_itemsite_id=itemsite_id)
  WHERE (wo_id=pWoid);

  SELECT postInvTrans( itemsite_id, 'RM', _parentQty,
                       'W/O', 'WO', _woNumber, '', ('Receive Inventory ' || item_number || ' ' || _sense || ' Manufacturing'),
                       costcat_asset_accnt_id, getPrjAccntId(wo_prj_id, costcat_wip_accnt_id), _itemlocSeries, pGlDistTS,
                       -- the following is only actually used when the item is average or job costed
                       _wipPost ) INTO _invhistid
  FROM wo, itemsite, item, costcat
  WHERE ( (wo_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (itemsite_costcat_id=costcat_id)
   AND (wo_id=pWoid) );

  IF (pQty < 0 ) THEN
    _wipPost := _wipPost * -1;
  END IF;
  
--  Increase this W/O's received qty decrease its WIP value
  UPDATE wo
  SET wo_qtyrcv = (wo_qtyrcv + _parentQty),
      wo_wipvalue = (wo_wipvalue - (CASE WHEN (itemsite_costmethod IN ('A','J'))
                                               THEN _wipPost
                                         WHEN (itemsite_costmethod='S')
                                               THEN (stdcost(itemsite_item_id) * _parentQty)
                                         ELSE 0.0  END))
  FROM itemsite, item
  WHERE ((wo_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (wo_id=pWoid));

--  ROB Increase this W/O's WIP value for custom costing
  SELECT SUM(itemcost_stdcost * _parentQty) INTO _ucost 
  FROM wo JOIN itemsite ON (itemsite_id=wo_itemsite_id)
          JOIN itemcost ON (itemcost_item_id=itemsite_item_id)
          JOIN costelem ON ((costelem_id=itemcost_costelem_id) AND
                            (costelem_exp_accnt_id IS NOT NULL) AND
                            (NOT costelem_sys))
  WHERE (wo_id=pWoid);

  UPDATE wo
  SET wo_wipvalue = (wo_wipvalue + coalesce(_ucost,0))
  WHERE (wo_id=pWoid);

--  ROB Distribute to G/L - create Cost Variance, debit WIP
  PERFORM insertGLTransaction( 'W/O', 'WO', _woNumber,
                               ('Post Other Cost ' || item_number || ' ' || _sense || ' Manufacturing'),
                               getPrjAccntId(wo_prj_id, costelem_exp_accnt_id), 
                               getPrjAccntId(wo_prj_id,costcat_wip_accnt_id), _invhistid,
			       (itemcost_stdcost * _parentQty),
                                pGlDistTS::DATE )
FROM wo, costelem, itemcost, costcat, itemsite, item
WHERE 
  ((wo_id=pWoid) AND
  (wo_itemsite_id=itemsite_id) AND
  (itemsite_item_id=item_id) AND
  (costelem_id = itemcost_costelem_id) AND
  (itemcost_item_id = itemsite_item_id) AND
  (itemsite_costcat_id = costcat_id) AND
  (costelem_exp_accnt_id) IS NOT NULL  AND 
  (costelem_sys = false));
--End


--  Make sure the W/O is at issue status
  UPDATE wo
  SET wo_status='I'
  WHERE (wo_id=pWoid);

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postProduction(INTEGER, NUMERIC, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE 'postProduction(INTEGER, NUMERIC, BOOLEAN, BOOLEAN) is deprecated. please use postProduction(INTEGER, NUMERIC, BOOLEAN, INTEGER, TIMESTAMP WITH TIME ZONE) instead';
  RETURN postProduction($1, $2, $3, 0, now());
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postProduction(INTEGER, NUMERIC, BOOLEAN, BOOLEAN, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE 'postProduction(INTEGER, NUMERIC, BOOLEAN, BOOLEAN, INTEGER) is deprecated. please use postProduction(INTEGER, NUMERIC, BOOLEAN, INTEGER, TIMESTAMP WITH TIME ZONE) instead';
  RETURN postProduction($1, $2, $3, $5, now());
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postProduction(INTEGER, NUMERIC, BOOLEAN, BOOLEAN, INTEGER, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE 'postProduction(INTEGER, NUMERIC, BOOLEAN, BOOLEAN, INTEGER, TEXT, TEXT) is deprecated. please use postProduction(INTEGER, NUMERIC, BOOLEAN, INTEGER, TIMESTAMP WITH TIME ZONE) instead';
  RETURN postProduction($1, $2, $3, $5, now());
END;
$$ LANGUAGE 'plpgsql';
