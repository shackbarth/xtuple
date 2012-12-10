-- add necessary privs

select xt.add_priv('AccessIncidentPlusExtension', 'Can Access Incident Plus Extension', 'AccessIncidentPlusExtension', 'Projects', 'project', 'Projects', true);
