CREATE OR REPLACE FUNCTION copyproject(integer, text, text, date)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrjId ALIAS FOR $1;
  pPrjNumber ALIAS FOR $2;
  pPrjName ALIAS FOR $3;
  pDueDate ALIAS FOR $4;
  _prjid INTEGER;
  _offset INTEGER;

BEGIN

  IF (COALESCE(pPrjNumber, '') = '') THEN
    RETURN -1;
  END IF;

  IF (COALESCE(pPrjName, '') = '') THEN
    RETURN -1;
  END IF;

  IF (EXISTS(SELECT prj_id FROM prj WHERE UPPER(prj_number)=UPPER(pPrjNumber))) THEN
    RETURN -2;
  END IF;

  IF (NOT EXISTS(SELECT prj_id FROM prj WHERE prj_id=pPrjId)) THEN
    RETURN -3;
  END IF;

  IF (pDueDate IS NULL) THEN
    RETURN -4;
  END IF;

  SELECT (pDueDate - prj_due_date) INTO _offset
   FROM prj
   WHERE (prj_id=pPrjId);

  SELECT NEXTVAL('prj_prj_id_seq') INTO _prjid;

  INSERT INTO prj
  ( prj_id, prj_number, prj_name, 
    prj_descrip, prj_status, prj_prjtype_id,
    prj_so, prj_wo, prj_po,
    prj_owner_username, prj_start_date,
    prj_due_date, prj_assigned_date, prj_completed_date,
    prj_username, prj_recurring_prj_id,
    prj_crmacct_id, prj_cntct_id )
  SELECT _prjid, UPPER(pPrjNumber), pPrjName,
         prj_descrip, 'P', prj_prjtype_id,
         prj_so, prj_wo, prj_po,
         prj_owner_username, NULL,
         (prj_due_date + COALESCE(_offset, 0)),
         CASE WHEN (prj_username IS NULL) THEN NULL ELSE CURRENT_DATE END, NULL,
         prj_username, prj_recurring_prj_id,
         prj_crmacct_id, prj_cntct_id
  FROM prj
  WHERE (prj_id=pPrjId);

  INSERT INTO prjtask
  ( prjtask_number, prjtask_name, prjtask_descrip,
    prjtask_prj_id, prjtask_anyuser, prjtask_status,
    prjtask_hours_budget, prjtask_hours_actual,
    prjtask_exp_budget, prjtask_exp_actual,
    prjtask_owner_username, prjtask_start_date,
    prjtask_due_date, prjtask_assigned_date,
    prjtask_completed_date, prjtask_username )
  SELECT prjtask_number, prjtask_name, prjtask_descrip,
         _prjid, prjtask_anyuser, 'P',
         prjtask_hours_budget, 0.0,
         prjtask_exp_budget, 0.0,
         prjtask_owner_username, NULL,
         (prjtask_due_date + COALESCE(_offset, 0)),
         CASE WHEN (prjtask_username IS NULL) THEN NULL ELSE CURRENT_DATE END,
         NULL, prjtask_username
  FROM prjtask
  WHERE (prjtask_prj_id=pPrjId);

  INSERT INTO docass
  ( docass_source_id, docass_source_type,
    docass_target_id, docass_target_type,
    docass_purpose )
  SELECT _prjid, docass_source_type,
         docass_target_id, docass_target_type,
         docass_purpose
  FROM docass
  WHERE ((docass_source_id=pPrjId)
    AND  (docass_source_type='J'));

  RETURN _prjid;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION copyproject(integer, text, text, date)
  OWNER TO admin;

