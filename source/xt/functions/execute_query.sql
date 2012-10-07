create or replace function xt.execute_query(query text) returns boolean volatile as $$
begin

  execute query;

  return true;
  
end;
$$ language 'plpgsql';
