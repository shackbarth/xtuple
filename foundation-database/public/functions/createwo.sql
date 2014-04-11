CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, INTEGER, NUMERIC, INTEGER, DATE, TEXT, CHAR, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pLeadTime ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pProductionNotes ALIAS FOR $7;
  pParentType ALIAS FOR $8;
  pParentId ALIAS FOR $9;

BEGIN
  RETURN createWo(pWoNumber, pItemsiteid, pPriority, pQtyOrdered,
                  (pDueDate - pLeadTime), pDueDate, pProductionNotes,
                  pParentType, pParentId, -1);
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, INTEGER, NUMERIC, INTEGER, DATE, TEXT, CHAR, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pLeadTime ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pProductionNotes ALIAS FOR $7;
  pParentType ALIAS FOR $8;
  pParentId ALIAS FOR $9;
  pProjectId ALIAS FOR $10;

BEGIN
  RETURN createWo(pWoNumber, pItemsiteid, pPriority, pQtyOrdered,
                  (pDueDate - pLeadTime), pDueDate, pProductionNotes,
                  pParentType, pParentId, pProjectId);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, INTEGER, NUMERIC, INTEGER, DATE, TEXT, CHAR, INTEGER, INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pLeadTime ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pProductionNotes ALIAS FOR $7;
  pParentType ALIAS FOR $8;
  pParentId ALIAS FOR $9;
  pProjectId ALIAS FOR $10;
  pBomRevId ALIAS FOR $11;
  pBooRevId ALIAS FOR $12;

BEGIN
  RETURN createWo(pWoNumber, pItemsiteid, pPriority, pQtyOrdered,
                  (pDueDate - pLeadTime), pDueDate, pProductionNotes,
                  pParentType, pParentId, pProjectId, pBomRevId, pBooRevId, NULL);
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE, TEXT, CHAR, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pProductionNotes ALIAS FOR $7;
  pParentType ALIAS FOR $8;
  pParentId ALIAS FOR $9;
  pProjectId ALIAS FOR $10;
  _woid INTEGER;
  _result INTEGER;
  _parentType char(1);
  _bomrevid INTEGER;
  _boorevid INTEGER;

BEGIN

  SELECT getActiveRevId('BOM',itemsite_item_id) INTO _bomrevid
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid);

  SELECT getActiveRevId('BOO',itemsite_item_id) INTO _boorevid
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid);
  
  RETURN createWo(pWoNumber, pItemsiteid, pPriority, pQtyOrdered,
                  pStartDate, pDueDate, pProductionNotes,
                  pParentType, pParentId, pProjectId, _bomrevid, _boorevid, NULL);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE, TEXT, CHAR, INTEGER, INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pProductionNotes ALIAS FOR $7;
  pParentType ALIAS FOR $8;
  pParentId ALIAS FOR $9;
  pProjectId ALIAS FOR $10;
  pBomRevId ALIAS FOR $11;
  pBooRevId ALIAS FOR $12;
