insert into xm.account (
  id, "number", name, is_active, "type", owner, parent, notes, primary_contact, secondary_contact, "user")
values (
  99999, 'TEST NUMBER', 'TEST NAME', true, 'O', 'admin', NULL, 'TEST NOTES', 1, 6, 'admin');

insert into docass (
  docass_id, docass_source_id, docass_source_type, docass_target_id, docass_target_type, docass_purpose)
values (
  99999, 99999, 'CRMA', 325, 'I', 'S');

insert into docass (
  docass_id, docass_source_id, docass_source_type, docass_target_id, docass_target_type, docass_purpose)
values (
  99998, 316, 'I', 99999, 'CRMA', 'S');

insert into imageass (
  imageass_id, imageass_source_id, imageass_source, imageass_image_id, imageass_purpose)
values (
  99999, 99999, 'CRMA', 23, 'S');

select * from xm.account where id = 99999;

update xm.account set
  "number" = '**UPDATED NUMBER**',
  name = '**UPDATED NAME**',
  is_active = false,
  "type" = 'I',
  owner = 'web',
  parent = 1,
  notes = '**UPDATED NOTES**',
  primary_contact = 2,
  secondary_contact = 7,
where id = 99999;

delete from xm.account
where id = 99999;
