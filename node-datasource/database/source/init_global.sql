-- [ START ] initdb
-- [ START ] xt

-- xt tables
-- These need to be in the correct order for them to load based on dependant columns.
\i xt/tables/ext.sql
\i xt/tables/org.sql
\i xt/tables/orgext.sql

\i xt/tables/sessionstore.sql

\i xt/tables/useracctorg.sql

\i xt/tables/oa2client.sql
\i xt/tables/oa2clientredirs.sql
\i xt/tables/oa2token.sql

\i xt/tables/bicache.sql

-- add necessary privs
--select xt.add_priv('MaintainOrganizations', 'Can Maintain Organizations', 'MaintainOrganizations', 'Admin', 'admin', 'Admin');
--select xt.add_priv('ViewOrganizations', 'Can View Organizations', 'ViewOrganizations', 'Admin', 'admin', 'Admin');
--select xt.add_priv('MaintainExtensions', 'Can Maintain Extensions', 'MaintainExtensions', 'Admin', 'admin', 'Admin');
--select xt.add_priv('ViewExtensions', 'Can View Extensions', 'ViewExtensions', 'Admin', 'admin', 'Admin');

--\i xt/node_user.sql

-- [ END ] xt
