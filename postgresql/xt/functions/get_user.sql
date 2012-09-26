create or replace function xt.get_user() returns text as $$

  return XT.user;
  
$$ language 'plv8' stable;

