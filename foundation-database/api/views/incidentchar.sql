-- Incident	 Characteristic

SELECT dropIfExists('VIEW', 'incidentchar', 'api');
CREATE VIEW api.incidentchar
AS 
   SELECT 
     incdt_number AS incident_number,
     char_name::varchar AS characteristic,
     charass_value AS value
   FROM incdt, char, charass
   WHERE (('INCDT'=charass_target_type)
   AND (incdt_id=charass_target_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.incidentchar TO xtrole;
COMMENT ON VIEW api.incidentchar IS 'Incident Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.incidentchar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'INCDT',
    getIncidentId(NEW.incident_number),
    getCharId(NEW.characteristic,'INCDT'),
    NEW.value,
    false);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.incidentchar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value
  WHERE ((charass_target_type='INCDT')
  AND (charass_target_id=getIncidentId(OLD.incident_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'INCDT')));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.incidentchar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='INCDT')
  AND (charass_target_id=getIncidentId(OLD.incident_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'INCDT')));
