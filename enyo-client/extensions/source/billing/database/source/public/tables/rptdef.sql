select xt.add_report_definition('XM.Invoice', 0, $${
  "settings": {
    "detailAttribute": "lineItems",
    "defaultFontSize": 14
  },
  "headerElements": [
    {
      "definition": [
        {"text": "Invoice"},
        {"attr": "invoiceDate", "label": true},
        {"attr": "terms", "label": true},
        {"attr": "orderDate", "label": true}
      ],
      "options": {"x": 350, "y": 0, "align": "right"}
    },
    {
      "definition": [{"text": "Customer Number: "}],
      "options": {"fontBold": true, "x": 0, "y": 150}
    },
    {
      "definition": [{"attr": "customer.number"}],
      "options": {"x": 250, "y": 150}
    },
    {
      "definition": [{"text": "Invoice Number: "}],
      "options": {"fontBold": true, "x": 0, "y": 170}
    },
    {
      "definition": [{"attr": "number"}],
      "options": {"x": 250, "y": 170}
    },
    {
      "definition": [
        {"text": "_billto: "}
      ],
      "options": {"x": 1, "y": 200, "width": 100, "fontBold": true, "align": "right"}
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
      "options": {"x": 100, "y": 200, "width": 250}
    },
    {
      "element": "image",
      "definition": "Invoice Logo",
      "options": {"x": 200, "y": 0, "width": 150}
    },
    {
      "element": "fontBold"
    },
    {
      "element": "band",
      "definition": [
        {"text": "Qty. Shipped", "width": 100},
        {"text": "UOM", "width": 50},
        {"text": "Item", "width": 100},
        {"text": "Currency", "width": 80},
        {"text": "Unit Price", "width": 100},
        {"text": "Ext. Price", "width": 100}
      ],
      "options": {"border": 0, "width": 0}
    },
    {
      "element": "fontNormal"
    }
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
      "options": {"border": 1, "width": 0, "wrap": 1}
    }
  ],
  "footerElements": [
    {
      "definition": [
        {"attr": "subtotal", "label": true},
        {"attr": "taxTotal", "label": true},
        {"attr": "total", "label": true}
      ],
      "options": {"align": "right"}
    }
  ]
}$$);
