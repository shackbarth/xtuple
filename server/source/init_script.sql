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
\i xt/tables/org.sql
\i xt/tables/session.sql
\i xt/tables/usr.sql
\i xt/tables/usrorg.sql
\i xt/tables/sessionorg.sql

-- xt dispatch functions
\i xt/javascript/user.sql


-- [ END ] xt
