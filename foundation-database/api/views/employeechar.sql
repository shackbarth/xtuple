SELECT dropIfExists('VIEW', 'employeechar', 'api');
CREATE VIEW api.employeechar
AS
   SELECT
     emp_code::varchar AS employee_code,
     char_name::varchar AS characteristic,
     charass_value AS value
   FROM emp, char, charass
   WHERE (('EMP'=charass_target_type)
   AND (emp_id=charass_target_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.employeechar TO xtrole;
COMMENT ON VIEW api.employeechar IS 'Employee Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.employeechar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'EMP',
    getEmpId(NEW.employee_code),
    getCharId(NEW.characteristic,'EMP'),
    NEW.value,
    false);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.employeechar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value
  WHERE ((charass_target_type='EMP')
  AND (charass_target_id=getEmpId(OLD.employee_code))
  AND (charass_char_id=getCharId(OLD.characteristic,'EMP')));

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.employeechar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='EMP')
  AND (charass_target_id=getEmpId(OLD.employee_code))
  AND (charass_char_id=getCharId(OLD.characteristic,'EMP')));
