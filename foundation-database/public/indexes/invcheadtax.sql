--CREATE INDEX invcheadtax_taxhist_parent_id_idx on invcheadtax using btree (taxhist_parent_id);
select xt.add_index('invcheadtax', 'taxhist_parent_id','invcheadtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX invcheadtax_taxhist_taxtype_id_idx on invcheadtax using btree (taxhist_taxtype_id);
select xt.add_index('invcheadtax', 'taxhist_taxtype_id','invcheadtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX invcheadtax_taxhist_parent_type_idx on invcheadtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('invcheadtax', 'taxhist_parent_id, taxhist_taxtype_id','invcheadtax_taxhist_parent_type_idx', 'btree', 'public');
