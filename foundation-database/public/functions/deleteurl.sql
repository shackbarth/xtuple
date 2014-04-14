create or replace function deleteUrl(integer) returns boolean as $$
declare
  pId ALIAS FOR $1;
begin
  delete from urlinfo
  where ( url_id in (
    select url_id
    from urlinfo
      join docass on (docass_target_id=url_id)
                 and (docass_target_type='URL')
      where ( docass_id = pId ) ) );

  delete from docass where docass_id = pId;

  return true;
end;
$$ language 'plpgsql';
