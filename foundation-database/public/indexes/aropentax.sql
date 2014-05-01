--CREATE INDEX aropentax_taxhist_parent_id_idx on aropentax using btree (taxhist_parent_id);
select xt.add_index('aropentax', 'taxhist_parent_id','aropentax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX aropentax_taxhist_taxtype_id_idx on aropentax using btree (taxhist_taxtype_id);
select xt.add_index('aropentax', 'taxhist_taxtype_id','aropentax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX aropentax_taxhist_parent_type_idx on aropentax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('aropentax', 'taxhist_parent_id, taxhist_taxtype_id','aropentax_taxhist_parent_type_idx', 'btree', 'public');
