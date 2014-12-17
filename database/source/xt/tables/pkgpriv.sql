-- table definition

select xt.create_table('pkgpriv', 'xt', false, 'priv');

ALTER TABLE xt.pkgpriv DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgprivaftertrigger ON xt.pkgpriv;
CREATE TRIGGER pkgprivaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkgpriv FOR EACH ROW EXECUTE PROCEDURE _pkgprivaftertrigger();
DROP TRIGGER IF EXISTS pkgprivaltertrigger ON xt.pkgpriv;
CREATE TRIGGER pkgprivaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgpriv FOR EACH ROW EXECUTE PROCEDURE _pkgprivaltertrigger();
DROP TRIGGER IF EXISTS pkgprivbeforetrigger ON xt.pkgpriv;
CREATE TRIGGER pkgprivbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgpriv FOR EACH ROW EXECUTE PROCEDURE _pkgprivbeforetrigger();
ALTER TABLE xt.pkgpriv DROP CONSTRAINT IF EXISTS pkgpriv_pkey CASCADE;
ALTER TABLE xt.pkgpriv ADD CONSTRAINT pkgpriv_pkey PRIMARY KEY(priv_id);
