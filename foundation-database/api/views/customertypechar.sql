-- Customer Type Characteristic

SELECT dropIfExists('VIEW', 'customertypechar', 'api');
CREATE VIEW api.customertypechar
AS 
   SELECT 
     custtype_code::varchar AS customer_type,
     char_name::varchar AS characteristic,
     charass_value AS value,
     charass_default AS is_default
   FROM custtype, char, charass
   WHERE (('CT'=charass_target_type)
   AND (custtype_id=charass_target_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.customertypechar TO xtrole;
COMMENT ON VIEW api.customertypechar IS 'Customer Type Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.customertypechar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'CT',
    getCusttypeId(NEW.customer_type),
    getCharId(NEW.characteristic,'CT'),
    NEW.value,
    COALESCE(NEW.is_default,false));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.customertypechar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value,
    charass_default=NEW.is_default
  WHERE ((charass_target_type='CT')
  AND (charass_target_id=getCusttypeId(OLD.customer_type))
  AND (charass_char_id=getCharId(OLD.characteristic,'CT')));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.customertypechar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='CT')
  AND (charass_target_id=getCusttypeId(OLD.customer_type))
  AND (charass_char_id=getCharId(OLD.characteristic,'CT')));
