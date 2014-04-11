-- Pricing Schedule Assignemnts

SELECT dropIfExists('VIEW', 'pricingscheduleassign', 'api');
CREATE OR REPLACE VIEW api.pricingscheduleassign 
AS 
  SELECT 
    COALESCE(cust_number,'Any')::VARCHAR AS customer_number,
    COALESCE(shipto_num, 'Any')::VARCHAR AS customer_shipto,
    COALESCE(ipsass_shipto_pattern,'N/A')::VARCHAR AS customer_shipto_pattern,
    COALESCE(custtype_code,'N/A')::VARCHAR AS customer_type,
    COALESCE(ipsass_custtype_pattern,'N/A')::VARCHAR AS customer_type_pattern,
    ipshead_name::VARCHAR AS pricing_schedule
  FROM ipshead JOIN ipsass ON (ipshead_id=ipsass_ipshead_id)
    LEFT OUTER JOIN custinfo ON (ipsass_cust_id=cust_id)
    LEFT OUTER JOIN custtype ON (ipsass_custtype_id=custtype_id)
    LEFT OUTER JOIN shiptoinfo ON (ipsass_shipto_id=shipto_id)
  ORDER BY customer_number, customer_shipto, customer_type, customer_type_pattern, pricing_schedule;
    
    

GRANT ALL ON TABLE api.pricingscheduleassign TO xtrole;
COMMENT ON VIEW api.pricingscheduleassign IS 'Pricing Schedule Assignments';

-- Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.pricingscheduleassign DO INSTEAD  
  
  INSERT INTO ipsass (
    ipsass_ipshead_id, 
    ipsass_cust_id,
    ipsass_custtype_id,
    ipsass_custtype_pattern,
    ipsass_shipto_id,
    ipsass_shipto_pattern) 
  VALUES (
    getIpsheadId(new.pricing_schedule),
    CASE
      WHEN (new.customer_number='Any') THEN
        -1
      ELSE
        getCustId(new.customer_number)
    END,
    CASE
      WHEN (new.customer_type='N/A') THEN
        -1
      ELSE
        getCusttypeId(new.customer_type)
    END,
    new.customer_type_pattern,
    CASE
      WHEN (new.customer_number='Any' OR new.customer_shipto='Any') THEN
        -1
      ELSE
        getShiptoId(new.customer_number,new.customer_shipto)
    END,
    new.customer_shipto_pattern);

CREATE OR REPLACE RULE "_UPDATE" AS
  ON UPDATE TO api.pricingscheduleassign DO INSTEAD  

  UPDATE ipsass SET
    ipsass_ipshead_id=getIpsheadId(new.pricing_schedule),
    ipsass_cust_id=      
    CASE
      WHEN (new.customer_number='Any') THEN
        -1
      ELSE
        getCustId(new.customer_number)
    END,
    ipsass_custtype_id=
    CASE
      WHEN (new.customer_type='N/A') THEN
        -1
      ELSE
        getCusttypeId(new.customer_type)
    END,
    ipsass_custtype_pattern=new.customer_type_pattern,
    ipsass_shipto_id=
    CASE
      WHEN (new.customer_number='Any' OR new.customer_shipto='Any') THEN
        -1
      ELSE
        getShiptoId(new.customer_number,new.customer_shipto)
    END,
    ipsass_shipto_pattern=new.customer_shipto_pattern
  WHERE ((ipsass_ipshead_id=getIpsheadId(old.pricing_schedule))
    AND (ipsass_cust_id=
      CASE
        WHEN (old.customer_number='Any') THEN
          -1
        ELSE
          getCustId(old.customer_number)
      END)
    AND (ipsass_custtype_id=
      CASE
        WHEN (old.customer_type='N/A') THEN
          -1
        ELSE
          getCusttypeId(old.customer_type)
      END)
    AND (ipsass_custtype_pattern=old.customer_type_pattern)
    AND (ipsass_shipto_id=
      CASE
        WHEN (old.customer_shipto='Any') THEN
          -1
        ELSE
          getShiptoId(old.customer_number,old.customer_shipto)
      END)
    AND (ipsass_shipto_pattern=old.customer_shipto_pattern));

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.pricingscheduleassign DO INSTEAD  

  DELETE FROM ipsass
  WHERE ((ipsass_ipshead_id=getIpsheadId(old.pricing_schedule))
    AND (ipsass_cust_id=
      CASE
        WHEN (old.customer_number='Any') THEN
          -1
        ELSE
          getCustId(old.customer_number)
      END)
    AND (ipsass_custtype_id=
      CASE
        WHEN (old.customer_type='N/A') THEN
          -1
        ELSE
          getCusttypeId(old.customer_type)
      END)
    AND (ipsass_custtype_pattern=old.customer_type_pattern)
    AND (ipsass_shipto_id=
      CASE
        WHEN (old.customer_shipto='Any') THEN
          -1
        ELSE
          getShiptoId(old.customer_number,old.customer_shipto)
      END)
    AND (ipsass_shipto_pattern=old.customer_shipto_pattern));
