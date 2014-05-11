-- Contact Characteristic

SELECT dropIfExists('VIEW', 'contactchar', 'api');
CREATE VIEW api.contactchar
AS 
   SELECT 
     cntct_number AS contact_number,
     char_name::varchar AS characteristic,
     charass_value AS value
   FROM cntct, char, charass
   WHERE (('CNTCT'=charass_target_type)
   AND (cntct_id=charass_target_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.contactchar TO xtrole;
COMMENT ON VIEW api.contactchar IS 'Contact Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.contactchar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'CNTCT',
    getCntctId(NEW.contact_number),
    getCharId(NEW.characteristic,'CNTCT'),
    NEW.value,
    false);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.contactchar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value
  WHERE ((charass_target_type='CNTCT')
  AND (charass_target_id=getCntctId(OLD.contact_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'CNTCT')));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.contactchar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='CNTCT')
  AND (charass_target_id=getCntctId(OLD.contact_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'CNTCT')));
