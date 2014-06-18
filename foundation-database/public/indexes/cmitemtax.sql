--CREATE INDEX cmitemtax_taxhist_parent_id_idx on cmitemtax using btree (taxhist_parent_id);
select xt.add_index('cmitemtax', 'taxhist_parent_id','cmitemtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX cmitemtax_taxhist_taxtype_id_idx on cmitemtax using btree (taxhist_taxtype_id);
select xt.add_index('cmitemtax', 'taxhist_taxtype_id','cmitemtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX cmitemtax_taxhist_parent_type_idx on cmitemtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('cmitemtax', 'taxhist_parent_id, taxhist_taxtype_id','cmitemtax_taxhist_parent_type_idx', 'btree', 'public');
