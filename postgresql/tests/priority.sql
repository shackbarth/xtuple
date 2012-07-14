--[select = return]
select * from incdtpriority;
select * from xm.priority where id = 6;
--end [select = return]

-- [insert into = create]

insert into xm.priority ( id, "name", "order", description ) 
	values ( 6, 'Test View', 6, 'tesing xm.priority view' );

--end [insert into = create]

--[update]

update xm.priority Set
	name = 'Extreme'
where id = 6;
	
--end [update]

--[delete]
	
delete from xm.priority 
	where id = 6;
	
--end [delete]
