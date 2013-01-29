-- [ START ] initdb

-- run core orm scripts
\cd ../../orm/source;
\i init_script.sql;
\cd ../../server/source;

-- [ END ] initdb

-- [ START ] xt

-- xt tables
\i xt/tables/datasource.sql
\i xt/tables/dbserver.sql
\i xt/tables/ext.sql
\i xt/tables/org.sql
\i xt/tables/orgext.sql
\i xt/tables/session.sql
\i xt/tables/usr.sql
\i xt/tables/usrorg.sql
\i xt/tables/sessionorg.sql
\i xt/tables/pentahotempqrydata.sql


-- xt functions
\i xt/functions/add_priv.sql

-- add necessary privs

select xt.add_priv('MaintainDatabaseServers', 'Can Maintain Database Servers', 'MaintainDatabaseServers', 'Admin', 'admin', 'Admin');
select xt.add_priv('ViewDatabaseServers', 'Can View Database Servers', 'ViewDatabaseServers', 'Admin', 'admin', 'Admin');
select xt.add_priv('MaintainOrganizations', 'Can Maintain Organizations', 'MaintainOrganizations', 'Admin', 'admin', 'Admin');
select xt.add_priv('ViewOrganizations', 'Can View Organizations', 'ViewOrganizations', 'Admin', 'admin', 'Admin');
select xt.add_priv('MaintainGlobalUsers', 'Can Maintain Users', 'MaintainGlobalUsers', 'Admin', 'admin', 'Admin');
select xt.add_priv('ViewGlobalUsers', 'Can View Users', 'ViewGlobalUsers', 'Admin', 'admin', 'Admin');
select xt.add_priv('MaintainExtensions', 'Can Maintain Extensions', 'MaintainExtensions', 'Admin', 'admin', 'Admin');
select xt.add_priv('ViewExtensions', 'Can View Extensions', 'ViewExtensions', 'Admin', 'admin', 'Admin');

\i xt/node_user.sql
\i xt/admin_user.sql

-- [ END ] xt
