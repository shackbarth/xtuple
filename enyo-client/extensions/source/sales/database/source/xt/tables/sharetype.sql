-- Customer CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_cust';
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
delete from xt.sharetype where sharetype_tblname = 'share_users_shipto';
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

-- Contact that is on a Ship To CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_shipto_cntct';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_shipto_cntct',
  'obj_uuid',
  'username'
);

-- Address that is on a Ship To CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_shipto_addr';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_shipto_addr',
  'obj_uuid',
  'username'
);

-- Customer that a Ship To is on CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_shipto_cust';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_shipto_cust',
  'obj_uuid',
  'username'
);

-- Sales Order CRM Account's users.
delete from xt.sharetype where sharetype_tblname = 'share_users_cohead';
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_cohead',
  'obj_uuid',
  'username'
);
