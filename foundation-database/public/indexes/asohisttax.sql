--CREATE INDEX asohisttax_taxhist_parent_id_idx on asohisttax using btree (taxhist_parent_id);
select xt.add_index('asohisttax', 'taxhist_parent_id','asohisttax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX asohisttax_taxhist_taxtype_id_idx on asohisttax using btree (taxhist_taxtype_id);
select xt.add_index('asohisttax', 'taxhist_taxtype_id','asohisttax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX asohisttax_taxhist_parent_type_idx on asohisttax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('asohisttax', 'taxhist_parent_id, taxhist_taxtype_id','asohisttax_taxhist_parent_type_idx', 'btree', 'public');
