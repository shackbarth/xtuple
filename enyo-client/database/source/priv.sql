-- add necessary privs

select xt.add_priv('SystemControl', 'Maintain user management tables', 'System', 'System');
