-- add necessary privs

select xt.add_priv('AccessAdminExtension', 'Can Access Admin Extension', 'AccessAdminExtension', 'Admin', 'admin', 'Admin', true);
