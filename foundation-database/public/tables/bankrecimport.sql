select xt.create_table('bankrecimport', 'public');
select xt.add_column('bankrecimport','bankrecimport_id', 'SERIAL', 'PRIMARY KEY', 'public');
select xt.add_column('bankrecimport','bankrecimport_reference', 'TEXT', 'NOT NULL' 'public');
select xt.add_column('bankrecimport','bankrecimport_descrip', 'TEXT', 'NOT NULL' 'public');
select xt.add_column('bankrecimport','bankrecimport_comment', 'TEXT', 'NOT NULL' 'public');
select xt.add_column('bankrecimport','bankrecimport_debit_amount', 'NUMERIC', 'NOT NULL', 'public');
select xt.add_column('bankrecimport','bankrecimport_credit_amount', 'NUMERIC', 'NOT NULL', 'public');
select xt.add_column('bankrecimport','bankrecimport_effdate', 'DATE', 'NOT NULL', 'public');
select xt.add_column('bankrecimport','bankrecimport_curr_rate', 'NUMERIC', 'NOT NULL', 'public');
