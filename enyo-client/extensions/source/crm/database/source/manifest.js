{
  "name": "crm",
  "comment": "Corporate Relationship Management extension",
  "loadOrder": 10,
  "databaseScripts": [
    "xt/trigger_functions/refresh_addr_share_users_cache.sql",
    "xt/trigger_functions/refresh_cntct_share_users_cache.sql",
    "xt/trigger_functions/refresh_crmacct_share_users_cache.sql",
    "public/tables/addr.sql",
    "public/tables/cntct.sql",
    "public/tables/crmacct.sql",
    "xt/tables/acttype.sql",
    "xt/views/share_users_cntct.sql",
    "xt/views/share_users_addr.sql",
    "xt/tables/sharetype.sql"
  ]
}
