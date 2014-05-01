--CREATE INDEX voitemtax_taxhist_parent_id_idx on voitemtax using btree (taxhist_parent_id);
select xt.add_index('voitemtax', 'taxhist_parent_id','voitemtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX voitemtax_taxhist_taxtype_id_idx on voitemtax using btree (taxhist_taxtype_id);
select xt.add_index('voitemtax', 'taxhist_taxtype_id','voitemtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX voitemtax_taxhist_parent_type_idx on voitemtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('voitemtax', 'taxhist_parent_id, taxhist_taxtype_id','voitemtax_taxhist_parent_type_idx', 'btree', 'public');
