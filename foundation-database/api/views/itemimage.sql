-- Item Image

SELECT dropIfExists('VIEW', 'itemimage', 'api');
CREATE VIEW api.itemimage
AS 
   SELECT 
     item_number::varchar AS item_number,
     CASE
       WHEN imageass_purpose = 'P' THEN
        'Product Description'
       WHEN imageass_purpose = 'I' THEN
        'Inventory Description'
       WHEN imageass_purpose = 'E' THEN
        'Engineering Reference'
       WHEN imageass_purpose = 'M' THEN
        'Miscellaneous'
       ELSE
        'Other'
     END AS purpose,
     image_name AS image_name
   FROM item, imageass, image
   WHERE ((item_id=imageass_source_id)
   AND (imageass_source='I')
   AND (imageass_image_id=image_id));

GRANT ALL ON TABLE api.itemimage TO xtrole;
COMMENT ON VIEW api.itemimage IS 'Item Image';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemimage DO INSTEAD

  SELECT saveImageAss(
    'I',
    getItemId(NEW.item_number),
    CASE
      WHEN NEW.purpose = 'Product Description' THEN
        'P'
      WHEN NEW.purpose = 'Inventory Description' THEN
        'I'
      WHEN NEW.purpose = 'Engineering Reference' THEN
        'E'
      WHEN NEW.purpose = 'Miscellaneous' THEN
        'M'
      ELSE
        'X'
     END,
    getImageId(NEW.image_name));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemimage DO INSTEAD

  SELECT saveImageAss(
    'I',
    getItemId(NEW.item_number),
    CASE
      WHEN NEW.purpose = 'Product Description' THEN
        'P'
      WHEN NEW.purpose = 'Inventory Description' THEN
        'I'
      WHEN NEW.purpose = 'Engineering Reference' THEN
        'E'
      WHEN NEW.purpose = 'Miscellaneous' THEN
        'M'
      ELSE
        'X'
     END,
    getImageId(NEW.image_name));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemimage DO INSTEAD

  DELETE FROM imageass
  WHERE ((imageass_source_id=getItemId(OLD.item_number))
  AND (imageass_source='I')
  AND (imageass_image_id=getImageId(OLD.image_name)));
