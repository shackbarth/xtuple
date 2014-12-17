-- table definition

select xt.create_table('pkgreport', 'xt', false, 'report');

ALTER TABLE xt.pkgreport DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgreportaftertrigger ON xt.pkgreport;
CREATE TRIGGER pkgreportaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkgreport FOR EACH ROW EXECUTE PROCEDURE _pkgreportaftertrigger();
DROP TRIGGER IF EXISTS pkgreportaltertrigger ON xt.pkgreport;
CREATE TRIGGER pkgreportaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgreport FOR EACH ROW EXECUTE PROCEDURE _pkgreportaltertrigger();
DROP TRIGGER IF EXISTS pkgreportbeforetrigger ON xt.pkgreport;
CREATE TRIGGER pkgreportbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgreport FOR EACH ROW EXECUTE PROCEDURE _pkgreportbeforetrigger();
ALTER TABLE xt.pkgreport DROP CONSTRAINT IF EXISTS pkgreport_pkey CASCADE;
ALTER TABLE xt.pkgreport ADD CONSTRAINT pkgreport_pkey PRIMARY KEY(report_id);
