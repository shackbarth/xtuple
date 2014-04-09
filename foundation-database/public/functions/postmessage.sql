
CREATE OR REPLACE FUNCTION postMessage(TIMESTAMP, TIMESTAMP, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pScheduled ALIAS FOR $1;
  pExpires ALIAS FOR $2;
  pUsername ALIAS FOR $3;
  pText ALIAS FOR $4;
  _msgid INTEGER;

BEGIN

  SELECT NEXTVAL('msg_msg_id_seq') INTO _msgid;
  INSERT INTO msg
  (msg_id, msg_posted, msg_scheduled, msg_expires, msg_username, msg_text)
  VALUES
  (_msgid, CURRENT_TIMESTAMP, pScheduled, pExpires, getEffectiveXtUser(), pText);

  INSERT INTO msguser
  ( msguser_msg_id, msguser_username )
  VALUES
  ( _msgid, pUsername );

  NOTIFY "messagePosted";

  RETURN _msgid;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postMessage(TIMESTAMP, TIMESTAMP, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pScheduled ALIAS FOR $1;
  pExpires ALIAS FOR $2;
  pText ALIAS FOR $3;
  _msgid INTEGER;

BEGIN

  SELECT NEXTVAL('msg_msg_id_seq') INTO _msgid;
  INSERT INTO msg
  (msg_id, msg_posted, msg_scheduled, msg_expires, msg_username, msg_text)
  VALUES
  (_msgid, CURRENT_TIMESTAMP, pScheduled, pExpires, getEffectiveXtUser(), pText);

  INSERT INTO msguser
  ( msguser_msg_id, msguser_username )
  SELECT _msgid, usr_username
  FROM usr
  WHERE (usr_username <> getEffectiveXtUser());

  NOTIFY "messagePosted";

  RETURN _msgid;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION postMessage(TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pText ALIAS FOR $2;
  _msgid INTEGER;

BEGIN

  SELECT NEXTVAL('msg_msg_id_seq') INTO _msgid;
  INSERT INTO msg
  (msg_id, msg_posted, msg_scheduled, msg_expires, msg_username, msg_text)
  VALUES
  (_msgid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, endOfTime(), getEffectiveXtUser(), pText);

  INSERT INTO msguser
  ( msguser_msg_id, msguser_username )
  VALUES
  ( _msgid, pUsername );

  NOTIFY "messagePosted";

  RETURN _msgid;

END;
$$ LANGUAGE 'plpgsql';

