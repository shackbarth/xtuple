create or replace function xt.invc_tax_total(invchead_id integer) returns numeric stable as $$
  SELECT COALESCE(SUM(tax), 0) AS tax 
  FROM (
    SELECT ROUND(SUM(taxdetail_tax),2) AS tax 
    FROM tax 
      JOIN calculateTaxDetailSummary('I', $1, 'T') ON (taxdetail_tax_id=tax_id)
    GROUP BY tax_id
  ) AS data;
$$ language sql;
