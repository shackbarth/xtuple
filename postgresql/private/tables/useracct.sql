-- drop old trigger

select dropIfExists('TRIGGER', 'useracct_duplicate_check', 'private');

-- table definition
select private.create_table('useracct', 'private');
select private.add_column('useracct', 'useracct_id', 'serial', 'primary key');
select private.add_column('useracct', 'useracct_username', 'text', 'not null unique');
select private.add_column('useracct', 'useracct_active', 'boolean', 'not null default true');
select private.add_column('useracct', 'useracct_propername', 'text', 'not null');
select private.add_column('useracct', 'useracct_initials', 'text', 'not null');
select private.add_column('useracct', 'useracct_passwd', 'text', 'not null');
select private.add_column('useracct', 'useracct_locale_id', 'integer', 'not null references public.locale (locale_id)');
select private.add_column('useracct', 'useracct_email', 'text', 'not null');
select private.add_column('useracct', 'useracct_disable_export', 'boolean', 'not null default false');

-- create new trigger

create trigger useracct_duplicate_check before insert on private.useracct for each row execute procedure private.useracct_duplicate_check();
