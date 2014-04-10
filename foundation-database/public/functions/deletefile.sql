create or replace function deleteFile(integer) returns boolean as $$
declare
  pId ALIAS FOR $1;
begin
  delete from file
  where ( file_id in (
    select file_id
    from file
      join docass on (docass_target_id=file_id)
                 and (docass_target_type='FILE')
    where ( docass_id = pId ) ) );

  delete from docass where docass_id = pId;

  return true;
end;
$$ language 'plpgsql';
