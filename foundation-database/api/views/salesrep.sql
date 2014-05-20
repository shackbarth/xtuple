--Sales Rep View

SELECT dropIfExists('VIEW', 'salesrep', 'api');
CREATE OR REPLACE VIEW api.salesrep AS

SELECT
  salesrep_number::VARCHAR AS number,
  salesrep_active AS active,
  salesrep_name AS name,
  salesrep_commission * 100 AS commission_percent,
  emp_number AS employee
FROM salesrep LEFT OUTER JOIN emp ON (emp_id=salesrep_emp_id)
ORDER BY salesrep_number;

GRANT ALL ON TABLE api.salesrep TO xtrole;
COMMENT ON VIEW api.salesrep IS 'Sales Rep';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.salesrep DO INSTEAD

INSERT INTO salesrep (
  salesrep_active,
  salesrep_number,
  salesrep_name,
  salesrep_commission,
  salesrep_method,
  salesrep_emp_id )
VALUES (
  COALESCE(NEW.active, true),
  COALESCE(NEW.number, ''),
  COALESCE(NEW.name, ''),
  COALESCE(NEW.commission_percent * .01, 0),
  '',
  getEmpId(NEW.employee) );
 
CREATE OR REPLACE RULE "_UPDATE" AS
ON UPDATE TO api.salesrep DO INSTEAD

UPDATE salesrep SET
  salesrep_active=NEW.active,
  salesrep_number=NEW.number,
  salesrep_name=NEW.name,
  salesrep_commission=(NEW.commission_percent * .01),
  salesrep_emp_id=getEmpId(NEW.employee)
  WHERE (salesrep_number=OLD.number);

CREATE OR REPLACE RULE "_DELETE" AS
ON DELETE TO api.salesrep DO INSTEAD

DELETE FROM salesrep WHERE (salesrep_number=OLD.number);
