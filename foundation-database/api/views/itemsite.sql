-- Item Site

SELECT dropIfExists('VIEW', 'itemsite', 'api');
CREATE VIEW api.itemsite
AS 
   SELECT
     item_number::varchar AS item_number,
     warehous_code::varchar AS site,
     itemsite_active AS active,
     itemsite_wosupply AS wo_supplied_at_site,
     itemsite_createwo AS create_wos,
     itemsite_posupply AS po_supplied_at_site,
     itemsite_createpr AS create_prs,
     itemsite_createsopr AS create_soprs,
     itemsite_createsopo AS create_sopos,
     itemsite_dropship AS dropship,
     itemsite_sold AS sold_from_site,
     itemsite_soldranking AS ranking,
     CASE
       WHEN itemsite_costmethod = 'N' THEN
         'None'
       WHEN itemsite_costmethod = 'A' THEN
         'Average'
       WHEN itemsite_costmethod = 'S' THEN
         'Standard'
       WHEN itemsite_costmethod = 'J' THEN
         'Job'
     END AS cost_method,     
     CASE
       WHEN itemsite_controlmethod = 'N' THEN
         'None'
       WHEN itemsite_controlmethod = 'R' THEN
         'Regular'
       WHEN itemsite_controlmethod = 'S' THEN
         'Serial #'
       WHEN itemsite_controlmethod = 'L' THEN
         'Lot #'
     END AS control_method,
     plancode_code AS planner_code,
     costcat_code AS cost_category,
     itemsite_stocked AS stocked,
     itemsite_abcclass AS abc_class,
     itemsite_autoabcclass AS allow_automatic_updates,
     itemsite_cyclecountfreq AS cycl_cnt_freq,
     itemsite_eventfence AS event_fence,
     itemsite_loccntrl AS multiple_location_control,
     formatlocationname(itemsite_location_id) AS location,
     formatlocationname(itemsite_recvlocation_id) AS receive_location,
     formatlocationname(itemsite_issuelocation_id) AS issue_location,
     itemsite_location_dist AS auto_distr_location,
     itemsite_recvlocation_dist AS auto_distr_receive_location,
     itemsite_issuelocation_dist AS auto_distr_issue_location,
     itemsite_location AS user_defined_location,
     itemsite_location_comments AS location_comment,
     itemsite_disallowblankwip AS disallow_blank_wip_locations,
     itemsite_useparams AS enforce_order_parameters,
     itemsite_reorderlevel AS reorder_level,
     itemsite_ordertoqty AS order_up_to,
     itemsite_minordqty AS minimum_order,
     itemsite_maxordqty AS maximum_order,
     itemsite_multordqty AS order_multiple,
     itemsite_useparamsmanual AS enforce_on_manual_orders,
     CASE
       WHEN itemsite_planning_type = 'N' THEN
         'None'
       WHEN itemsite_planning_type = 'M' THEN
         'MRP'
       WHEN itemsite_planning_type = 'S' THEN
         'MPS'
     END AS planning_system,
     itemsite_ordergroup AS group_mps_mrp_orders,
     itemsite_ordergroup_first AS first_group,
     itemsite_mps_timefence AS mps_time_fence,
     itemsite_leadtime AS lead_time,
     itemsite_safetystock AS safety_stock,
     COALESCE( (SELECT warehous_code
                FROM itemsite supplysite JOIN whsinfo ON (warehous_id=supplysite.itemsite_warehous_id)
                WHERE supplysite.itemsite_id=itemsite.itemsite_supply_itemsite_id), 'None') AS supplied_from_site,
     itemsite_notes AS notes,
     itemsite_perishable AS perishable,
     itemsite_warrpurc AS require_warranty,
     itemsite_autoreg AS auto_register
   FROM itemsite JOIN item ON (item_id=itemsite_item_id)
                 JOIN plancode ON (plancode_id=itemsite_plancode_id)
                 JOIN costcat ON (costcat_id=itemsite_costcat_id)
                 JOIN whsinfo ON (warehous_id=itemsite_warehous_id);

GRANT ALL ON TABLE api.itemsite TO xtrole;
COMMENT ON VIEW api.itemsite IS 'Item Site';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemsite DO INSTEAD

