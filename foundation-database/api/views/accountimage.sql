-- Account Image

SELECT dropifexists('VIEW', 'accountimage','API');
CREATE VIEW api.accountimage
AS 
   SELECT 
     crmacct_number AS account_number,
     image_name AS image_name
   FROM crmacct, imageass, image
   WHERE ((crmacct_id=imageass_source_id)
   AND (imageass_source='CRMA')
   AND (imageass_image_id=image_id));

GRANT ALL ON TABLE api.accountimage TO xtrole;
COMMENT ON VIEW api.accountimage IS 'Account Image';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.accountimage DO INSTEAD

  SELECT saveImageAss(
    'CRMA',
    getCrmAcctId(NEW.account_number),
    'M',
    getImageId(NEW.image_name));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.accountimage DO INSTEAD

  UPDATE imageass
  SET imageass_image_id=getImageId(NEW.image_name)
  WHERE ((imageass_source_id=getCrmAcctId(OLD.account_number))
  AND (imageass_source='CRMA')
  AND (imageass_image_id=getImageId(OLD.image_name)));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.accountimage DO INSTEAD

  DELETE FROM imageass
  WHERE ((imageass_source_id=getCrmAcctId(OLD.account_number))
  AND (imageass_source='CRMA')
  AND (imageass_image_id=getImageId(OLD.image_name)));
