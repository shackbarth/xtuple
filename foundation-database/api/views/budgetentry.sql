-- View: api.budgetentry

SELECT dropIfExists('VIEW', 'budgetentry', 'api');


CREATE OR REPLACE VIEW api.budgetentry AS
SELECT budghead_name AS name,
       formatglaccount(accnt_id) AS account,
       period_start AS period_start,
       budgitem_amount AS amount
FROM 
     budgitem, budghead, period, accnt
WHERE
     budgitem_budghead_id = budghead_id 
     AND budgitem_period_id = period_id
     AND budgitem_accnt_id = accnt_id
ORDER BY name, period_start, account;

--Rules
--INSERT

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.budgetentry DO INSTEAD

  INSERT INTO budgitem (
   budgitem_budghead_id,
   budgitem_period_id,
   budgitem_accnt_id,
   budgitem_amount)
  VALUES (
    getbudgheadid(NEW.name),
    getperiodid(NEW.period_start),
    getglaccntid(NEW.account),
    NEW.amount);

--UPDATE

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.budgetentry
    DO INSTEAD

  UPDATE budgitem SET
           budgitem_amount = (NEW.amount)
  WHERE (budgitem_budghead_id = getbudgheadid(OLD.name) 
         AND budgitem_period_id = getperiodid(OLD.period_start)
         AND budgitem_accnt_id = getglaccntid(OLD.account));
         
--DELETE

CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.budgetentry 
    DO INSTEAD

  DELETE FROM budgitem
  WHERE (budgitem_budghead_id=getbudgheadid(OLD.name) 
         AND budgitem_period_id=getperiodid(OLD.period_start)
         AND budgitem_accnt_id=getglaccntid(OLD.account));

ALTER TABLE api.budgetentry OWNER TO "admin";
GRANT ALL ON TABLE api.budgetentry TO "admin";
GRANT ALL ON TABLE api.budgetentry TO xtrole;
COMMENT ON VIEW api.budgetentry IS 'Budget Entry';


