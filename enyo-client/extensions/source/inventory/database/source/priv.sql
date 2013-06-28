-- add necessary privs
select xt.js_init();
select xt.add_priv('AccessInventoryExtension', 'Can Access Inventory Extension', 'AccessInventoryExtension', 'Inventory', 'Inventory', 'Inventory', true);
