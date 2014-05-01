--CREATE INDEX apopentax_taxhist_parent_id_idx on apopentax using btree (taxhist_parent_id);
select xt.add_index('apopentax', 'taxhist_parent_id','apopentax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX apopentax_taxhist_taxtype_id_idx on apopentax using btree (taxhist_taxtype_id);
select xt.add_index('apopentax', 'taxhist_taxtype_id','apopentax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX apopentax_taxhist_parent_type_idx on apopentax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('apopentax', 'taxhist_parent_id, taxhist_taxtype_id','apopentax_taxhist_parent_type_idx', 'btree', 'public');
