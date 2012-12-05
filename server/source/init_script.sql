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


-- xt functions
\i xt/functions/add_priv.sql

-- add necessary privs

select xt.add_priv('MaintainUsers', 'Can Maintain Users', 'MaintainUsers', 'Admin', 'admin', 'Admin');
select xt.add_priv('ViewUsers', 'Can View Users', 'ViewUsers', 'Admin', 'admin', 'Admin');

-- [ END ] xt
