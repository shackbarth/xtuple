create or replace function createFile(text, text, bytea) returns integer as $$
declare
  pTitle ALIAS FOR $1;
  pDescription ALIAS FOR $2;
  pStream ALIAS FOR $3;
  _id integer;
begin
  _id := nextval('file_file_id_seq');
  insert into file (file_id, file_title, file_descrip, file_stream) values (_id, pTitle, pDescription, pStream);
  return _id;
end;
$$ language 'plpgsql';
