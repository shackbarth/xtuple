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
    {
      "definition": [
        {"attr": "invoiceDate", "label": true},
        {"attr": "terms", "label": true},
        {"attr": "orderDate", "label": true}
      ],
      "options": {"x": 0, "y": 0, "align": "right"}
    },
    {"element": "newline"},
    {
      "definition": [{"text": "_orderNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 150}
    },
    {
      "definition": [{"attr": "orderNumber"}],
      "options": {"x": 250, "y": 150}
    },
    {
      "definition": [{"text": "_invoice", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 170}
    },
    {
      "definition": [{"attr": "number"}],
      "options": {"x": 250, "y": 170}
    },
    {
      "definition": [{"text": "_custPO", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 190}
    },
    {
      "definition": [{"attr": "customerPurchaseOrderNumber"}],
      "options": {"x": 250, "y": 190}
    },
    {
      "definition": [{"text": "_customer", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 210}
    },
    {
      "definition": [{"attr": "customer.number"}],
      "options": {"x": 250, "y": 210}
    },
    {"element": "newline"},
    {
      "definition": [
        {"text": "_billto", "label": true}
      ],
      "options": {"x": 1, "y": 250, "width": 100, "fontBold": true, "align": "right"}
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
      "options": {"x": 110, "y": 250, "width": 250}
    },
    {"element": "newline"},
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
    {"element": "bandLine"},
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
    {"element": "bandLine", "definition": 3},
    {
      "definition": [
        {"attr": "subtotal", "label": true},
        {"attr": "taxTotal", "label": true},
        {"attr": "total", "label": true}
      ],
      "options": {"align": "right"}
    },
    {"element": "newline"},
    {"element": "standardHeader"}
  ]
}$$);
