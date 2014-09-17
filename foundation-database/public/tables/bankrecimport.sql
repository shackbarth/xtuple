select xt.create_table('bankrecimport', 'public');
select xt.add_column('bankrecimport','bankrecimport_id', 'SERIAL', 'PRIMARY KEY', 'public');
select xt.add_column('bankrecimport','bankrecimport_reference', 'TEXT', NULL, 'public');
select xt.add_column('bankrecimport','bankrecimport_descrip', 'TEXT', NULL, 'public');
select xt.add_column('bankrecimport','bankrecimport_comment', 'TEXT', NULL, 'public');
select xt.add_column('bankrecimport','bankrecimport_debit_amount', 'NUMERIC', NULL, 'public');
select xt.add_column('bankrecimport','bankrecimport_credit_amount', 'NUMERIC', NULL, 'public');
select xt.add_column('bankrecimport','bankrecimport_effdate', 'DATE', NULL, 'public');
select xt.add_column('bankrecimport','bankrecimport_curr_rate', 'NUMERIC', NULL, 'public');
