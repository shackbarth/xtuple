--CREATE INDEX taxhist_taxhist_parent_id_idx on taxhist using btree (taxhist_parent_id);
select xt.add_index('taxhist', 'taxhist_parent_id','taxhist_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX taxhist_taxhist_taxtype_id_idx on taxhist using btree (taxhist_taxtype_id);
select xt.add_index('taxhist', 'taxhist_taxtype_id','taxhist_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX taxhist_taxhist_parent_type_idx on taxhist using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('taxhist', 'taxhist_parent_id, taxhist_taxtype_id','taxhist_taxhist_parent_type_idx', 'btree', 'public');
