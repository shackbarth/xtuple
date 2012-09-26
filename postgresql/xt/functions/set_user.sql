create or replace function xt.set_user(username text) returns bool as $$

  XT.user = username;
  return true;
  
$$ language 'plv8';
