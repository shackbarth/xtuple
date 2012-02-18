-- drop old trigger

select dropIfExists('TRIGGER', 'useracct_duplicate_check', 'xt');

-- table definition
select xt.create_table('useracct', 'xt');
select xt.add_column('useracct', 'useracct_id', 'serial', 'primary key');
select xt.add_column('useracct', 'useracct_username', 'text', 'not null unique');
select xt.add_column('useracct', 'useracct_active', 'boolean', 'not null default true');
select xt.add_column('useracct', 'useracct_propername', 'text', 'not null');
select xt.add_column('useracct', 'useracct_initials', 'text', 'not null');
select xt.add_column('useracct', 'useracct_passwd', 'text', 'not null');
select xt.add_column('useracct', 'useracct_locale_id', 'integer', 'not null references public.locale (locale_id)');
select xt.add_column('useracct', 'useracct_email', 'text', 'not null');
select xt.add_column('useracct', 'useracct_disable_export', 'boolean', 'not null default false');

-- create new trigger

create trigger useracct_duplicate_check before insert on xt.useracct for each row execute procedure xt.useracct_duplicate_check();
