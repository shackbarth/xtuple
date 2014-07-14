-- Invoice CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_invchead';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_invchead',
  'obj_uuid',
  'username'
);