BEGIN
  RETURN createWo(pWoNumber, pItemsiteid, pPriority, pQtyOrdered,
                  pStartDate, pDueDate, pProductionNotes,
                  pParentType, pParentId, pProjectId, pBomRevId, pBooRevId, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE, TEXT, CHAR, INTEGER, INTEGER, INTEGER, INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pPriority ALIAS FOR $3;
  pQtyOrdered ALIAS FOR $4;
  pStartDate ALIAS FOR $5;
  pDueDate ALIAS FOR $6;
  pProductionNotes ALIAS FOR $7;
  pParentType ALIAS FOR $8;
  pParentId ALIAS FOR $9;
  pProjectId ALIAS FOR $10;
  pBomRevId ALIAS FOR $11;
  pBooRevId ALIAS FOR $12;
  pCosMethod ALIAS FOR $13;
  _startDate DATE;
  _woid INTEGER;
  _result INTEGER;
  _parentType char(1);
  _parentId INTEGER;
  _cosmethod char(1);
  _itemsite RECORD;
  
BEGIN
  
  _parentType := COALESCE(pParentType, ' ');
  _parentId   := COALESCE(pParentId, -1);

  SELECT * INTO _itemsite FROM itemsite WHERE itemsite_id = pItemsiteid;

--  Check to make sure the itemsite specified is supplied at itemsite
  IF (NOT _itemsite.itemsite_wosupply) THEN
    RETURN -1;
  END IF;

--  Check to make sure if this is a job item that it is tied to a sales order
--  Or if it is just an avarage costed item
  IF (pCosMethod IN ('D', 'P')) THEN
    _cosmethod := pCosMethod;
  ELSE
    IF (_itemsite.itemsite_costmethod = 'J') THEN
      IF (_parentType = ' ' OR _parentId = -1) THEN
        RAISE EXCEPTION 'Work Orders for Item Sites that are Job cost must have a parent order.';
      ELSE
        SELECT COALESCE(itemsite_cosdefault,fetchmetrictext('JobItemCosDefault'),'D') INTO _cosmethod FROM itemsite WHERE itemsite_id=pItemsiteid;
      END IF;
    ELSIF (_itemsite.itemsite_costmethod = 'A') THEN
      _cosmethod := COALESCE(_itemsite.itemsite_cosdefault,fetchmetrictext('JobItemCosDefault'),'D');
    END IF;
  END IF;

--  Check to see if the site calendar metric is set, and if so adjust the start date if necessary
  IF (fetchmetricbool('UseSiteCalendar')) THEN
    _startDate := calculatenextworkingdate(_itemsite.itemsite_warehous_id, pStartDate, 0);
    IF (_startDate != pStartDate) THEN
      _startDate := calculatenextworkingdate(_itemsite.itemsite_warehous_id, pDueDate, -_itemsite.itemsite_leadtime);
    END IF;
  ELSE
    _startDate := pStartDate;
  END IF;
  
--  Grab the next wo_id
  SELECT NEXTVAL('wo_wo_id_seq') INTO _woid;

--  Create the W/O
  INSERT INTO wo
  ( wo_id, wo_number, wo_subnumber, wo_itemsite_id,
    wo_priority, wo_ordtype, wo_ordid,
    wo_status, wo_startdate, wo_duedate,
    wo_qtyord, wo_qtyrcv, wo_prodnotes, wo_prj_id,
    wo_bom_rev_id, wo_boo_rev_id, wo_cosmethod )
  SELECT _woid, pWoNumber, nextWoSubnumber(pWoNumber), itemsite_id,
         pPriority, _parentType, pParentId,
         'O', _startDate, pDueDate,
         roundQty(item_fractional, pQtyOrdered), 0, pProductionNotes, pProjectId, 
         pBomRevid, pBooRevid, _cosmethod
  FROM itemsite, item
  WHERE ((itemsite_item_id=item_id)
   AND (itemsite_id=pItemsiteid));

--  Explode the newly created W/O according to metrics
  IF ( ( SELECT (metric_value='t')
         FROM metric
         WHERE (metric_name='AutoExplodeWO') ) ) THEN
    SELECT explodeWo( _woid, ( SELECT (metric_value = 'M')
                               FROM metric
                               WHERE (metric_name='WOExplosionLevel') ) ) INTO _result;
  ELSE
    _result := _woid;
  END IF;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, NUMERIC, INTEGER, DATE, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQtyOrdered ALIAS FOR $3;
  pLeadTime ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  pProductionNotes ALIAS FOR $6;

BEGIN
  RETURN createWo( pWoNumber, pItemsiteid, 1, pQtyOrdered,
                   (pDueDate - pLeadTime), pDueDate,
                   pProductionNotes, NULL, NULL, -1 ); 
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, NUMERIC, INTEGER, DATE, TEXT, CHAR, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQtyOrdered ALIAS FOR $3;
  pLeadTime ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  pProductionNotes ALIAS FOR $6;
  pParentType ALIAS FOR $7;
  pParentId ALIAS FOR $8;

BEGIN
  RETURN createWo( pWoNumber, pItemsiteid, 1, pQtyOrdered,
                   (pDueDate - pLeadTime), pDueDate,
                   pProductionNotes, pParentType, pParentId, -1 ); 
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createWo(INTEGER, INTEGER, NUMERIC, DATE, DATE, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQtyOrdered ALIAS FOR $3;
  pStartDate ALIAS FOR $4;
  pDueDate ALIAS FOR $5;
  pProductionNotes ALIAS FOR $6;

BEGIN
  RETURN createWo( pWoNumber, pItemsiteid, 1, pQtyOrdered,
                   pStartDate, pDueDate, pProductionNotes, NULL, NULL, -1);
END;
$$ LANGUAGE 'plpgsql';
