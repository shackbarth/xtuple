-- add necessary privs

select xt.add_priv('AccessSalesExtension', 'Can Access Sales Extension', 'AccessSalesExtension', 'Sales', 'sales', 'Sales', true);
