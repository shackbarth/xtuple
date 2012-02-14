insert into xm.honorific (
  guid, code )
values (
  99999, 'Sr'
);

insert into xm.address (
  guid, number, is_active, line1, line2, line3, city, state, postalcode, country )
values (
  99999, '99999', true, '15123 206th NE. Ave.', '', '', 'Woodinville', 'WA','98072','United States' );

insert into xm.contact (
  guid, number, is_active, honorific, first_name, middle_name, last_name, suffix,
  phone, alternate, fax, web_address, primary_email, 
  owner, notes, address )
values (
  99999, '99999', true, 'Mr.', 'John' , 'A', 'Doe', 'Jr.',
  '555-5656', '555-5555', '890-2345', 'www.xtuple.com', 'johnd@xm.ple.com', 
  (select user_account_info 
   from xm.user_account_info
   where username = current_user), 'Read my notes.', 
  (select address_info
   from xm.address_info
   where guid = 99999) );

insert into xm.contact_comment (
  guid, contact, date, username, comment_type, text, is_public )
values (
  99999, 99999, now(), current_user, (select cmnttype_id from cmnttype where cmnttype_name = 'Sales'), 'Foo.', false );

insert into xm.contact_characteristic (
  guid, contact, characteristic, value )
values (
  99999, 99999, (select characteristic from xm.characteristic where name = 'ADR-STOP'), 'Yes' );

insert into xm.file (
  guid, name, data )
values (
  99999, 'now.txt', 'Now is the time...' );

select * from xm.honorific;
select * from xm.contact where guid = 99999;
select * from xm.contact_comment where guid = 99999;
select * from xm.contact_characteristic where guid = 99999;

update xm.honorific set
  code = 'Sr.'
where ( guid = 99999 );

update xm.contact set
  honorific = 'Ms.',
  first_name = 'Jane',
  last_name = 'Doenut',
  suffix = ''
where guid = 99999;

update xm.contact_comment set
  text = 'Foobar.'
where guid = 99999;

update xm.contact_characteristic set
  value = 'Foobar.'
where guid = 99999;

select * from xm.contact where guid = 99999;
select * from xm.contact_comment where guid = 99999;
select * from xm.contact_characteristic where guid = 99999;

delete from xm.honorific where guid = 99999;
delete from xm.contact where guid = 99999;
delete from xm.file where guid = 99999;
delete from xm.address where guid = 99999;

select * from xm.address where guid = 99999;
select * from xm.address_comment where guid = 99999;
select * from xm.address_characteristic where guid = 99999;








  
  
