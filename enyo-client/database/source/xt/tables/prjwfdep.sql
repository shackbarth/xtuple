select xt.create_table('prjwfdep', 'xt', false, 'xt.wfdep');

select xt.add_constraint('prjwfdep', 'prjwfdep_pkey', 'primary key (wfdep_id)');
select xt.add_constraint('prjwfdep', 'prjwfdep_wfdep_source_id_fkey', 'foreign key (wfdep_source_id) references xt.prjwf (wf_id) on delete cascade');
select xt.add_constraint('prjwfdep', 'prjwfdep_wfdep_target_id_fkey', 'foreign key (wfdep_target_id) references xt.prjwf (wf_id) on delete cascade');
select xt.add_constraint('prjwfdep','prjwfdep_prjwfdep_source_id_prjwfdep_target_id', 'unique(wfdep_source_id, wfdep_target_id)');

comment on table xt.prjwf is 'Project workflow table';