-- TODO: Add a precheck in the upgrade package.xml for this.
select xt.add_constraint('payco','payco_unique_ccpay_id_cohead_id', 'unique(payco_ccpay_id, payco_cohead_id)', 'public');
-- Add primary key.
select xt.add_column('payco','payco_id', 'serial', 'primary key', 'public', 'payco table primary key.');