INSERT INTO itemsite (
     itemsite_item_id,
     itemsite_warehous_id,
     itemsite_active,
     itemsite_dropship,
     itemsite_posupply,
     itemsite_createpr,
     itemsite_wosupply,
     itemsite_createwo,
     itemsite_createsopr,
     itemsite_createsopo,
     itemsite_sold,
     itemsite_soldranking,
     itemsite_costmethod,
     itemsite_controlmethod,
     itemsite_perishable,
     itemsite_plancode_id,
     itemsite_costcat_id,
     itemsite_loccntrl,
     itemsite_location_id,
     itemsite_recvlocation_id,
     itemsite_issuelocation_id,
     itemsite_location_dist,
     itemsite_recvlocation_dist,
     itemsite_issuelocation_dist,
     itemsite_location,
     itemsite_location_comments,
     itemsite_disallowblankwip,
     itemsite_stocked,
     itemsite_abcclass,
     itemsite_autoabcclass,
     itemsite_cyclecountfreq,
     itemsite_eventfence,
     itemsite_useparams,
     itemsite_reorderlevel,
     itemsite_ordertoqty,
     itemsite_minordqty,
     itemsite_maxordqty,
     itemsite_multordqty,
     itemsite_useparamsmanual,
     itemsite_ordergroup,
     itemsite_ordergroup_first,
     itemsite_mps_timefence,
     itemsite_leadtime,
     itemsite_safetystock,
     itemsite_supply_itemsite_id,
     itemsite_notes,
     itemsite_qtyonhand,
     itemsite_warrpurc,
     itemsite_autoreg,
     itemsite_freeze,
     itemsite_value,
     itemsite_planning_type)
     VALUES (
       getItemId(NEW.item_number),
       getWarehousId(NEW.site,'ACTIVE'),
       COALESCE(NEW.active,TRUE),
       COALESCE(NEW.dropship,FALSE),
       COALESCE(NEW.po_supplied_at_site,FALSE),
       COALESCE(NEW.create_prs,FALSE),
       COALESCE(NEW.wo_supplied_at_site,FALSE),
       COALESCE(NEW.create_wos,FALSE),
       COALESCE(NEW.create_soprs,FALSE),
       COALESCE(NEW.create_sopos,FALSE),
       COALESCE(NEW.sold_from_site,TRUE),
       COALESCE(NEW.ranking,1),
       CASE
         WHEN NEW.cost_method = 'None' THEN
           'N'
         WHEN NEW.cost_method = 'Average' THEN
           'A'
         WHEN NEW.cost_method = 'Standard' THEN
           'S'
         WHEN NEW.cost_method = 'Job' THEN
           'J'
       END,
       CASE
         WHEN NEW.control_method = 'None' THEN
           'N'
         WHEN NEW.control_method = 'Regular' THEN
           'R'
         WHEN NEW.control_method = 'Serial #' THEN
           'S'
         WHEN NEW.control_method = 'Lot #' THEN
           'L'
       END,
       COALESCE(NEW.perishable,FALSE),
       getPlanCodeId(NEW.planner_code),
       getCostCatId(NEW.cost_category),
       COALESCE(NEW.multiple_location_control,FALSE),
       COALESCE(getLocationId(NEW.site,NEW.location),-1),
       COALESCE(getLocationId(NEW.site,NEW.receive_location),-1),
       COALESCE(getLocationId(NEW.site,NEW.issue_location),-1),
       COALESCE(NEW.auto_distr_location,FALSE),
       COALESCE(NEW.auto_distr_receive_location,FALSE),
       COALESCE(NEW.auto_distr_issue_location,FALSE),
       COALESCE(NEW.user_defined_location,''),
       COALESCE(NEW.location_comment,''),
       COALESCE(NEW.disallow_blank_wip_locations,FALSE),
       COALESCE(NEW.stocked,FALSE),
       COALESCE(NEW.abc_class,'A'),
       COALESCE(NEW.allow_automatic_updates,FALSE),
       COALESCE(NEW.cycl_cnt_freq,0),
       COALESCE(NEW.event_fence,fetchMetricValue('DefaultEventFence')),
       COALESCE(NEW.enforce_order_parameters,FALSE),
       COALESCE(NEW.reorder_level,0),
       COALESCE(NEW.order_up_to,0),
       COALESCE(NEW.minimum_order,0),
       COALESCE(NEW.maximum_order,0),
       COALESCE(NEW.order_multiple,0),
       COALESCE(NEW.enforce_on_manual_orders,FALSE),
       COALESCE(NEW.group_mps_mrp_orders,0),
       COALESCE(NEW.first_group,FALSE),
       COALESCE(NEW.mps_time_fence,0),
       COALESCE(NEW.lead_time,0),
       COALESCE(NEW.safety_stock,0),
       CASE
         WHEN NEW.supplied_from_site = 'None' THEN
           NULL
         WHEN NEW.supplied_from_site = '' THEN
           NULL
         ELSE
           getItemsiteId(NEW.supplied_from_site, NEW.item_number)
       END,
       COALESCE(NEW.notes,''),
       0,
       COALESCE(NEW.require_warranty,FALSE),
       COALESCE(NEW.auto_register,FALSE),
       false,
       0,
       CASE
         WHEN NEW.planning_system = 'None' THEN
           'N'
         WHEN NEW.planning_system = 'MPS' THEN
           'S'
         ELSE
           'M'
       END );

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemsite DO INSTEAD

