--CREATE INDEX invchead_invchead_cust_id_idx on invchead using btree (invchead_cust_id);
select xt.add_index('invchead', 'invchead_cust_id','invchead_invchead_cust_id_idx', 'btree', 'public');
