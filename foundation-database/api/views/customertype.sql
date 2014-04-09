  --Customer Type View

  SELECT dropIfExists('VIEW', 'customertype', 'api');
  CREATE OR REPLACE VIEW api.customertype AS

  SELECT
    custtype_code::varchar AS code,
    custtype_descrip AS description,
    custtype_char AS enable_characteristics_profile
  FROM custtype
  ORDER BY custtype_code;

GRANT ALL ON TABLE api.customertype TO xtrole;
COMMENT ON VIEW api.customertype IS 'Customer Type';

  --Rules

  CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.customertype DO INSTEAD

  INSERT INTO custtype (
    custtype_code,
    custtype_descrip,
    custtype_char)
  VALUES (
    NEW.code,
    COALESCE(NEW.description,''),
    COALESCE(NEW.enable_characteristics_profile,FALSE));
 
  CREATE OR REPLACE RULE "_UPDATE" AS
  ON UPDATE TO api.customertype DO INSTEAD

  UPDATE custtype SET
    custtype_code=NEW.code,
    custtype_descrip=NEW.description,
    custtype_char=NEW.enable_characteristics_profile
  WHERE (custtype_code=OLD.code);

  CREATE OR REPLACE RULE "_DELETE" AS
  ON DELETE TO api.customertype DO INSTEAD

  DELETE FROM custtype WHERE (custtype_code=OLD.code);
