CREATE OR REPLACE FUNCTION mergecrmaccts(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTargetId     ALIAS FOR $1;
  _purge        BOOLEAN := COALESCE($2, FALSE);

  _retval       INTEGER;
BEGIN

  /* if crmacctsel says the target should not keep its original
     notes, clear them.  notes are special because the merge allows
     concatenating them from multiple sources. this needs to be
     kept in sync with merge2crmaccts' similar check.
   */
  IF NOT (SELECT crmacctsel_mrg_crmacct_notes
            FROM crmacctsel
           WHERE crmacctsel_src_crmacct_id=crmacctsel_dest_crmacct_id
             AND crmacctsel_dest_crmacct_id=pTargetId) THEN
    IF (NOT _purge) THEN
      INSERT INTO mrgundo (
             mrgundo_schema,      mrgundo_table,
             mrgundo_pkey_col,    mrgundo_pkey_id,
             mrgundo_col,         mrgundo_value,      mrgundo_type,
             mrgundo_base_schema, mrgundo_base_table, mrgundo_base_id)
      SELECT 'public', 'crmacct', crmacct_id,
             'public', 'crmacct', 'crmacct_id', crmacct_id,
             'crmacct_notes', crmacct_notes, 'text',
             'public', 'crmacct', crmacct_id
        FROM crmacct
       WHERE (crmacct_id=pTargetId);
    END IF;

    UPDATE crmacct
       SET crmacct_notes = ''
     WHERE (crmacct_id=pTargetId);
  END IF;

  -- merge the data from the various source records
  SELECT SUM(merge2crmaccts(crmacctsel_src_crmacct_id, pTargetId, _purge))
         INTO _retval
    FROM crmacctsel
   WHERE ((crmacctsel_dest_crmacct_id=pTargetId)
      AND (crmacctsel_dest_crmacct_id!=crmacctsel_src_crmacct_id));

  DELETE FROM crmacctsel WHERE crmacctsel_dest_crmacct_id=pTargetId;

  RETURN COALESCE(_retval, 0);

END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION mergecrmaccts(INTEGER, BOOLEAN) IS
'This function uses the crmacctsel table to merge multiple crmacct records together. Only the merges into the specified target account are performed. Most of the work is done by repeated calls to the merge2crmaccts function. If the purge argument is FALSE, data are kept to allow reversing the merge.';
