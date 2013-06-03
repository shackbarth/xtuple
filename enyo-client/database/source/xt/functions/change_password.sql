drop function if exists xt.change_password(text, text);

create or replace function xt.change_password(username text, password text) returns boolean volatile as $$

  var escapedSql = XT.format('alter user "%I" with password %L', [username, password]);
  plv8.execute(escapedSql);

  return true;

$$ language plv8;
