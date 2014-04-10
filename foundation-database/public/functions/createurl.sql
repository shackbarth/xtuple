create or replace function createUrl(text, text) returns integer as $$
declare
  pTitle ALIAS FOR $1;
  pUrl ALIAS FOR $2;
  _id integer;
begin
  _id := nextval('urlinfo_url_id_seq');
  insert into urlinfo (url_id, url_title, url_url) values (_id, pTitle, pUrl);
  return _id;
end;
$$ language 'plpgsql';
