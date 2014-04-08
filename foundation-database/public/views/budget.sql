SELECT dropIfExists('VIEW', 'budget');
CREATE VIEW budget AS
  SELECT budgitem_id AS budget_id,
         budgitem_period_id AS budget_period_id,
         budgitem_accnt_id AS budget_accnt_id,
         budgitem_amount AS budget_amount
    FROM budgitem;
REVOKE ALL ON TABLE budget FROM PUBLIC;
GRANT  ALL ON TABLE budget TO   GROUP xtrole;

