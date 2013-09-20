{
  "name": "inventory",
  "comment": "Inventory extension",
  "loadOrder": 70,
  "databaseScripts": [
    "public/tables/itemloc.sql",
    "public/tables/locitem.sql",
    "xt/functions/shipment_value.sql",
    "xt/views/coitemship.sql",
    "xt/views/itemsitedtl.sql",
    "xt/views/locitemsite.sql",
    "xt/views/shipheadinfo.sql",
    "xt/views/shipmentline.sql",
    "xm/javascript/inventory.sql"
  ]
}
