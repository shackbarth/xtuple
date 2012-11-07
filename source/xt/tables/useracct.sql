-- table definition
select xt.create_table('useracct', 'xt');
select xt.add_column('useracct', 'useracct_id', 'integer', 'unique');
select xt.add_column('useracct', 'useracct_username', 'text', 'primary key');
select xt.add_column('useracct', 'useracct_active', 'boolean');
select xt.add_column('useracct', 'useracct_propername', 'text');
select xt.add_column('useracct', 'useracct_initials', 'text');
select xt.add_column('useracct', 'useracct_email', 'text');
select xt.add_column('useracct', 'useracct_locale_id','integer');
select xt.add_column('useracct', 'useracct_disable_export', 'boolean');





