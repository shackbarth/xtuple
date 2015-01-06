drop function if exists xt.change_password(text);

create or replace function xt.change_password(creds text) returns boolean volatile as $$
  var parsedObj = JSON.parse(creds),
    username = parsedObj.username,
    password = parsedObj.password,
    escapedSql = XT.format('alter user %I with password %L', [username, password]);
  
  plv8.execute(escapedSql);

  return true;

$$ language plv8;
