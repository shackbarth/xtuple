create or replace function xt.is_date(text) returns boolean immutable as $$ 
begin 
  perform coalesce($1,'')::date; 
  return true; 
  exception when others then 
    return false; 
end; 
$$ language plpgsql; 
