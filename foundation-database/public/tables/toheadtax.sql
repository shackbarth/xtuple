--CREATE INDEX toheadtax_taxhist_parent_id_idx on toheadtax using btree (taxhist_parent_id);
select xt.add_index('toheadtax', 'taxhist_parent_id','toheadtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX toheadtax_taxhist_taxtype_id_idx on toheadtax using btree (taxhist_taxtype_id);
select xt.add_index('toheadtax', 'taxhist_taxtype_id','toheadtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX toheadtax_taxhist_parent_type_idx on toheadtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('toheadtax', 'taxhist_parent_id, taxhist_taxtype_id','toheadtax_taxhist_parent_type_idx', 'btree', 'public');
