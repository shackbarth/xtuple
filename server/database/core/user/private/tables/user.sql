-- table definition
select private.create_table('user', 'private', true);
select private.add_column('user', 'user_username', 'text', 'primary key');
select private.add_column('user', 'user_active', 'boolean', 'not null default true');
select private.add_column('user', 'user_propername', 'text', 'not null');
select private.add_column('user', 'user_initials', 'text', 'not null');
select private.add_column('user', 'user_passwd', 'text', 'not null');
select private.add_column('user', 'user_locale_id', 'integer', 'not null references public.locale (locale_id)');
select private.add_column('user', 'user_email', 'text', 'not null');
select private.add_column('user', 'user_disable_export', 'boolean', 'not null default false');

-- drop old trigger

select dropIfExists('TRIGGER', 'user_duplicate_check', 'private');

-- create new trigger

create trigger user_duplicate_check before insert on private.user for each row execute procedure private.user_duplicate_check();
