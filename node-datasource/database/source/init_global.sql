-- [ START ] initdb

-- run core orm scripts
\cd ../../../lib/orm/source;
\i init_script.sql;
\cd ../../../node-datasource/database/source;

-- [ END ] initdb

-- [ START ] xt

-- xt tables
-- These need to be in the correct order for them to load based on dependant columns.
\i xt/tables/datasource.sql
\i xt/tables/dbserver.sql
\i xt/tables/ext.sql
\i xt/tables/cmpg.sql
\i xt/tables/org.sql
\i xt/tables/orgext.sql
-- TODO Remove session in a future version after it has had time to be dropped.
\i xt/tables/session.sql
\i xt/tables/sessionorg.sql

\i xt/tables/sessionstore.sql

\i xt/tables/usr.sql
\i xt/tables/usrorg.sql
\i xt/tables/sessionorg.sql

\i xt/tables/oa2client.sql
\i xt/tables/oa2clientredirs.sql
\i xt/tables/oa2token.sql

\i xt/tables/bicache.sql

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
select xt.add_priv('MaintainCampaigns', 'Can Maintain Campaigns', 'MaintainCampaigns', 'Admin', 'admin', 'Admin');
select xt.add_priv('ViewCampaigns', 'Can View Campaigns', 'ViewCampaigns', 'Admin', 'admin', 'Admin');

\i xt/node_user.sql
\i xt/admin_user.sql

-- [ END ] xt
