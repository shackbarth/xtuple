--CREATE INDEX voheadtax_taxhist_parent_id_idx on voheadtax using btree (taxhist_parent_id);
select xt.add_index('voheadtax', 'taxhist_parent_id','voheadtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX voheadtax_taxhist_taxtype_id_idx on voheadtax using btree (taxhist_taxtype_id);
select xt.add_index('voheadtax', 'taxhist_taxtype_id','voheadtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX voheadtax_taxhist_parent_type_idx on voheadtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('voheadtax', 'taxhist_parent_id, taxhist_taxtype_id','voheadtax_taxhist_parent_type_idx', 'btree', 'public');
