select xt.create_table('taxpay', 'public');
select xt.add_column('taxpay','taxpay_id', 'SERIAL', 'PRIMARY KEY', 'public');
select xt.add_column('taxpay','taxpay_taxhist_id', 'INTEGER', 'NOT NULL', 'public');
select xt.add_column('taxpay','taxpay_apply_id', 'INTEGER', 'NOT NULL', 'public');
select xt.add_column('taxpay','taxpay_distdate', 'DATE', 'NOT NULL', 'public');
select xt.add_column('taxpay','taxpay_tax', 'NUMERIC', 'NOT NULL', 'public');
