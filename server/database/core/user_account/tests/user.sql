insert into xm.user_account (
  username, propername, password, initials, is_active, email, locale, 
  disable_export, can_create_users, is_database_user )
values (
  'sbsquarepants', 'Sponge Bob', 'sqpants', 'sbs', true, 's.squarepants@xm.ple.com', 3,
  false, false, false );

insert into xm.user_account_privilege_assignment (
  guid, user_account, privilege )
values (
  99999, 'sbsquarepants', (select privilege from xm.privilege where name = 'MaintainItemMasters')
);

insert into xm.user_account_role (
  guid, name, description )
values (
  99999, 'FRYCOOK', 'Can make crabby patties'
);

select * from xm.user_account where username = 'sbsquarepants';

update xm.user_account set
  propername = 'Sponge Bob Squarepants',
  password = 'crabbypatty',
  is_active = false,
  email = 'sb.quarepants@xm.ple.com',
  is_database_user = true
where username = 'sbsquarepants';

select * from xm.user_account where username = 'sbsquarepants';

delete from xm.user_account where username = 'sbsquareparts';


/******** database user *********/

insert into xm.user_account (
  username, propername, password, initials, is_active, email, locale, 
  disable_export, can_create_users, is_database_user )
values (
  'sbsquarepants', 'Sponge Bob', 'sqpants', 'sbs', true, 's.squarepants@xm.ple.com', 3,
  false, false, true );

select * from xm.user_account where username = 'sbsquarepants';

update xm.user_account set
  propername = 'Sponge Bob Squarepants',
  password = 'crabbypatty',
  is_active = false,
  email = 'sb.quarepants@xm.ple.com'
where guid = 'sbsquarepants';

select * from xm.user_account where guid = 'sbsquarepants';

delete from xm.user_account where guid = 'sbsquareparts';

drop user sbsquarepants;
delete from usrpref where usrpref_username = 'sbsquarepants';
delete from xm.user_account_role where guid = 99999;
delete from xm.user_account_privilege_assignment where guid = 99999;
