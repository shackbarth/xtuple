create or replace function xt.cm_tax_total(cmhead_id integer) returns numeric stable as $$
  SELECT SUM(tax) * -1 AS tax 
  FROM (
    SELECT ROUND(SUM(taxdetail_tax),2) AS tax 
    FROM tax JOIN calculateTaxDetailSummary('CM', $1, 'T') ON (taxdetail_tax_id=tax_id)
    GROUP BY tax_id
  ) AS data;
$$ language sql;
