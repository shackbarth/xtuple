--CREATE INDEX cobilltax_taxhist_parent_id_idx on cobilltax using btree (taxhist_parent_id);
select xt.add_index('cobilltax', 'taxhist_parent_id','cobilltax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX cobilltax_taxhist_taxtype_id_idx on cobilltax using btree (taxhist_taxtype_id);
select xt.add_index('cobilltax', 'taxhist_taxtype_id','cobilltax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX cobilltax_taxhist_parent_type_idx on cobilltax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('cobilltax', 'taxhist_parent_id, taxhist_taxtype_id','cobilltax_taxhist_parent_type_idx', 'btree', 'public');
