select xt.add_report_definition('XM.Invoice', 0, $${
  "settings": {
    "detailAttribute": "lineItems",
    "defaultFontSize": 12,
    "defaultMarginSize": 30
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
       "definition": "Invoice Logo",
       "options": {"x": 200, "y": 40, "width": 150}
    },
    {
      "definition": [{"text": "_invoice"}],
      "options": {"fontBold": true, "fontSize": 18, "x": 500, "y": 40, "align": "right"}
    },

    {
      "definition": [{"text": "_invoiceDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 60}
    },
    {
      "definition": [{"attr": "invoiceDate"}],
      "options": {"x": 500, "y": 60, "align": "right"}
    },
    {
      "definition": [{"text": "_dueDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 75}
    },
    {
      "definition": [{"attr": "dueDate"}],
      "options": {"x": 500, "y": 75, "align": "right"}
    },
    {
      "definition": [{"text": "_discountDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 90}
    },
    {
      "definition": [{"attr": "discountDate"}],
      "options": {"x": 500, "y": 90, "align": "right"}
    },
    {
      "definition": [{"text": "_orderDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 105}
    },
    {
      "definition": [{"attr": "orderDate"}],
      "options": {"x": 500, "y": 105, "align": "right"}
    },
    {
      "definition": [{"text": "_terms", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 120}
    },
    {
      "definition": [{"attr": "terms.description"}],
      "options": {"x": 475, "y": 120, "align": "right"}
    },

    {
      "definition": [{"text": "_orderNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 180}
    },
    {
      "definition": [{"attr": "orderNumber"}],
      "options": {"x": 200, "y": 180}
    },
    {
      "definition": [{"text": "_invoiceNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 195}
    },
    {
      "definition": [{"attr": "number"}],
      "options": {"x": 200, "y": 195}
    },
    {
      "definition": [{"text": "_purchaseOrderNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 210}
    },
    {
      "definition": [{"attr": "customerPurchaseOrderNumber"}],
      "options": {"x": 200, "y": 210}
    },
    {
      "definition": [{"text": "_customerNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 225}
    },
    {
      "definition": [{"attr": "customer.number"}],
      "options": {"x": 200, "y": 225}
    },
    {
      "definition": [{"text": "_billto", "label": true}],
      "options": {"x": 0, "y": 280, "fontBold": true}
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
      "options": {"x": 120, "y": 280, "width": 250}
    },
    {"element": "newline"},
    {"element": "bandLine", "size": 2},
    {"element": "fontBold"},
    {
      "element": "band",
      "definition": [
        {"text": "_quantity", "width": 100},
        {"text": "_uom", "width": 50},
        {"text": "_item", "width": 100},
        {"text": "_currency", "width": 80},
        {"text": "_unitPrice", "width": 100},
        {"text": "_extendedPrice", "width": 100}
      ],
      "options": {"border": 0, "width": 0}
    },
    {"element": "bandLine", "size": 2},
    {"element": "fontNormal"}
  ],
  "detailElements": [
    {
      "element": "band",
      "definition": [
        {"attr": "lineItems*quantity", "width": 100},
        {"attr": "lineItems*quantityUnit", "width": 50},
        {"attr": "lineItems*item.number", "width": 100},
        {"attr": "currency", "width": 80},
        {"attr": "lineItems*price", "width": 100},
        {"attr": "lineItems*extendedPrice", "width": 100}
      ],
      "options": {"border": 0, "width": 0, "wrap": 1}
    },
    {
      "definition:": [
        {"attr": "notes", "label": true}
      ]
    }
  ],
  "footerElements": [
    {"element": "newline"},
    {"element": "newline"},
    {"element": "bandLine", "size": 2},
    {
      "definition": [
        {"attr": "subtotal", "label": true},
        {"attr": "taxTotal", "label": true},
        {"attr": "total", "label": true}
      ],
      "options": {"align": "right", "x": 0, "y": 0}
    },
    {"element": "newline"},
    {"element": "standardHeader"}
  ]
}$$);
