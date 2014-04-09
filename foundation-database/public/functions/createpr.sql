CREATE OR REPLACE FUNCTION createPr(INTEGER, INTEGER, NUMERIC, DATE, TEXT, CHARACTER(1), INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOrderNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQty ALIAS FOR $3;
  pDueDate ALIAS FOR $4;
  pNotes ALIAS FOR $5;
  pOrderType ALIAS FOR $6;
  pOrderId ALIAS FOR $7;
  _prid INTEGER;

BEGIN

  SELECT NEXTVAL('pr_pr_id_seq') INTO _prid;
  INSERT INTO pr
  ( pr_id, pr_number, pr_subnumber, pr_status,
    pr_order_type, pr_order_id,
    pr_itemsite_id, pr_qtyreq, pr_duedate, pr_releasenote )
  VALUES
  ( _prid, pOrderNumber, nextPrSubnumber(pOrderNumber), 'O',
    pOrderType, pOrderId,
    pItemsiteid, pQty, pDuedate, pNotes );

  RETURN _prid;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createPr(INTEGER, INTEGER, NUMERIC, DATE, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOrderNumber ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  pQty ALIAS FOR $3;
  pDueDate ALIAS FOR $4;
  pNotes ALIAS FOR $5;
  _prid INTEGER;

BEGIN

  SELECT NEXTVAL('pr_pr_id_seq') INTO _prid;
  INSERT INTO pr
  ( pr_id, pr_number, pr_subnumber, pr_status,
    pr_order_type, pr_order_id,
    pr_itemsite_id, pr_qtyreq, pr_duedate, pr_releasenote )
  VALUES
  ( _prid, pOrderNumber, nextPrSubnumber(pOrderNumber), 'O',
    'M', -1,
    pItemsiteid, pQty, pDuedate, pNotes);

  RETURN _prid;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createPr(INTEGER, CHAR, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOrderNumber ALIAS FOR $1;
  pParentType ALIAS FOR $2;
  pParentId ALIAS FOR $3;
  _parent RECORD;
  _prid INTEGER;
  _orderNumber INTEGER;

BEGIN

  IF (pOrderNumber = -1) THEN
    SELECT fetchPrNumber() INTO _orderNumber;
  ELSE
    _orderNumber := pOrderNumber;
  END IF;

  IF (pParentType = 'W') THEN
    SELECT womatl_itemsite_id AS itemsiteid,
           itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq) AS qty,
           womatl_duedate AS duedate, wo_prj_id AS prjid,
           womatl_notes AS notes INTO _parent
    FROM wo, womatl, itemsite
    WHERE ((womatl_wo_id=wo_id)
     AND (womatl_itemsite_id=itemsite_id)
     AND (womatl_id=pParentId));

  ELSIF (pParentType = 'S') THEN
    SELECT coitem_itemsite_id AS itemsiteid,
           (coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned) AS qty,
           coitem_scheddate AS duedate, cohead_prj_id AS prjid,
           coitem_memo AS notes INTO _parent
    FROM coitem, cohead
    WHERE ((cohead_id=coitem_cohead_id)
     AND (coitem_id=pParentId));

  ELSIF (pParentType = 'F') THEN
    SELECT planord_itemsite_id AS itemsiteid,
           planord_qty AS qty,
           planord_duedate AS duedate, NULL::INTEGER AS prjid,
           planord_comments AS notes INTO _parent
    FROM planord
    WHERE (planord_id=pParentId);

  ELSE
    RETURN -2;
  END IF;

  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT NEXTVAL('pr_pr_id_seq') INTO _prid;
  INSERT INTO pr
  ( pr_id, pr_number, pr_subnumber, pr_status,
    pr_order_type, pr_order_id, pr_prj_id,
    pr_itemsite_id, pr_qtyreq,
    pr_duedate, pr_releasenote )
  VALUES
  ( _prid, _orderNumber, nextPrSubnumber(_orderNumber), 'O',
    pParentType, pParentId, _parent.prjid,
    _parent.itemsiteid, validateOrderQty(_parent.itemsiteid, _parent.qty, TRUE),
    _parent.duedate, _parent.notes );

  RETURN _prid;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createPr(CHAR, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pParentType ALIAS FOR $1;
  pParentId ALIAS FOR $2;
  _orderNumber INTEGER;
  _prid INTEGER;

BEGIN

  IF (pParentType = 'W') THEN
    SELECT wo_number INTO _orderNumber
    FROM wo, womatl
    WHERE ((womatl_wo_id=wo_id)
     AND (womatl_id=pParentId));

  ELSIF (pParentType = 'S') THEN
    SELECT CAST(cohead_number AS INTEGER) INTO _orderNumber
    FROM cohead, coitem
    WHERE ((coitem_cohead_id=cohead_id)
     AND (coitem_id=pParentId));

  ELSIF (pParentType = 'F') THEN
    SELECT fetchPrNumber() INTO _orderNumber;

  ELSE
    RETURN -2;
  END IF;

  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT createPr(_orderNumber, pParentType, pParentId) INTO _prid;

  RETURN _prid;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createpr(INTEGER, CHARACTER, INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOrderNumber ALIAS FOR $1;
  pParentType ALIAS FOR $2;
  pParentId ALIAS FOR $3;
  pParentNotes ALIAS FOR $4;
  _parent RECORD;
  _prid INTEGER;
  _orderNumber INTEGER;

BEGIN

  IF (pOrderNumber = -1) THEN
    SELECT fetchPrNumber() INTO _orderNumber;
  ELSE
    _orderNumber := pOrderNumber;
  END IF;

  IF (pParentType = 'W') THEN
    SELECT womatl_itemsite_id AS itemsiteid,
           itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq) AS qty,
           womatl_duedate AS duedate, wo_prj_id AS prjid INTO _parent
    FROM wo, womatl, itemsite
    WHERE ((womatl_wo_id=wo_id)
     AND (womatl_itemsite_id=itemsite_id)
     AND (womatl_id=pParentId));

  ELSIF (pParentType = 'S') THEN
    SELECT coitem_itemsite_id AS itemsiteid,
           (coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned) AS qty,
           coitem_scheddate AS duedate, cohead_prj_id AS prjid INTO _parent
    FROM coitem, cohead
    WHERE ((cohead_id=coitem_cohead_id)
     AND (coitem_id=pParentId));

  ELSIF (pParentType = 'F') THEN
    SELECT planord_itemsite_id AS itemsiteid,
           planord_qty AS qty,
           planord_duedate AS duedate, NULL::INTEGER AS prjid 
           INTO _parent
    FROM planord
    WHERE (planord_id=pParentId);

  ELSE
    RETURN -2;
  END IF;

  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT NEXTVAL('pr_pr_id_seq') INTO _prid;
  INSERT INTO pr
  ( pr_id, pr_number, pr_subnumber, pr_status,
    pr_order_type, pr_order_id, pr_prj_id,
    pr_itemsite_id, pr_qtyreq, pr_duedate, pr_releasenote )
  VALUES
  ( _prid, _orderNumber, nextPrSubnumber(_orderNumber), 'O',
    pParentType, pParentId, _parent.prjid,
    _parent.itemsiteid, validateOrderQty(_parent.itemsiteid, _parent.qty, TRUE),
    _parent.duedate, pParentNotes );

  RETURN _prid;

END;
$$ LANGUAGE 'plpgsql';
