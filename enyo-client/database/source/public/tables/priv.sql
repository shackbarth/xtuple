-- Setup default 'ADMIN' role and grant it to 'admin' user it it doesn't exist.

-- Add 'ADMIN' Role.
select xt.add_role('ADMIN', 'Administrators Role');

-- Grant 'admin' user 'ADMIN' Role.
select xt.grant_user_role('admin', 'ADMIN');

select xt.add_priv('InstallExtension', 'Can Install Extensions', 'command_center', 'CommandCenter');
