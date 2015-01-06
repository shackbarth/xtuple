CREATE OR REPLACE FUNCTION xt.check_password(creds text) RETURNS boolean
    LANGUAGE plv8 IMMUTABLE SECURITY DEFINER
    AS $_$
      var parsedObj = JSON.parse(creds),
      username = parsedObj.username,
      password = parsedObj.password,
      rolePassword = null,
      encrypted = null,
      res = plv8.execute('select substring(rolpassword,4) as rolpassword from pg_authid where rolname = $1', [username]);

      if ( res && res.length > 0)
      {
        rolePassword = res[0]['rolpassword'];
      }
      else {
        return false;
      }
      res = plv8.execute( 'select md5($1 || $2)', [password, username]);
      if ( res && res.length > 0)
      {
        encrypted = res[0]['md5'];
        return encrypted == rolePassword;
      }
      else {
        return false;
      }
      return false;
$_$;