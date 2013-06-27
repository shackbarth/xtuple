select xt.create_view('xt.cohistinfo', $$

SELECT *,
round(cohist_qtyshipped * cohist_unitprice, 2) AS cohist_extprice
FROM cohist;

$$, false);
