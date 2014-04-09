-- Account File 

SELECT dropifexists('VIEW', 'accountfile','API'); 
CREATE VIEW api.accountfile
AS 
   SELECT 
     crmacct_number AS account_number,
     url_title AS title,
     url_url AS url
   FROM crmacct, url
   WHERE ((crmacct_id=url_source_id)
   AND (url_source='CRMA'));

GRANT ALL ON TABLE api.accountfile TO xtrole;
COMMENT ON VIEW api.accountfile IS 'Account File';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.accountfile DO INSTEAD

  INSERT INTO url (
    url_source_id,
    url_source,
    url_title,
    url_url)
  VALUES (
    getCrmAcctId(NEW.account_number),
    'CRMA',
    NEW.title,
    NEW.url);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.accountfile DO INSTEAD

  UPDATE url SET
    url_title=NEW.title,
    url_url=NEW.url
  WHERE  ((url_source_id=getCrmAcctId(OLD.account_number))
  AND (url_source='CRMA')
  AND (url_title=OLD.title)
  AND (url_url=OLD.url));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.accountfile DO INSTEAD

  DELETE FROM url
  WHERE  ((url_source_id=getCrmAcctId(OLD.account_number))
  AND (url_source='CRMA')
  AND (url_title=OLD.title)
  AND (url_url=OLD.url));
