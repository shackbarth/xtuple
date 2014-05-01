--CREATE INDEX cohisttax_taxhist_parent_id_idx on cohisttax using btree (taxhist_parent_id);
select xt.add_index('cohisttax', 'taxhist_parent_id','cohisttax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX cohisttax_taxhist_taxtype_id_idx on cohisttax using btree (taxhist_taxtype_id);
select xt.add_index('cohisttax', 'taxhist_taxtype_id','cohisttax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX cohisttax_taxhist_parent_type_idx on cohisttax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('cohisttax', 'taxhist_parent_id, taxhist_taxtype_id','cohisttax_taxhist_parent_type_idx', 'btree', 'public');
