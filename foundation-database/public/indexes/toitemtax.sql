--CREATE INDEX toitemtax_taxhist_parent_id_idx on toitemtax using btree (taxhist_parent_id);
select xt.add_index('toitemtax', 'taxhist_parent_id','toitemtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX toitemtax_taxhist_taxtype_id_idx on toitemtax using btree (taxhist_taxtype_id);
select xt.add_index('toitemtax', 'taxhist_taxtype_id','toitemtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX toitemtax_taxhist_parent_type_idx on toitemtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('toitemtax', 'taxhist_parent_id, taxhist_taxtype_id','toitemtax_taxhist_parent_type_idx', 'btree', 'public');
