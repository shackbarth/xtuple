select xt.add_report_definition('XM.PurchaseOrder', 0, $${
  "settings": {
    "detailAttribute": "lineItems",
    "defaultFontSize": 12,
    "defaultMarginSize": 20
  },
  "headerElements": [
    {
      "definition": [
        {"attr": "remitto.name"},
        {"attr": "remitto.address"}
      ],
      "options": {"x": 0, "y": 40}
    },
    {
      "element": "image",
      "definition": "Logo",
      "options": {"x": 200, "y": 40, "width": 150}
    },
    {
      "definition": [{"text": "_orderDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 60}
    },
    {
      "definition": [{"text": "_purchaseOrder"}],
      "options": {"fontBold": true, "fontSize": 18, "x": 450, "y": 40, "align": "right"}
    },
    {
      "definition": [{"attr": "orderDate"}],
      "options": {"x": 500, "y": 60, "align": "right"}
    },
    {
      "definition": [{"text": "_orderNumber", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 75}
    },
    {
      "definition": [{"attr": "number"}],
      "options": {"x": 500, "y": 75, "align": "right"}
    },
    {
      "definition": [{"text": "_to", "label": true}],
      "options": {"x": 50, "y": 140, "fontBold": true}
    },
    {
      "definition": [
        {"attr": "vendorContactFirstName"},
        {"attr": "vendorContactLastName"},
        {"attr": "vendorContactHonorific"}
      ],
      "transform": "fullname",
      "options": {"x": 50, "y": 160, "width": 250}
    },
    {
      "definition": [
        {"attr": "vendorContact"},
        {"attr": "vendorAddress1"},
        {"attr": "vendorAddress2"},
        {"attr": "vendorAddress3"},
        {"attr": "vendorCity"},
        {"attr": "vendorState"},
        {"attr": "vendorPostalCode"},
        {"attr": "vendorCountry"},
        {"attr": "vendorPhone"}
      ],
      "transform": "address",
      "options": {"x": 50, "y": 170, "width": 250}
    },
    {
      "definition": [{"text": "_shipTo", "label": true}],
      "options": {"x": 350, "y": 140, "fontBold": true}
    },
    {
      "definition": [
        {"attr": "shiptoContactFirstName"},
        {"attr": "shiptoContactLastName"},
        {"attr": "shiptoContactHonorific"}
      ],
      "transform": "fullname",
      "options": {"x": 350, "y": 160, "width": 250}
    },
    {
      "definition": [
        {"attr": "shiptoName"},
        {"attr": "shiptoAddress1"},
        {"attr": "shiptoAddress2"},
        {"attr": "shiptoAddress3"},
        {"attr": "shiptoCity"},
        {"attr": "shiptoState"},
        {"attr": "shiptoPostalCode"},
        {"attr": "shiptoCountry"},
        {"attr": "shiptoPhone"}
      ],
      "transform": "address",
      "options": {"x": 350, "y": 170, "width": 250}
    },
    {
      "definition": [{"text": "_fob", "label": true}],
      "options": {"fontBold": true, "x": 50, "y": 230}
    },
    {
      "definition": [{"attr": "fob"}],
      "options": {"x": 50, "y": 245}
    },
    {
      "definition": [{"text": "_shipVia", "label": true}],
      "options": {"fontBold": true, "x": 175, "y": 230}
    },
    {
      "definition": [{"attr": "shipVia"}],
      "options": {"x": 175, "y": 245}
    },
    {
      "definition": [{"text": "_terms", "label": true}],
      "options": {"fontBold": true, "x": 300, "y": 230}
    },
    {
      "definition": [{"attr": "terms.description"}],
      "options": {"x": 300, "y": 245}
    },
    {"element": "fontBold"},
    {
      "element": "band",
      "definition": [
        {"text": "_item", "width": 90},
        {"text": "_vendorItem", "width": 100},
        {"text": "_description", "width": 100},
        {"text": "_ordered", "width": 60},
        {"text": "_uom", "width": 45},
        {"text": "_unitPrice", "width": 90},
        {"text": "_extendedPrice", "width": 100}
      ],
      "options": {"border": 0, "padding": 5, "x": 0, "y": 300}
    },
    {"element": "bandLine", "size": 2}
  ],
  "detailElements": [
    {"element": "fontNormal"},
    {
      "element": "band",
      "definition": [
        {"attr": "lineItems*vendorItemNumber", "width": 90},
        {"attr": "lineItems*item.number", "width": 100},
        {"attr": "lineItems*item.description1", "width": 100},
        {"attr": "lineItems*quantity", "width": 60},
        {"attr": "lineItems*vendorUnit", "width": 45},
        {"attr": "lineItems*price", "width": 90},
        {"attr": "lineItems*extendedPrice", "width": 100}
      ],
      "options": {"fontBold": true, "border": 0, "padding": 14}
    }
  ],
  "footerElements": [
    {"element": "bandLine", "size": 2},
    {
      "definition": [
        {"attr": "subtotal", "label": true},
        {"attr": "freight", "label": true},
        {"attr": "taxTotal", "label": true},
        {"attr": "total", "label": true}
      ],
      "options": {"fontBold": true, "fontSize": 14, "width": 550, "align": "right"}
    }
  ],
  "pageFooterElements": [
    {
      "element": "pageNumber", "definition": [],
      "options": {"align": "center"}
    }
  ]
}$$);
