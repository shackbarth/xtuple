
CREATE OR REPLACE FUNCTION postComment(pCmnttypename TEXT,
                                       pSource TEXT,
                                       pSourceid INTEGER,
                                       pText TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;

BEGIN
  SELECT cmnttype_id INTO _cmnttypeid
  FROM cmnttype
  WHERE (cmnttype_name=pCmnttypename);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Comment type % not found.', pCmnttypename;
  END IF;

  RETURN postComment(_cmnttypeid, pSource, pSourceid, pText, NULL);
END
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postComment(pCmnttypeid INTEGER,
                                       pSource TEXT,
                                       pSourceid INTEGER,
                                       pText TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN
  RETURN postComment(pCmnttypeid, pSource, pSourceid, pText, NULL);
END
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postComment(pCmnttypeid INTEGER,
                                       pSource TEXT,
                                       pSourceid INTEGER,
                                       pText TEXT,
                                       pPublic BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _commentid INTEGER;
  _public BOOLEAN;

BEGIN
  _public := COALESCE(pPublic, fetchmetricbool('CommentPublicDefault'));

  INSERT INTO comment
  ( comment_cmnttype_id, comment_source, comment_source_id,
    comment_date, comment_user, comment_text, comment_public )
  VALUES
  ( pCmnttypeid, pSource, pSourceid,
    CURRENT_TIMESTAMP, getEffectiveXtUser(), pText, _public )
  RETURNING comment_id INTO _commentid;

  RETURN _commentid;

END;
$$ LANGUAGE 'plpgsql';

