create or replace function xt.raise_exception(message text) returns void as $$
begin

  raise exception '%', message;
  
end;
$$ language 'plpgsql';
