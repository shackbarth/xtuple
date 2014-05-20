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
      "definition": [{"text": "_purchaseOrder"}],
      "options": {"fontBold": true, "fontSize": 18, "x": 450, "y": 40, "align": "right"}
    },
    {
      "definition": [{"text": "_orderDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 60}
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
      "definition": [{"text": "_billto", "label": true}],
      "options": {"x": 0, "y": 150, "fontBold": true}
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
      "options": {"x": 120, "y": 150, "width": 250}
    },
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
      "options": {"border": 0, "padding": 5, "x": 0, "y": 325}
    },
    {"element": "bandLine", "size": 2}
  ],
  "detailElements": [
  ],
  "footerElements": [
  ],
  "pageFooterElements": [
    {
      "element": "pageNumber", "definition": [],
      "options": {"align": "center"}
    }
  ]
}$$);
