-- Item Cost

SELECT dropIfExists('VIEW', 'itemcost', 'api');
CREATE OR REPLACE VIEW api.itemcost
AS 
  SELECT item.item_number::character varying(100) AS item_number,
         costelem.costelem_type::character varying(100) AS costing_element,
         itemcost.itemcost_actcost AS actual_cost,
         curr_symbol.curr_abbr AS currency,
         false AS post_to_standard
  FROM itemcost
       LEFT JOIN item ON (itemcost.itemcost_item_id = item.item_id)
       LEFT JOIN costelem ON (itemcost.itemcost_costelem_id = costelem.costelem_id)
       LEFT JOIN curr_symbol ON (itemcost.itemcost_curr_id = curr_symbol.curr_id)
 ORDER BY item.item_number::character varying(100), costelem.costelem_type::character varying(100);

GRANT ALL ON TABLE api.itemcost TO xtrole;
COMMENT ON VIEW api.itemcost IS 'Item Cost';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.itemcost DO INSTEAD

  SELECT insertItemCost(getItemId(NEW.item_number),
                        getCostElemId(NEW.costing_element),
                        getCurrId(NEW.currency),
                        NEW.actual_cost,
                        NEW.post_to_standard);

CREATE OR REPLACE RULE "_UPDATE" AS 
  ON UPDATE TO api.itemcost DO INSTEAD

  SELECT updateItemCost(getItemId(NEW.item_number),
                        getCostElemId(NEW.costing_element),
                        getCurrId(NEW.currency),
                        NEW.actual_cost,
                        NEW.post_to_standard);

CREATE OR REPLACE RULE "_DELETE" AS 
  ON DELETE TO api.itemcost DO INSTEAD

  SELECT deleteItemCost(getItemId(OLD.item_number),
                        getCostElemId(OLD.costing_element));

