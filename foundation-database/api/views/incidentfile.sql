-- Incident File

SELECT dropifexists('VIEW', 'incidentfile','API'); 
CREATE VIEW api.incidentfile
AS 
   SELECT 
     incdt_number AS incident_number,
     url_title AS title,
     url_url AS url
   FROM incdt, url
   WHERE ((incdt_id=url_source_id)
   AND (url_source='INCDT'));

GRANT ALL ON TABLE api.incidentfile TO xtrole;
COMMENT ON VIEW api.incidentfile IS 'Incident File';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.incidentfile DO INSTEAD

  INSERT INTO url (
    url_source_id,
    url_source,
    url_title,
    url_url)
  VALUES (
    getIncidentId(NEW.incident_number),
    'INCDT',
    NEW.title,
    NEW.url);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.incidentfile DO INSTEAD

  UPDATE url SET
    url_title=NEW.title,
    url_url=NEW.url
  WHERE  ((url_source_id=getIncidentId(OLD.incident_number))
  AND (url_source='INCDT')
  AND (url_title=OLD.title)
  AND (url_url=OLD.url));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.incidentfile DO INSTEAD

  DELETE FROM url
  WHERE  ((url_source_id=getIncidentId(OLD.incident_number))
  AND (url_source='INCDT')
  AND (url_title=OLD.title)
  AND (url_url=OLD.url));
