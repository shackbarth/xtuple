select xt.add_report_definition('XM.Invoice', 0, $${
  "settings": {
    "detailAttribute": "lineItems",
    "defaultFontSize": 14
  },
  "headerElements": [
    {
      "definition": [{"text": "_invoice"}],
      "options": {"fontBold": true, "fontSize": 18, "x": 0, "y": 0, "align": "right"}
    },
    {"element": "fontSize", "size": 12},
    {
      "definition": [
        {"attr": "invoiceDate", "label": true},
        {"attr": "dueDate", "label": true},
        {"attr": "discountDate", "label": true},
        {"attr": "terms.description", "label": "_terms"},
        {"attr": "orderDate", "label": true}
      ],
      "options": {"x": 0, "y": 0, "align": "right"}
    },
    {"element": "newline"},
    {"element": "newline"},
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
      "options": {"fontBold": true, "x": 0, "y": 200}
    },
    {
      "definition": [{"attr": "number"}],
      "options": {"x": 200, "y": 200}
    },
    {
      "definition": [{"text": "_purchaseOrderNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 220}
    },
    {
      "definition": [{"attr": "customerPurchaseOrderNumber"}],
      "options": {"x": 200, "y": 220}
    },
    {
      "definition": [{"text": "_customerNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 240}
    },
    {
      "definition": [{"attr": "customer.number"}],
      "options": {"x": 200, "y": 240}
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
