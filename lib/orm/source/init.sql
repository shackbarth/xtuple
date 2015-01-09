--
-- This script creates the group xtrole and the user admin
--

--
-- Create the xtrole group
--
CREATE GROUP xtrole;

--
-- Create the admin user with createdb and createuser
-- permissions.  Place the user in the xtrole group and
-- set the password to the default of admin.
--
CREATE USER admin WITH PASSWORD 'admin'
                       CREATEDB CREATEUSER
                       IN GROUP xtrole;
