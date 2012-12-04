-- add necessary privs

select xt.add_priv('AccessProjectExtension', 'Can Access Project Extension', 'AccessProjectExtension', 'Projects', 'project', 'Projects');
