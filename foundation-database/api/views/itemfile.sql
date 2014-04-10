-- Item File
 
SELECT dropIfExists('VIEW', 'itemfile', 'api'); 
CREATE VIEW api.itemfile
AS 
   SELECT 
     item_number::varchar AS item_number,
     url_title AS title,
     url_url AS url
   FROM item, url
   WHERE ((item_id=url_source_id)
   AND (url_source='I'));

GRANT ALL ON TABLE api.itemfile TO xtrole;
COMMENT ON VIEW api.itemfile IS 'Item File';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemfile DO INSTEAD

  INSERT INTO url (
    url_source_id,
    url_source,
    url_title,
    url_url)
  VALUES (
    getItemId(NEW.item_number),
    'I',
    NEW.title,
    NEW.url);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemfile DO INSTEAD

  UPDATE url SET
    url_title=NEW.title,
    url_url=NEW.url
  WHERE  ((url_source_id=getItemId(OLD.item_number))
  AND (url_source='I')
  AND (url_title=OLD.title)
  AND (url_url=OLD.url));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemfile DO INSTEAD

  DELETE FROM url
  WHERE  ((url_source_id=getItemId(OLD.item_number))
  AND (url_source='I')
  AND (url_title=OLD.title)
  AND (url_url=OLD.url));
