DROP INDEX IF EXISTS invcitemtax_taxhist_parent_id_idx;
CREATE INDEX invcitemtax_taxhist_parent_id_idx ON invcitemtax (taxhist_parent_id);

