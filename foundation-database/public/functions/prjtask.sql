CREATE OR REPLACE FUNCTION prjtask() RETURNS SETOF prjtask AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _row prjtask%ROWTYPE;
  _priv TEXT;
  _grant BOOLEAN;

BEGIN
  -- This query will give us the most permissive privilege the user has been granted
  SELECT privilege, granted INTO _priv, _grant
  FROM privgranted 
  WHERE privilege IN ('MaintainAllProjects','ViewAllProjects','MaintainPersonalProjects','ViewPersonalProjects')
  ORDER BY granted DESC, sequence
  LIMIT 1;

  -- If have an 'All' privilege return all results
  IF (_priv ~ 'All' AND _grant) THEN
    FOR _row IN 
      SELECT * FROM prjtask
    LOOP
      RETURN NEXT _row;
    END LOOP;
  -- Otherwise if have any other grant, must be personal privilege.
  ELSIF (_grant) THEN
    FOR _row IN 
      SELECT prjtask.* FROM prjtask
      JOIN prj ON prj_id=prjtask_prj_id
      WHERE getEffectiveXtUser() IN (prjtask_owner_username,prjtask_username,prj_username,prj_owner_username)
    LOOP
      RETURN NEXT _row;
    END LOOP;
  END IF;

  RETURN;

END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION prjtask() IS 'A table function that returns Project results according to privilege settings.';
