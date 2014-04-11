-- Site Zone (aka Warehouse Zone) View

SELECT dropIfExists('VIEW', 'sitezone', 'api');
CREATE OR REPLACE VIEW api.sitezone AS
  SELECT 
    warehous_code::VARCHAR AS site,
    whsezone_name::VARCHAR AS name,
    whsezone_descrip AS description
    FROM whsezone
       LEFT OUTER JOIN whsinfo ON (warehous_id=whsezone_warehous_id);

GRANT ALL ON TABLE api.sitezone TO xtrole;
COMMENT ON VIEW api.sitezone IS 'Site Zone';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.sitezone DO INSTEAD

  INSERT INTO whsezone (
    whsezone_warehous_id,
    whsezone_name,
    whsezone_descrip
    )
  VALUES (
    getWarehousId(NEW.site, 'ACTIVE'),
    COALESCE(NEW.name,''),
    COALESCE(NEW.description, '')
    );

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.sitezone DO INSTEAD

  UPDATE whsezone SET
    whsezone_descrip=NEW.description
  WHERE ( (whsezone_warehous_id=getWarehousId(OLD.site, 'ACTIVE')) AND
          (whsezone_name=OLD.name) );
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.sitezone DO INSTEAD

  DELETE FROM whsezone
  WHERE ( (whsezone_warehous_id=getWarehousId(OLD.site, 'ACTIVE')) AND
          (whsezone_name=OLD.name) );
