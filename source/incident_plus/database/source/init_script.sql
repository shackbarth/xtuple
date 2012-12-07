-- [ START ] 

-- create schema
\i xtincdtpls/schema/xtincdtpls.sql;

-- xtincdtpls trigger functions
\i xtincdtpls/trigger_functions/incdtvertrigger.sql

-- xtincdtpls tables
\i xtincdtpls/tables/prjver.sql
\i xtincdtpls/tables/incdtver.sql

\i priv.sql

-- [ END ]
