-- Account Characteristic

SELECT dropIfExists('VIEW', 'accountchar', 'api');
CREATE VIEW api.accountchar
AS 
   SELECT 
     crmacct_number::varchar AS account_number,
     char_name::varchar AS characteristic,
     charass_value AS value
   FROM crmacct, char, charass
   WHERE (('CRMACCT'=charass_target_type)
   AND (crmacct_id=charass_target_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.accountchar TO xtrole;
COMMENT ON VIEW api.accountchar IS 'Account Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.accountchar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'CRMACCT',
    getCrmAcctId(NEW.account_number),
    getCharId(NEW.characteristic,'CRMACCT'),
    NEW.value,
    false);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.accountchar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value
  WHERE ((charass_target_type='CRMACCT')
  AND (charass_target_id=getCrmAcctId(OLD.account_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'CRMACCT')));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.accountchar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='CRMACCT')
  AND (charass_target_id=getCrmAcctId(OLD.account_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'CRMACCT')));
