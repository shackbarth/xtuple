CREATE OR REPLACE FUNCTION copycmd(INTEGER, TEXT, TEXT) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmdId	ALIAS FOR $1;
  pModule	ALIAS FOR $2;
  pTitle	ALIAS FOR $3;
  _cmdId	INTEGER;
BEGIN
    SELECT nextval(''cmd_cmd_id_seq'') INTO _cmdId;

    INSERT INTO cmd 
      SELECT _cmdId, pModule, pTitle, cmd_descrip, cmd_privname, cmd_executable
      FROM cmd
      WHERE (cmd_id=pCmdId);

    INSERT INTO cmdarg (cmdarg_cmd_id, cmdarg_order, cmdarg_arg)
      SELECT _cmdId, cmdarg_order, cmdarg_arg
      FROM cmdarg
      WHERE (cmdarg_cmd_id=pCmdId);

    RETURN 1;
END;
' LANGUAGE 'plpgsql';
