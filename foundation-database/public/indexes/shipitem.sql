DROP INDEX IF EXISTS shipitem_orderitem_id_idx;
CREATE INDEX shipitem_orderitem_id_idx ON shipitem (shipitem_orderitem_id);

DROP INDEX IF EXISTS shipitem_invcitem_id_idx;
CREATE INDEX shipitem_invcitem_id_idx ON shipitem (shipitem_invcitem_id);

