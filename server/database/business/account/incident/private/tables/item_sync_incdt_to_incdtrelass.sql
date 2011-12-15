-- Trigger: item_sync_incdt_to_incdtrelass on incdt

-- DROP TRIGGER item_sync_incdt_to_incdtrelass ON incdt;

CREATE TRIGGER item_sync_incdt_to_incdtrelass
  AFTER INSERT OR UPDATE
  ON incdt
  FOR EACH ROW
  EXECUTE PROCEDURE private.item_sync_incdt_to_incdtrelass();