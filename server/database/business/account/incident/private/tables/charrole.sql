-- populate data

insert into private.charrole (charrole_datatype_id) select datatype_id 
from private.datatype 
where (datatype_name = 'Incident')
 and ( not exists (select * from private.charrole join private.datatype on (charrole_datatype_id = datatype_id) where ( datatype_name = 'Incident') ) );
