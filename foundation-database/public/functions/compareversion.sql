CREATE OR REPLACE FUNCTION public.compareversion(text, text DEFAULT split_part(version(), ' '::text, 2))
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- Returns 1 if the left version is greater than the right version
-- -1 if the right is greater than the left
--  0 if the versions are equal.
-- parameter two defaults to current server version
  RETURNS integer AS
$BODY$
DECLARE
  _leftVersion ALIAS FOR $1;
  _rightVersion ALIAS FOR $2;
  _leftMajor SMALLINT;
  _leftMinor SMALLINT;
  _leftPatch SMALLINT;
  _rightMajor SMALLINT;
  _rightMinor SMALLINT;
  _rightPatch SMALLINT;
  _returnCode SMALLINT;
  DEBUG BOOLEAN := false;
BEGIN

-- left
SELECT  substring(_leftVersion FROM $$(\d+)\.\d+\.\d+$$)::SMALLINT, 
	substring(_leftVersion FROM $$\d+\.(\d+)\.\d+$$)::SMALLINT, 
	substring(_leftVersion FROM $$\d+\.\d+\.(\d+)$$)::SMALLINT 
	INTO _leftMajor, _leftMinor, _leftPatch;

IF (DEBUG)
  THEN RAISE NOTICE 'Left Version --> % Major --> % Minor --> % Patch --> % ', _leftVersion, _leftMajor, _leftMinor, _leftPatch;
END IF;

-- right
SELECT  substring(_rightVersion FROM $$(\d+)\.\d+\.\d+$$)::SMALLINT, 
	substring(_rightVersion FROM $$\d+\.(\d+)\.\d+$$)::SMALLINT, 
	substring(_rightVersion FROM $$\d+\.\d+\.(\d+)$$)::SMALLINT 
	INTO _rightMajor, _rightMinor, _rightPatch;

IF (DEBUG)
 THEN RAISE NOTICE 'Right Version --> % Major --> % Minor --> % Patch --> % ', _rightVersion, _rightMajor, _rightMinor, _rightPatch;
END IF;

-- check major version
IF (_leftMajor > _rightMajor) THEN _returnCode := 1;
ELSIF (_leftMajor < _rightMajor) THEN _returnCode := -1;
ELSIF (_leftMajor = _rightMajor) THEN
  -- if major is equal, check minor version
  IF (_leftMinor > _rightMinor) THEN _returnCode := 1;
  ELSIF (_leftMinor < _rightMinor) THEN _returnCode := -1;
  ELSIF (_leftMinor = _rightMinor) THEN
    -- if major and minor are equal, check patch version
    IF (_leftPatch > _rightPatch) THEN _returnCode := 1;
    ELSIF (_leftPatch < _rightPatch) THEN _returnCode := -1;
    ELSIF (_leftPatch = _rightPatch) THEN _returnCode := 0;
    END IF;
  END IF;
-- if we somehow don't match those three operators it probably means someone passed in a version that wasn't in numerical major.minor.patch format
ELSE RAISE EXCEPTION 'One or more of the version parameters is invalid. Expected numerical Major.Minor.Patch version string. Left --> % Right --> %', _leftVersion, _rightVersion;
END IF;

RETURN _returnCode;

END;
$BODY$
  LANGUAGE plpgsql STABLE;
ALTER FUNCTION public.compareversion(text, text)
  OWNER TO admin;
