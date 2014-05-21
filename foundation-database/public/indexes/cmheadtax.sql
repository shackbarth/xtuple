--CREATE INDEX cmheadtax_taxhist_parent_id_idx on cmheadtax using btree (taxhist_parent_id);
select xt.add_index('cmheadtax', 'taxhist_parent_id','cmheadtax_taxhist_parent_id_idx', 'btree', 'public');

--CREATE INDEX cmheadtax_taxhist_taxtype_id_idx on cmheadtax using btree (taxhist_taxtype_id);
select xt.add_index('cmheadtax', 'taxhist_taxtype_id','cmheadtax_taxhist_taxtype_id_idx', 'btree', 'public');

--CREATE INDEX cmheadtax_taxhist_parent_type_idx on cmheadtax using btree (taxhist_parent_id, taxhist_taxtype_id);
select xt.add_index('cmheadtax', 'taxhist_parent_id, taxhist_taxtype_id','cmheadtax_taxhist_parent_type_idx', 'btree', 'public');
