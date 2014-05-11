-- View: api.budget

SELECT dropIfExists('VIEW', 'budget', 'api');


CREATE OR REPLACE VIEW api.budget AS
   SELECT 
    budghead_name AS name,
    budghead_descrip AS description
   FROM budghead
   ORDER BY name;

--Rules
--INSERT

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.budget DO INSTEAD

  INSERT INTO budghead (
   budghead_name,
   budghead_descrip)
  VALUES (
    NEW.name,
    NEW.description);

--UPDATE

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.budget 
    DO INSTEAD

  UPDATE budghead SET
    budghead_name=NEW.name,
    budghead_descrip=NEW.description
  WHERE (budghead_name=OLD.name);

--DELETE

CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.budget 
    DO INSTEAD

  DELETE FROM budghead
  WHERE (budghead_name=OLD.name);

ALTER TABLE api.budget OWNER TO "admin";
GRANT ALL ON TABLE api.budget TO "admin";
GRANT ALL ON TABLE api.budget TO xtrole;
COMMENT ON VIEW api.budget IS 'Budget Header';


