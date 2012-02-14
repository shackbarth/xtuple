CREATE OR REPLACE FUNCTION validate_user(uname TEXT, pass TEXT)
RETURNS BOOLEAN AS $$
DECLARE result BOOLEAN;
BEGIN

  -- for now users are assumed to be actual database users
  -- but in the future this will need to be adjusted to
  -- allow for some other password lookup as well as this one
  SELECT(passwd = 'md5' || md5($2 || $1)) INTO result
  FROM pg_shadow
  WHERE usename = $1;

  RETURN result;
END;
$$  LANGUAGE plpgsql
    SECURITY DEFINER
    -- does the search path really need to be set here
    -- to protect pg_temp?
