-- Customer CRM Account's users.
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_cust',
  'obj_uuid',
  'username'
);

-- Ship To CRM Account's users.
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_shipto',
  'obj_uuid',
  'username'
);
