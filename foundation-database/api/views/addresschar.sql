-- Address Characteristic

SELECT dropIfExists('VIEW', 'addresschar', 'api');
CREATE VIEW api.addresschar
AS 
   SELECT 
     addr_number::varchar AS address_number,
     char_name::varchar AS characteristic,
     charass_value AS value
   FROM addr, char, charass
   WHERE (('ADDR'=charass_target_type)
   AND (addr_id=charass_target_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.addresschar TO xtrole;
COMMENT ON VIEW api.addresschar IS 'Address Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.addresschar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'ADDR',
    getAddrId(NEW.address_number),
    getCharId(NEW.characteristic,'ADDR'),
    NEW.value,
    false);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.addresschar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value
  WHERE ((charass_target_type='ADDR')
  AND (charass_target_id=getAddrId(OLD.address_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'ADDR')));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.addresschar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='ADDR')
  AND (charass_target_id=getAddrId(OLD.address_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'ADDR')));
