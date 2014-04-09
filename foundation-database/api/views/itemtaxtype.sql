-- Item Tax Type

SELECT dropIfExists('VIEW', 'itemtaxtype', 'api');
CREATE VIEW api.itemtaxtype
AS 
   SELECT 
     item_number::varchar AS item_number,
     CASE
       WHEN (taxzone_id IS NULL) THEN
         'Any'::varchar
       ELSE
         taxzone_code::varchar
     END AS tax_zone,
     taxtype_name AS tax_type
   FROM item, itemtax
     LEFT OUTER JOIN taxzone ON (itemtax_taxzone_id=taxzone_id),
     taxtype
   WHERE ((item_id=itemtax_item_id)
   AND (itemtax_taxtype_id=taxtype_id));

GRANT ALL ON TABLE api.itemtaxtype TO xtrole;
COMMENT ON VIEW api.itemtaxtype IS 'Item Tax Type';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemtaxtype DO INSTEAD

  INSERT INTO itemtax (
    itemtax_item_id,
    itemtax_taxzone_id,
    itemtax_taxtype_id)
  VALUES (
    getItemId(NEW.item_number),
    CASE
      WHEN (NEW.tax_zone = 'Any') THEN
        NULL
      ELSE
        getTaxZoneId(NEW.tax_zone)
    END,
    getTaxTypeId(NEW.tax_type));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemtaxtype DO INSTEAD

  UPDATE itemtax SET
    itemtax_taxzone_id=
    CASE
      WHEN (NEW.tax_zone = 'Any') THEN
        NULL
      ELSE
        getTaxZoneId(NEW.tax_zone)
    END,
    itemtax_taxtype_id=getTaxTypeId(NEW.tax_type)
  WHERE  ((itemtax_item_id=getItemId(OLD.item_number))
  AND (CASE WHEN (OLD.tax_zone = 'Any') THEN
              itemtax_taxzone_id IS NULL
            ELSE
              itemtax_taxzone_id=getTaxZoneId(OLD.tax_zone) END)
  AND (itemtax_taxtype_id=getTaxTypeId(OLD.tax_type)));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemtaxtype DO INSTEAD

  DELETE FROM itemtax
  WHERE  ((itemtax_item_id=getItemId(OLD.item_number))
  AND (CASE WHEN (OLD.tax_zone = 'Any') THEN
              itemtax_taxzone_id IS NULL
            ELSE
              itemtax_taxzone_id=getTaxZoneId(OLD.tax_zone) END)
  AND (itemtax_taxtype_id=getTaxTypeId(OLD.tax_type)));
