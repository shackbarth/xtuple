select xt.create_table('saletypewf', 'xt', false, 'xt.wfsrc');

select xt.add_constraint('saletypewf', 'saletypewf_pkey', 'primary key (wfsrc_id)');
select xt.add_constraint('saletypewf', 'saletypewf_wfsrc_priority_id_fkey', 'foreign key (wfsrc_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('saletypewf', 'saletypewf_wfsrc_parent_id_fkey', 'foreign key (wfsrc_parent_id) references saletype (saletype_id) on delete cascade');

comment on table xt.saletypewf is 'Sale type workflow table';
