select xt.create_table('potypewf', 'xt', false, 'xt.wfsrc');

select xt.add_constraint('potypewf', 'potypewf_pkey', 'primary key (wfsrc_id)');
select xt.add_constraint('potypewf', 'potypewf_wfsrc_priority_id_fkey', 'foreign key (wfsrc_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('potypewf', 'potypewf_wfsrc_parent_id_fkey', 'foreign key (wfsrc_parent_id) references potype (potype_id) on delete cascade');

comment on table xt.potypewf is 'Purchase Order type workflow table';