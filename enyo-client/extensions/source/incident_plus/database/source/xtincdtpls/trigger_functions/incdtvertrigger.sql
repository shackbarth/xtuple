
create or replace function xtincdtpls._incdtvertrigger() returns trigger AS $$
DECLARE
  _oldFoundIn TEXT := '';
  _oldFixedIn TEXT := '';
  _newFoundIn TEXT := '';
  _newFixedIn TEXT := '';
  _incdtid INTEGER;
BEGIN
  SELECT incdt_id
    INTO _incdtid
    FROM incdt
   WHERE(incdt_id=NEW.incdtver_incdt_id);
  IF(NOT FOUND OR _incdtid IS NULL) THEN
    RETURN NEW;
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    SELECT prjver_version
      INTO _oldFoundIn
      FROM xtincdtpls.prjver
     WHERE(prjver_id=OLD.incdtver_found_prjver_id);
    SELECT prjver_version
      INTO _oldFixedIn
      FROM xtincdtpls.prjver
     WHERE(prjver_id=OLD.incdtver_fixed_prjver_id);
    _oldFoundIn := COALESCE(_oldFoundIn, '');
    _oldFixedIn := COALESCE(_oldFixedIn, '');
  END IF;
  SELECT prjver_version
    INTO _newFoundIn
    FROM xtincdtpls.prjver
   WHERE(prjver_id=NEW.incdtver_found_prjver_id);
  SELECT prjver_version
    INTO _newFixedIn
    FROM xtincdtpls.prjver
   WHERE(prjver_id=NEW.incdtver_fixed_prjver_id);
  _newFoundIn := COALESCE(_newFoundIn, '');
  _newFixedIn := COALESCE(_newFixedIn, '');

  IF(_oldFoundIn <> _newFoundIn) THEN
    INSERT INTO incdthist (incdthist_incdt_id, incdthist_descrip)
    VALUES(_incdtid, 'Found In: '|| _oldFoundIn || ' -> ' || _newFoundIn);
  END IF;
  IF(_oldFixedIn <> _newFixedIn) THEN
    INSERT INTO incdthist (incdthist_incdt_id, incdthist_descrip)
    VALUES(_incdtid, 'Fixed In: '|| _oldFixedIn || ' -> ' || _newFixedIn);
  END IF;

  RETURN NEW;
END;
$$ language plpgsql;