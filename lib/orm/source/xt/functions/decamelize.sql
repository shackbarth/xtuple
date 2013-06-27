create or replace function xt.decamelize(str text) returns text immutable as $$
  return XT.decamelize(str);
$$ language plv8;