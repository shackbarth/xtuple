-- table definition

select xt.create_table('pkguiform', 'xt', false, 'uiform');

ALTER TABLE xt.pkguiform DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkguiformaftertrigger ON xt.pkguiform;
CREATE TRIGGER pkguiformaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkguiform FOR EACH ROW EXECUTE PROCEDURE _pkguiformaftertrigger();
DROP TRIGGER IF EXISTS pkguiformaltertrigger ON xt.pkguiform;
CREATE TRIGGER pkguiformaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkguiform FOR EACH ROW EXECUTE PROCEDURE _pkguiformaltertrigger();
DROP TRIGGER IF EXISTS pkguiformbeforetrigger ON xt.pkguiform;
CREATE TRIGGER pkguiformbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkguiform FOR EACH ROW EXECUTE PROCEDURE _pkguiformbeforetrigger();
ALTER TABLE xt.pkguiform DROP CONSTRAINT IF EXISTS pkguiform_pkey CASCADE;
ALTER TABLE xt.pkguiform ADD CONSTRAINT pkguiform_pkey PRIMARY KEY(uiform_id);
