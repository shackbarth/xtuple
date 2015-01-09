-- table definition

select xt.create_table('pkgcmd', 'xt', false, 'cmd');

ALTER TABLE xt.pkgcmd DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgcmdaftertrigger ON xt.pkgcmd;
CREATE TRIGGER pkgcmdaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkgcmd FOR EACH ROW EXECUTE PROCEDURE _pkgcmdaftertrigger();
DROP TRIGGER IF EXISTS pkgcmdaltertrigger ON xt.pkgcmd;
CREATE TRIGGER pkgcmdaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgcmd FOR EACH ROW EXECUTE PROCEDURE _pkgcmdaltertrigger();
DROP TRIGGER IF EXISTS pkgcmdbeforetrigger ON xt.pkgcmd;
CREATE TRIGGER pkgcmdbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgcmd FOR EACH ROW EXECUTE PROCEDURE _pkgcmdbeforetrigger();
ALTER TABLE xt.pkgcmd DROP CONSTRAINT IF EXISTS pkgcmd_pkey CASCADE;
ALTER TABLE xt.pkgcmd ADD CONSTRAINT pkgcmd_pkey PRIMARY KEY(cmd_id);
