  --Bill of Material View

SELECT dropIfExists('VIEW', 'bom', 'api');
  CREATE OR REPLACE VIEW api.bom AS

  SELECT
    item_number::varchar AS item_number,
    bomhead_revision::varchar AS revision,
    bomhead_docnum AS document_number,
    bomhead_revisiondate AS revision_date,
    bomhead_batchsize AS batch_size,
    bomhead_requiredqtyper AS total_qty_per
  FROM
    bomhead, item
  WHERE
    (bomhead_item_id=item_id);


GRANT ALL ON TABLE api.bom TO xtrole;
COMMENT ON VIEW api.bom IS 'Bill of Material Header';

  --Rules

  CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.bom DO INSTEAD

  SELECT saveBomHead(
     getItemId(NEW.item_number),
     NEW.revision,
     NEW.revision_date,
     NEW.document_number,
     COALESCE(NEW.batch_size,0),
     NEW.total_qty_per);
 
    CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.bom DO INSTEAD

  SELECT saveBomHead(
     getItemId(NEW.item_number),
     NEW.revision,
     NEW.revision_date,
     NEW.document_number,
     COALESCE(NEW.batch_size,0),
     NEW.total_qty_per);

    CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.bom DO INSTEAD

    SELECT deletebom(getItemId(OLD.item_number));
