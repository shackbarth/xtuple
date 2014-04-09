-- Pricing Schedule

SELECT dropIfExists('VIEW', 'pricingschedule', 'api');
CREATE OR REPLACE VIEW api.pricingschedule 
AS 
  SELECT 
    ipshead_name::VARCHAR AS name, 
    ipshead_descrip AS description, 
    formatdate(ipshead_effective, 'Always') AS effective, 
    formatdate(ipshead_expires, 'Never') AS expires,
    curr_abbr AS currency
  FROM ipshead, curr_symbol
  WHERE (curr_id=ipshead_curr_id);

GRANT ALL ON TABLE api.pricingschedule TO xtrole;
COMMENT ON VIEW api.pricingschedule IS 'Pricing Schedule';

-- Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.pricingschedule DO INSTEAD  
  INSERT INTO ipshead (
    ipshead_id, 
    ipshead_name, 
    ipshead_descrip, 
    ipshead_effective, 
    ipshead_expires,
    ipshead_curr_id, 
    ipshead_updated) 
  VALUES (
    nextval('ipshead_ipshead_id_seq'), 
    new.name, 
    new.description, 
    CASE
      WHEN (new.effective = 'Always') THEN 
        CAST('1970-01-01' AS date)
      ELSE CAST(COALESCE(new.effective,'1970-01-01') AS date)
    END, 
    CASE
      WHEN (new.expires = 'Never') THEN 
        CAST('2100-01-01' AS date)
      ELSE CAST(COALESCE(new.expires,'2100-01-01') AS date)
    END, 
    COALESCE(getCurrId(new.currency),basecurrid()),
    now());

CREATE OR REPLACE RULE "_UPDATE" AS
  ON UPDATE TO api.pricingschedule DO INSTEAD  

  UPDATE ipshead SET 
    ipshead_descrip = new.description, 
    ipshead_effective = 
    CASE
      WHEN new.effective = 'Always' THEN 
        CAST('1970-01-01' AS date)
      ELSE 
        CAST(new.effective AS date)
    END, 
    ipshead_expires = 
    CASE
      WHEN new.expires = 'Never' THEN
        CAST('2100-01-01' AS date)
      ELSE 
        CAST(new.expires AS date)
    END, 
    ipshead_updated = now(),
    ipshead_curr_id=
    CASE
      WHEN (SELECT (COUNT(ipsitem_id) =0)
            FROM ipsiteminfo
            WHERE (ipsitem_ipshead_id=getIpsHeadId(old.name))) THEN
         COALESCE(getCurrId(new.currency),basecurrid())
      ELSE
        getCurrId(old.currency)
     END       
WHERE ipshead_name = old.name;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.pricingschedule DO INSTEAD  

  DELETE FROM ipshead WHERE (old.name = ipshead_name);
