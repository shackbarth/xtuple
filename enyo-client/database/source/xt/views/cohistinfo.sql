select xt.create_view('xt.cohistinfo', $$

SELECT *,
cohist_qtyshipped * cohist_unitprice AS cohist_totalprice
FROM cohist;

$$, false);
