drop view if exists xt.quheadinfo cascade;

create or replace view xt.quheadinfo as

  SELECT  query.*, 
          quhead_subtotal + quhead_tax + quhead_freight + quhead_misc AS quhead_total 
  FROM    (
          SELECT  quhead.*,
                  ( SELECT  SUM(ROUND((quitem_qtyord * quitem_qty_invuomratio) * (quitem_price / quitem_price_invuomratio),2)) AS subtotal
                      FROM  quitem
                     WHERE  (quitem_quhead_id=quhead_id) 
                  )  AS quhead_subtotal,
                  (
                  SELECT  COALESCE(SUM(tax),0.0) AS tax 
                  FROM    (
                          SELECT  ROUND(SUM(taxdetail_tax),2) AS tax 
                          FROM    tax 
                                  JOIN calculateTaxDetailSummary('Q', quhead_id, 'T') ON (taxdetail_tax_id=tax_id)
                          GROUP BY tax_id
                          ) AS data
                  )  AS quhead_tax
  FROM    quhead
          ) query;
          
revoke all on xt.quheadinfo from public;
grant all on table xt.quheadinfo to group xtrole;

