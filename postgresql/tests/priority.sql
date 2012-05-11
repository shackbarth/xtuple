--[select = return]
select * from incdtpriority;
select * from xm.priority where guid = 6;
--end [select = return]

-- [insert into = create]

insert into xm.priority ( guid, "name", "order", description ) 
	values ( 6, 'Test View', 6, 'tesing xm.priority view' );

--end [insert into = create]

--[update]

update xm.priority Set
	name = 'Extreme'
where guid = 6;
	
--end [update]

--[delete]
	
delete from xm.priority 
	where guid = 6;
	
--end [delete]
