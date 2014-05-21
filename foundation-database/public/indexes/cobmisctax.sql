--CREATE INDEX cobmisctax_taxhist_parent_id_idx on cobmisctax using btree (taxhist_parent_id);
select xt.add_index('cobmisctax', 'taxhist_parent_id','cobmisctax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX cobmisctax_taxhist_taxtype_id_idx on cobmisctax using btree (taxhist_taxtype_id);
select xt.add_index('cobmisctax', 'taxhist_taxtype_id','cobmisctax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX cobmisctax_taxhist_parent_type_idx on cobmisctax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('cobmisctax', 'taxhist_parent_id, taxhist_taxtype_id','cobmisctax_taxhist_parent_type_idx', 'btree', 'public');
