{
  "name": "sales",
  "comment": "Sales extension",
  "loadOrder": 20,
  "databaseScripts": [
    "xt/trigger_functions/refresh_cohead_share_users_cache.sql",
    "xt/trigger_functions/refresh_custinfo_share_users_cache.sql",
    "xt/trigger_functions/refresh_shiptoinfo_share_users_cache.sql",
    "public/tables/cohead.sql",
    "public/tables/custinfo.sql",
    "public/tables/shiptoinfo.sql",
    "xt/tables/acttype.sql",
    "xt/tables/rptdef.sql",
    "xt/views/share_users_cohead.sql",
    "xt/views/share_users_cust.sql",
    "xt/views/share_users_cust_cntct.sql",
    "xt/views/share_users_shipto.sql",
    "xt/views/share_users_shipto_cntct.sql",
    "xt/views/share_users_shipto_addr.sql",
    "xt/views/share_users_shipto_cust.sql",
    "xt/tables/sharetype.sql",
    "xt/tables/wftype.sql"
  ]
}
