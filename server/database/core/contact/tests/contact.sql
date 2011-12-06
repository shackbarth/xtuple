insert into xm.honorific (
  id, code )
values (
  99999, 'Sr'
);

insert into xm.address (
  id, number, is_active, line1, line2, line3, city, state, postalcode, country )
values (
  99999, '99999', true, '15123 206th NE. Ave.', '', '', 'Woodinville', 'WA','98072','United States' );

insert into xm.contact (
  id, number, is_active, honorific, first_name, middle_name, last_name, suffix,
  phone, alternate, fax, web_address, primary_email, 
  owner, account, notes, address )
values (
  99999, '99999', true, 'Mr.', 'John' , 'A', 'Doe', 'Jr.',
  '555-5656', '555-5555', '890-2345', 'www.xtuple.com', 'johnd@xm.ple.com', 
  current_user, (select crmacct_id from crmacct where crmacct_number = 'TTOYS'), 'Read my notes.', 99999 );

insert into xm.contact_comment (
  id, contact, date, username, comment_type, text, is_public )
values (
  99999, 99999, now(), current_user, (select cmnttype_id from cmnttype where cmnttype_name = 'General'), 'Foo.', false );

insert into xm.contact_characteristic (
  id, contact, characteristic, value )
values (
  99999, 99999, (select char_id from char where char_name = 'ADR-STOP'), 'Yes' );

insert into xm.contact_document (
  id, contact, target, target_type, purpose )
values (
  99999, 99999, (select incdt_id from incdt where incdt_number = '15000'), private.get_id('datatype', 'datatype_source', 'INCDT'), 'S' );

insert into xm.file (
  id, name, data )
values (
  99999, 'now.txt', 'Now is the time...' );

insert into xm.contact_document (
  id, contact, target, target_type, purpose )
values (
  99998, 99999, (select file_id from file where file_title = 'now.txt'), private.get_id('datatype', 'datatype_source', 'FILE'), 'S' );

select * from xm.honorific;
select * from xm.contact where id = 99999;
select * from xm.contact_comment where id = 99999;
select * from xm.contact_characteristic where id = 99999;

update xm.honorific set
  code = 'Sr.'
where ( id = 99999 );

update xm.contact set
  honorific = 'Ms.',
  first_name = 'Jane',
  last_name = 'Doenut',
  suffix = '',
  account = (select crmacct_id from crmacct where crmacct_number = 'TPARTS')
where id = 99999;

update xm.contact_comment set
  text = 'Foobar.'
where id = 99999;

update xm.contact_characteristic set
  value = 'Foobar.'
where id = 99999;

select * from xm.contact where id = 99999;
select * from xm.contact_comment where id = 99999;
select * from xm.contact_characteristic where id = 99999;
select * from xm.contact_document where id in (99998,99999);

delete from xm.honorific where id = 99999;
delete from xm.contact where id = 99999;
delete from xm.file where id = 99999;
delete from xm.address where id = 99999;

select * from xm.address where id = 99999;
select * from xm.address_comment where id = 99999;
select * from xm.address_characteristic where id = 99999;







  
  
