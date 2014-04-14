-- Incident Image

SELECT dropifexists('VIEW', 'incidentimage','API');
CREATE VIEW api.incidentimage
AS 
   SELECT 
     incdt_number AS incident_number,
     image_name AS image_name
   FROM incdt, imageass, image
   WHERE ((incdt_id=imageass_source_id)
   AND (imageass_source='INCDT')
   AND (imageass_image_id=image_id));

GRANT ALL ON TABLE api.incidentimage TO xtrole;
COMMENT ON VIEW api.incidentimage IS 'Incident Image';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.incidentimage DO INSTEAD

  SELECT saveImageAss(
    'INCDT',
    getIncidentId(NEW.incident_number),
    'M',
    getImageId(NEW.image_name));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.incidentimage DO INSTEAD

  UPDATE imageass
  SET imageass_image_id=getImageId(NEW.image_name)
  WHERE ((imageass_source_id=getIncidentId(OLD.incident_number))
  AND (imageass_source='INCDT')
  AND (imageass_image_id=getImageId(OLD.image_name)));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.incidentimage DO INSTEAD

  DELETE FROM imageass
  WHERE ((imageass_source_id=getIncidentId(OLD.incident_number))
  AND (imageass_source='INCDT')
  AND (imageass_image_id=getImageId(OLD.image_name)));
