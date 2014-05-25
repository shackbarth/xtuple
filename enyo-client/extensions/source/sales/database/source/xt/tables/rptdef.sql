select xt.add_report_definition('XM.SalesOrder', 0, $${
  "settings": {
    "detailAttribute": "lineItems",
    "defaultFontSize": 12,
    "defaultMarginSize": 20
  },
  "headerElements": [
    {
      "element": "image",
      "definition": "Logo",
      "options": {"x": 40, "y": 25, "width": 250}
    },
    {
      "definition": [{"text": "_salesOrderAck"}],
      "options": {"fontBold": true, "fontSize": 18, "x": 300, "y": 40, "width": 300, "align": "right"}
    },
    {
      "definition": [{"attr": "number"}],
      "options": {"x": 300, "y": 70, "width": 280, "align": "right"}
    },
    {
      "definition": [{"attr": "orderDate"}],
      "options": {"x": 300, "y": 90, "width": 280, "align": "right"}
    },
    {
      "definition": [{"text": "_customerAddress", "label": true}],
      "options": {"x": 0, "y": 140, "fontBold": true}
    },
    {
      "definition": [
        {"attr": "billtoName"},
        {"attr": "billtoAddress1"},
        {"attr": "billtoAddress2"},
        {"attr": "billtoAddress3"},
        {"attr": "billtoCity"},
        {"attr": "billtoState"},
        {"attr": "billtoPostalCode"},
        {"attr": "billtoCountry"},
        {"attr": "billtoPhone"}
      ],
      "transform": "address",
      "options": {"x": 0, "y": 160, "width": 250}
    },
    {
      "definition": [{"text": "_billTo", "label": true}],
      "options": {"x": 225, "y": 140, "fontBold": true}
    },
    {
      "definition": [
        {"attr": "billtoName"},
        {"attr": "billtoAddress1"},
        {"attr": "billtoAddress2"},
        {"attr": "billtoAddress3"},
        {"attr": "billtoCity"},
        {"attr": "billtoState"},
        {"attr": "billtoPostalCode"},
        {"attr": "billtoCountry"},
        {"attr": "billtoPhone"}
      ],
      "transform": "address",
      "options": {"x": 225, "y": 160, "width": 250}
    },
    {
      "definition": [{"text": "_shipTo", "label": true}],
      "options": {"x": 425, "y": 140, "fontBold": true}
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
      "options": {"x": 425, "y": 160, "width": 250}
    },
    {
      "definition": [{"text": "_purchaseOrderNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 230}
    },
    {
      "definition": [{"attr": "customerPurchaseOrderNumber"}],
      "options": {"x": 0, "y": 245}
    },
    {
      "definition": [{"text": "_terms", "label": true}],
      "options": {"fontBold": true, "x": 150, "y": 230}
    },
    {
      "definition": [{"attr": "terms.description"}],
      "options": {"x": 150, "y": 245}
    },
    {
      "definition": [{"text": "_shipDate", "label": true}],
      "options": {"fontBold": true, "x": 250, "y": 230}
    },
    {
      "definition": [{"attr": "scheduleDate"}],
      "options": {"x": 250, "y": 245}
    },
    {
      "definition": [{"text": "_shipVia", "label": true}],
      "options": {"fontBold": true, "x": 325, "y": 230}
    },
    {
      "definition": [{"attr": "shipVia"}],
      "options": {"x": 325, "y": 245}
    },
    {
      "definition": [{"text": "_fob", "label": true}],
      "options": {"fontBold": true, "x": 500, "y": 230}
    },
    {
      "definition": [{"attr": "fob"}],
      "options": {"x": 500, "y": 245}
    },
    {
      "element": "band",
      "definition": [
        {"text": "_item", "width": 100},
        {"text": "_description", "width": 100},
        {"text": "_ordered", "width": 80},
        {"text": "_balance", "width": 80},
        {"text": "_uom", "width": 50},
        {"text": "_unitPrice", "width": 90},
        {"text": "_amount", "width": 70}
      ],
      "options": {"border": 0, "padding": 5, "x": 0, "y": 325}
    },
    {"element": "bandLine", "size": 2}
  ],
  "detailElements": [
    {"element": "fontNormal"},
    {
      "element": "band",
      "definition": [
        {"attr": "lineItems*item.number", "width": 100},
        {"attr": "lineItems*item.description1", "width": 100},
        {"attr": "lineItems*quantity", "width": 80},
        {"attr": "lineItems*balance", "width": 80},
        {"attr": "lineItems*quantityUnit", "width": 50},
        {"attr": "lineItems*price", "width": 90},
        {"attr": "lineItems*extendedPrice", "width": 70}
      ],
      "options": {"fontBold": true, "border": 0, "padding": 14}
    }
  ],
  "footerElements": [
    {
      "definition": [
        {"attr": "subtotal", "label": true},
        {"attr": "miscCharge", "label": true},
        {"attr": "taxTotal", "label": true},
        {"attr": "total", "label": true},
        {"attr": "balance", "label": true}
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
