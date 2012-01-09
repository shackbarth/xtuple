insert into xm.user (
  username, propername, password, initials, active, email, locale, 
  disable_export, can_create_users, is_database_user )
values (
  'sbsquarepants', 'Sponge Bob', 'sqpants', 'sbs', true, 's.squarepants@xm.ple.com', 3,
  false, false, false );

insert into xm.user_privilege_assignment (
  guid, "user", privilege )
values (
  99999, 'sbsquarepants', (select priv_id from priv where priv_name = 'MaintainItemMasters')
);

insert into xm.user_role (
  guid, name, description )
values (
  99999, 'FRYCOOK', 'Can make crabby patties'
);

select * from xm.user where username = 'sbsquarepants';

update xm.user set
  propername = 'Sponge Bob Squarepants',
  password = 'crabbypatty',
  active = false,
  email = 'sb.quarepants@xm.ple.com',
  is_database_user = true
where username = 'sbsquarepants';

select * from xm.user where username = 'sbsquarepants';

delete from xm.user where username = 'sbsquareparts';


/******** database user *********/

insert into xm.user (
  guid, propername, password, initials, active, email, locale, 
  disable_export, can_create_users, is_database_user )
values (
  'sbsquarepants', 'Sponge Bob', 'sqpants', 'sbs', true, 's.squarepants@xm.ple.com', 3,
  false, false, true );

select * from xm.user where guid = 'sbsquarepants';

update xm.user set
  propername = 'Sponge Bob Squarepants',
  password = 'crabbypatty',
  active = false,
  email = 'sb.quarepants@xm.ple.com'
where guid = 'sbsquarepants';

select * from xm.user where guid = 'sbsquarepants';

delete from xm.user where guid = 'sbsquareparts';

drop user sbsquarepants;
delete from usrpref where usrpref_username = 'sbsquarepants';
delete from xm.user_role where guid = 99999;
delete from xm.user_privilege_assignment where guid = 99999;
