select dropIfExists('VIEW', 'todo_info', 'xm');

-- return rule

create or replace view xm.todo_info as
	
select
 	id,
	number,
	is_active
from xm.todo;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.todo_info
	do instead nothing;
-- update rule

create or replace rule "_UPDATE" as on update to xm.todo_info
	do instead nothing;
	
-- delete rules

create or replace rule "_DELETE" as on delete to xm.todo_info	 
	do instead nothing;