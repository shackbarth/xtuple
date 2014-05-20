--Customer Tax Registration View

SELECT dropIfExists('VIEW', 'customertaxreg', 'api');
CREATE OR REPLACE VIEW api.customertaxreg AS

SELECT
  cust_number::varchar AS customer_number,
  COALESCE(taxzone_code, 'Any')::varchar AS tax_zone,
  taxauth_code::varchar AS tax_authority,
  taxreg_number AS registration_number,
  CASE WHEN
    taxreg_effective = startoftime() THEN
      'Always'
    ELSE
      formatdate(taxreg_effective)
  END AS start_date,
  CASE WHEN
    taxreg_expires = endoftime() THEN
      'Never'
    ELSE
      formatdate(taxreg_expires)
  END AS end_date,
  taxreg_notes AS notes
FROM taxreg
     LEFT OUTER JOIN custinfo ON (cust_id=taxreg_rel_id)
     LEFT OUTER JOIN taxauth ON (taxauth_id=taxreg_taxauth_id)
     LEFT OUTER JOIN taxzone ON (taxzone_id=taxreg_taxzone_id)
WHERE (taxreg_rel_type='C')
ORDER BY cust_number, taxreg_number;

GRANT ALL ON TABLE api.customertaxreg TO xtrole;
COMMENT ON VIEW api.customertaxreg IS 'Customer Tax Registrations';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.customertaxreg DO INSTEAD

INSERT INTO taxreg (
  taxreg_rel_id,
  taxreg_rel_type,
  taxreg_taxauth_id,
  taxreg_taxzone_id,
  taxreg_number,
  taxreg_effective,
  taxreg_expires,
  taxreg_notes )
VALUES (
  getCustId(NEW.customer_number),
  'C',
  getTaxauthId(NEW.tax_authority),
  (SELECT cust_taxzone_id
   FROM custinfo
   WHERE cust_id=getCustId(NEW.customer_number)),
  COALESCE(NEW.registration_number,''),
  CASE WHEN (NEW.start_date = 'Always') THEN startoftime()
       ELSE COALESCE(NEW.start_date::date,startoftime())
  END, 
  CASE WHEN (NEW.end_date = 'Never') THEN endoftime()
       ELSE COALESCE(NEW.end_date::date,endoftime())
  END,
  NEW.notes );