UPDATE itemsite SET 
     itemsite_active=NEW.active,
     itemsite_dropship=NEW.dropship,
     itemsite_posupply=NEW.po_supplied_at_site,
     itemsite_createpr=NEW.create_prs,
     itemsite_wosupply=NEW.wo_supplied_at_site,
     itemsite_createwo=NEW.create_wos,
     itemsite_createsopr=NEW.create_soprs,
     itemsite_createsopo=NEW.create_sopos,
     itemsite_sold=NEW.sold_from_site,
     itemsite_soldranking=NEW.ranking,
     itemsite_costmethod=
       CASE
         WHEN NEW.cost_method = 'None' THEN
           'N'
         WHEN NEW.cost_method = 'Average' THEN
           'A'
         WHEN NEW.cost_method = 'Standard' THEN
           'S'
         WHEN NEW.cost_method = 'Job' THEN
           'J'
       END,
     itemsite_controlmethod=
       CASE
         WHEN NEW.control_method = 'None' THEN
           'N'
         WHEN NEW.control_method = 'Regular' THEN
           'R'
         WHEN NEW.control_method = 'Serial #' THEN
           'S'
         WHEN NEW.control_method = 'Lot #' THEN
           'L'
       END,
     itemsite_perishable=NEW.perishable,
     itemsite_plancode_id=getPlanCodeId(NEW.planner_code),
     itemsite_costcat_id=getCostCatId(NEW.cost_category),
     itemsite_loccntrl=NEW.multiple_location_control,
     itemsite_location_id=
     CASE
       WHEN (NEW.location = 'N/A') THEN
         -1
       ELSE
         getLocationId(NEW.site,NEW.location)
     END,
     itemsite_recvlocation_id=
     CASE
       WHEN (NEW.receive_location = 'N/A') THEN
         -1
       ELSE
         getLocationId(NEW.site,NEW.receive_location)
     END,
     itemsite_issuelocation_id=
     CASE
       WHEN (NEW.issue_location = 'N/A') THEN
         -1
       ELSE
         getLocationId(NEW.site,NEW.issue_location)
     END,
     itemsite_location_dist=NEW.auto_distr_location,
     itemsite_recvlocation_dist=NEW.auto_distr_receive_location,
     itemsite_issuelocation_dist=NEW.auto_distr_issue_location,
     itemsite_location=NEW.user_defined_location,
     itemsite_location_comments=NEW.user_defined_location,
     itemsite_disallowblankwip=NEW.disallow_blank_wip_locations,
     itemsite_stocked=NEW.stocked,
     itemsite_abcclass=NEW.abc_class,
     itemsite_autoabcclass=NEW.allow_automatic_updates,
     itemsite_cyclecountfreq=NEW.cycl_cnt_freq,
     itemsite_eventfence=NEW.event_fence,
     itemsite_useparams=NEW.enforce_order_parameters,
     itemsite_reorderlevel=NEW.reorder_level,
     itemsite_ordertoqty=NEW.order_up_to,
     itemsite_minordqty=NEW.minimum_order,
     itemsite_maxordqty=NEW.maximum_order,
     itemsite_multordqty=NEW.order_multiple,
     itemsite_useparamsmanual=NEW.enforce_on_manual_orders,
     itemsite_ordergroup=NEW.group_mps_mrp_orders,
     itemsite_ordergroup_first=NEW.first_group,
     itemsite_mps_timefence=NEW.mps_time_fence,
     itemsite_leadtime=NEW.lead_time,
     itemsite_safetystock=NEW.safety_stock,
     itemsite_supply_itemsite_id=
       CASE
         WHEN NEW.supplied_from_site = 'None' THEN
           NULL
         WHEN NEW.supplied_from_site = '' THEN
           NULL
         ELSE
           getItemsiteId(NEW.supplied_from_site, NEW.item_number)
       END,
     itemsite_notes=NEW.notes,
     itemsite_warrpurc=NEW.require_warranty,
     itemsite_autoreg=NEW.auto_register,
     itemsite_planning_type=
       CASE
         WHEN NEW.planning_system = 'None' THEN
           'N'
         WHEN NEW.planning_system = 'MPS' THEN
           'S'
         ELSE
           'M'
       END
   WHERE (itemsite_id=getItemSiteId(OLD.site,OLD.item_number));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemsite DO INSTEAD

   SELECT deleteitemsite(getItemSiteId(OLD.site,OLD.item_number));
