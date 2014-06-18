--CREATE INDEX invcitemtax_taxhist_parent_id_idx on invcitemtax using btree (taxhist_parent_id);
select xt.add_index('invcitemtax', 'taxhist_parent_id','invcitemtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX invcitemtax_taxhist_taxtype_id_idx on invcitemtax using btree (taxhist_taxtype_id);
select xt.add_index('invcitemtax', 'taxhist_taxtype_id','invcitemtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX invcitemtax_taxhist_parent_type_idx on invcitemtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('invcitemtax', 'taxhist_parent_id, taxhist_taxtype_id','invcitemtax_taxhist_parent_type_idx', 'btree', 'public');
