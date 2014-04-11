--Vendor Type View

SELECT dropIfExists('VIEW', 'vendortype', 'api');
CREATE OR REPLACE VIEW api.vendortype AS

SELECT
  vendtype_code::VARCHAR AS code,
  vendtype_descrip AS description
FROM vendtype
ORDER BY vendtype_code;

GRANT ALL ON TABLE api.vendortype TO xtrole;
COMMENT ON VIEW api.vendortype IS 'Vendor Type';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.vendortype DO INSTEAD

INSERT INTO vendtype (
  vendtype_code,
  vendtype_descrip )
VALUES (
  NEW.code,
  COALESCE(NEW.description,'') );
 
CREATE OR REPLACE RULE "_UPDATE" AS
ON UPDATE TO api.vendortype DO INSTEAD

UPDATE vendtype SET
  vendtype_code=NEW.code,
  vendtype_descrip=NEW.description
  WHERE (vendtype_code=OLD.code);

CREATE OR REPLACE RULE "_DELETE" AS
ON DELETE TO api.vendortype DO INSTEAD

SELECT deleteVendorType(getVendTypeId(OLD.code));
