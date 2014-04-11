-- Customer Characteristic

SELECT dropIfExists('VIEW', 'custchar', 'api');
CREATE VIEW api.custchar
AS 
   SELECT 
     cust_number::varchar AS customer_number,
     char_name::varchar AS characteristic,
     charass_value AS value
   FROM custinfo, char, charass
   WHERE (('C'=charass_target_type)
   AND (cust_id=charass_target_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.custchar TO xtrole;
COMMENT ON VIEW api.custchar IS 'Customer Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.custchar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'C',
    getCustId(NEW.customer_number),
    getCharId(NEW.characteristic,'C'),
    NEW.value,
    false);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.custchar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value
  WHERE ((charass_target_type='C')
  AND (charass_target_id=getCustId(OLD.customer_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'C')));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.custchar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='C')
  AND (charass_target_id=getCustId(OLD.customer_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'C')));
