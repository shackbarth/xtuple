CREATE OR REPLACE FUNCTION maintainBOMWorkspace() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _test TEXT;

BEGIN

  SELECT tablename INTO _test
  FROM pg_tables
  WHERE (tablename=''bomwork'');
  IF (NOT FOUND) THEN
    CREATE TEMPORARY TABLE bomwork
    ( bomwork_id INTEGER, bomwork_set_id INTEGER, bomwork_parent_id INTEGER,
      bomwork_seqnumber INTEGER, bomwork_parent_seqnumber INTEGER,
      bomwork_item_id INTEGER, bomwork_item_type CHARACTER(1), bomwork_status CHARACTER(1),
      bomwork_qtyper NUMERIC(20, 8), bomwork_scrap NUMERIC(20, 10),
      bomwork_level INTEGER, bomwork_effective DATE, bomwork_expires DATE,
      bomwork_stdunitcost NUMERIC(16, 4), bomwork_actunitcost NUMERIC(16, 4),
      bomwork_createwo BOOLEAN, bomwork_issuemethod CHARACTER(1) );
    CREATE INDEX bomwork_set_id_idx ON bomwork(bomwork_set_id);
  END IF;

  RETURN 1;

END;
' LANGUAGE 'plpgsql';
