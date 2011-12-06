-- populate data

insert into private.datatype (datatype_name, datatype_descrip, datatype_source) 
select 'Item', '_item', 'I' where not exists (select * from private.datatype where datatype_name = 'Item');
