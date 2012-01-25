-- populate data

insert into private.datatype (datatype_name, datatype_descrip, datatype_source) 
select 'Image', '_image','IMG' where not exists (select * from private.datatype where datatype_name = 'Image');

insert into private.datatype (datatype_name, datatype_descrip, datatype_source) 
select 'File', '_file','FILE' where not exists (select * from private.datatype where datatype_name = 'File');

insert into private.datatype (datatype_name, datatype_descrip, datatype_source) 
select 'Url', '_url','URL' where not exists (select * from private.datatype where datatype_name = 'Url');


