[
  {
    "context": "crm",
    "nameSpace": "XM",
    "type": "Customer",
    "table": "crmacct",
    "isExtension": true,
    "comment": "Extended by Crm",
    "isChild": true,
    "relations": [
      {
        "column": "crmacct_cust_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "account",
        "toOne": {
          "type": "Account",
          "column": "crmacct_id"
        }
      },
      {
        "name": "contactRelations",
        "toMany": {
          "type": "ContactInfo",
          "column": "crmacct_id",
          "inverse": "account"
        }
      },
      {
        "name": "incidentRelations",
        "toMany": {
          "type": "IncidentInfo",
          "column": "crmacct_id",
          "inverse": "account"
        }
      },
      {
        "name": "opportunitytRelations",
        "toMany": {
          "type": "OpportunityInfo",
          "column": "crmacct_id",
          "inverse": "account"
        }
      },
      {
        "name": "toDoRelations",
        "toMany": {
          "type": "ToDoInfo",
          "column": "crmacct_id",
          "inverse": "account"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "crm",
    "nameSpace": "XM",
    "type": "Vendor",
    "table": "crmacct",
    "isExtension": true,
    "comment": "Extended by Crm",
    "isChild": true,
    "relations": [
      {
        "column": "crmacct_vend_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "account",
        "toOne": {
          "type": "Account",
          "column": "crmacct_id"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "billing",
    "nameSpace": "XM",
    "type": "BankAccount",
    "table": "bankaccnt",
    "isExtension": true,
    "comment": "Extended by Billing",
    "relations": [
      {
        "column": "bankaccnt_id"
      }
    ],
    "properties": [
      {
        "name": "usedByReceivables",
        "attr": {
          "type": "Boolean",
          "column": "bankaccnt_ar"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "billing",
    "nameSpace": "XM",
    "type": "Customer",
    "table": "custinfo",
    "isExtension": true,
    "comment": "Extended by Billing",
    "isChild": true,
    "relations": [
      {
        "column": "cust_id"
      }
    ],
    "properties": [
      {
        "name": "receivables",
        "toMany": {
          "type": "Receivable",
          "column": "cust_id",
          "inverse": "customer"
        }
      },
      {
        "name": "cashReceipts",
        "toMany": {
          "type": "CashReceipt",
          "column": "cust_id",
          "inverse": "customer"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "billing",
    "nameSpace": "XM",
    "type": "Incident",
    "table": "incdt",
    "isExtension": true,
    "comment": "Extended by Billing",
    "relations": [
      {
        "column": "cntct_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "receivable",
        "toOne": {
          "isNested": true,
          "type": "ReceivableInfo",
          "column": "incdt_aropen_id"
        }
      },
      {
        "name": "customers",
        "toMany": {
          "isNested": true,
          "type": "IncidentCustomer",
          "column": "incdt_id",
          "inverse": "source"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "billing",
    "nameSpace": "XM",
    "type": "IncidentCustomer",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Incident Customer",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "INCDT"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Incident",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "C"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "isNested": true,
          "type": "CustomerInfo",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "billing",
    "nameSpace": "XM",
    "type": "Terms",
    "table": "terms",
    "isExtension": true,
    "comment": "Extended by Billing",
    "relations": [
      {
        "column": "terms_id"
      }
    ],
    "properties": [
      {
        "name": "usedForBilling",
        "attr": {
          "type": "Boolean",
          "column": "terms_ar"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "BankAccount",
    "table": "bankaccnt",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "bankaccnt_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "bankaccnt_accnt_id"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "BankAccountAdjustment",
    "table": "bankadj",
    "idSequenceName": "bankadj_bankadj_id_seq",
    "comment": "Bank Account Adjustment Map",
    "privileges": {
      "all": {
        "create": "MaintainBankAdjustments",
        "read": "MaintainBankAdjustments",
        "update": "MaintainBankAdjustments",
        "delete": "MaintainBankAdjustments"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "bankadj_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "bankAccount",
        "toOne": {
          "isNested": true,
          "type": "BankAccountInfo",
          "column": "bankadj_bankaccnt_id"
        }
      },
      {
        "name": "bankAccountAdjustmentType",
        "toOne": {
          "type": "BankAccountAdjustmentType",
          "column": "bankadj_bankadjtype_id"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "bankadj_created"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "bankadj_username"
        }
      },
      {
        "name": "date",
        "attr": {
          "type": "Date",
          "column": "bankadj_date"
        }
      },
      {
        "name": "documentNumber",
        "attr": {
          "type": "String",
          "column": "bankadj_docnumber"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "bankadj_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "bankadj_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "bankadj_curr_rate"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "Date",
          "column": "bankadj_notes"
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "bankadj_sequence"
        }
      },
      {
        "name": "isPosted",
        "attr": {
          "type": "Number",
          "column": "bankadj_posted"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "BankAccountAdjustmentType",
    "table": "bankadjtype",
    "idSequenceName": "bankadjtype_bankadjtype_id_seq",
    "comment": "Bank Account Adjustment Type Map",
    "privileges": {
      "all": {
        "create": "MaintainAdjustmentTypes",
        "read": true,
        "update": "MaintainAdjustmentTypes",
        "delete": "MaintainAdjustmentTypes"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "bankadjtype_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "bankadjtype_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "bankadjtype_descrip"
        }
      },
      {
        "name": "ledgerAccount",
        "attr": {
          "type": "String",
          "column": "bankadjtype_accnt_id"
        }
      },
      {
        "name": "isCredit",
        "toOne": {
          "type": "Boolean",
          "column": "bankadjtype_iscredit"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "BankReconciliation",
    "table": "bankrec",
    "idSequenceName": "bankrec_bankrec_id_seq",
    "comment": "Bank Reconcilition Map",
    "privileges": {
      "all": {
        "create": "MaintainBankRec",
        "read": "MaintainBankRec",
        "update": "MaintainBankRec",
        "delete": "MaintainBankRec"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "bankrec_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "bankAccount",
        "toOne": {
          "isNested": true,
          "type": "BankAccountInfo",
          "column": "bankrec_bankaccnt_id"
        }
      },
      {
        "name": "openDate",
        "attr": {
          "type": "Date",
          "column": "bankrec_opendate"
        }
      },
      {
        "name": "endDate",
        "attr": {
          "type": "Date",
          "column": "bankrec_enddate"
        }
      },
      {
        "name": "openBalance",
        "attr": {
          "type": "Number",
          "column": "bankrec_openbal"
        }
      },
      {
        "name": "endBalance",
        "attr": {
          "type": "Number",
          "column": "bankrec_endbal"
        }
      },
      {
        "name": "items",
        "toMany": {
          "isNested": true,
          "type": "BankReconciliationItem",
          "column": "bankrec_id",
          "inverse": "bankReconciliation"
        }
      },
      {
        "name": "unreconciled",
        "toMany": {
          "isNested": true,
          "type": "BankReconciliationUnreconciled",
          "column": "bankrec_id",
          "inverse": "bankReconciliation"
        }
      },
      {
        "name": "isPosted",
        "attr": {
          "type": "String",
          "column": "bankrec_posted"
        }
      },
      {
        "name": "postDate",
        "attr": {
          "type": "Date",
          "column": "bankrec_postdate"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "bankrec_created"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "bankrec_username"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "BankReconciliationItem",
    "table": "bankrecitem",
    "idSequenceName": "bankrecitem_bankrecitem_id_seq",
    "comment": "Bank Reconcilition Item Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "bankrecitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "bankReconciliation",
        "toOne": {
          "type": "BankReconciliation",
          "column": "bankrecitem_bankrec_id"
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "bankrecitem_source"
        }
      },
      {
        "name": "source",
        "attr": {
          "type": "Number",
          "column": "bankrecitem_source_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "bankrecitem_amount"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "bankrecitem_curr_rate"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "BankReconciliationUnreconciled",
    "table": "xt.unrec",
    "comment": "Bank Reconcilition Unreconciled Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "jrnl_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "bankReconciliation",
        "toOne": {
          "type": "BankReconciliation",
          "column": "bankrec_id"
        }
      },
      {
        "name": "date",
        "attr": {
          "type": "String",
          "column": "jrnl_date"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "jrnl_doctype"
        }
      },
      {
        "name": "documentNumber",
        "attr": {
          "type": "Number",
          "column": "jrnl_docnumber"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "jrnl_amount"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "jrnl_notes"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "CashReceipt",
    "table": "cashrcpt",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "cashrcpt_id"
      }
    ],
    "properties": [
      {
        "name": "salesCategory",
        "toOne": {
          "type": "SalesCategory",
          "column": "cashrcpt_salescat_id"
        }
      },
      {
        "name": "distributions",
        "toMany": {
          "isNested": true,
          "type": "CashReceiptDistribution",
          "column": "cashrcpt_id",
          "inverse": "cashReceipt"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "CashReceiptDistribution",
    "table": "cashrcptmisc",
    "idSequenceName": "cashrcptmisc_cashrcptmisc_id_seq",
    "comment": "Cash Receipt Distribution Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "cashrcptmisc_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "cashReceipt",
        "toOne": {
          "type": "CashReceipt",
          "column": "cashrcptmisc_cashrcpt_id"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "cashrcptmisc_accnt_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "cashrcptmisc_amount"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "cashrcptmisc_notes"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "ExpenseCategory",
    "table": "expcat",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "expcat_id"
      }
    ],
    "properties": [
      {
        "name": "expenseLedgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "expcat_exp_accnt_id"
        }
      },
      {
        "name": "liabilityLedgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "expcat_liability_accnt_id"
        }
      },
      {
        "name": "varianceLedgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "expcat_purchprice_accnt_id"
        }
      },
      {
        "name": "freightLedgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "expcat_freight_accnt_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "Payable",
    "table": "apopen",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "apopen_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "distributionDate",
        "attr": {
          "type": "Date",
          "column": "apopen_distdate"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccount",
          "column": "apopen_accnt_id"
        }
      },
      {
        "name": "journalNumber",
        "attr": {
          "type": "Number",
          "column": "apopen_journalnumber"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "PayableApplication",
    "table": "apapply",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "apapply_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "journalNumber",
        "attr": {
          "type": "Number",
          "column": "apapply_journalnumber"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "PayableLedgerAccounts",
    "table": "apaccnt",
    "idSequenceName": "appaccnt_apaccnt_id_seq",
    "comment": "Payable Ledger Account Map",
    "privileges": {
      "all": {
        "create": "MaintainVendorAccounts",
        "read": "MaintainVendorAccounts",
        "update": "MaintainVendorAccounts",
        "delete": "MaintainVendorAccounts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "apaccnt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "vendorType",
        "toOne": {
          "type": "VendorType",
          "column": "apaccnt_vendtype_id"
        }
      },
      {
        "name": "vendorTypePattern",
        "attr": {
          "type": "String",
          "column": "apaccnt_vendtype"
        }
      },
      {
        "name": "payablesLedgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "apaccnt_ap_accnt_id"
        }
      },
      {
        "name": "prepaidledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "apaccnt_prepaid_accnt_id"
        }
      },
      {
        "name": "discountledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "apaccnt_discount_accnt_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "Payment",
    "table": "checkhead",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "checkhead_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "journalNumber",
        "attr": {
          "type": "Number",
          "column": "checkhead_journalnumber"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "Receivable",
    "table": "aropen",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "aropen_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccount",
          "column": "aropen_accnt_id"
        }
      },
      {
        "name": "salesCategory",
        "toOne": {
          "type": "SalesCategory",
          "column": "aropen_salescat_id"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "ReceivableLedgerAccounts",
    "table": "araccnt",
    "idSequenceName": "araccnt_araccnt_id_seq",
    "comment": "Receivable Ledger Account Map",
    "privileges": {
      "all": {
        "create": "MaintainSalesAccount",
        "read": "MaintainSalesAccount",
        "update": "MaintainSalesAccount",
        "delete": "MaintainSalesAccount"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "araccnt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customerType",
        "toOne": {
          "type": "CustomerType",
          "column": "araccnt_custtype_id"
        }
      },
      {
        "name": "customerTypePattern",
        "attr": {
          "type": "String",
          "column": "araccnt_custtype"
        }
      },
      {
        "name": "receivablesLedgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "araccnt_ar_accnt_id"
        }
      },
      {
        "name": "prepaidledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "araccnt_prepaid_accnt_id"
        }
      },
      {
        "name": "deferredLedgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "araccnt_deferred_accnt_id"
        }
      },
      {
        "name": "discountledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "araccnt_discount_accnt_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "SalesCategory",
    "table": "salescat",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "salescat_id"
      }
    ],
    "properties": [
      {
        "name": "salesLedgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "salescat_sales_accnt_id"
        }
      },
      {
        "name": "prepaidLedgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "salescat_prepaid_accnt_id"
        }
      },
      {
        "name": "receivableLedgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "salescat_ar_accnt_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "TaxCode",
    "table": "tax",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "tax_id"
      }
    ],
    "properties": [
      {
        "name": "ledgerAccount",
        "toOne": {
          "type": "LedgerAccount",
          "column": "tax_sales_accnt_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "Voucher",
    "table": "vohead",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "vohead_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "distributionDate",
        "attr": {
          "type": "Date",
          "column": "vohead_distdate"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "ledger",
    "nameSpace": "XM",
    "type": "VoucherDistribution",
    "table": "vodist",
    "isExtension": true,
    "comment": "Extended by Ledger",
    "relations": [
      {
        "column": "vodist_id"
      }
    ],
    "properties": [
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccount",
          "column": "vodist_accnt_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "BankAccount",
    "table": "bankaccnt",
    "isExtension": true,
    "comment": "Extended by Payments",
    "relations": [
      {
        "column": "bankaccnt_id"
      }
    ],
    "properties": [
      {
        "name": "usedByPayables",
        "attr": {
          "type": "Boolean",
          "column": "bankaccnt_ap"
        }
      },
      {
        "name": "nextCheckNumber",
        "attr": {
          "type": "Number",
          "column": "bankaccnt_nextchknum"
        }
      },
      {
        "name": "checkForm",
        "attr": {
          "type": "Number",
          "column": "bankaccnt_check_form_id"
        }
      },
      {
        "name": "routing",
        "attr": {
          "type": "Number",
          "column": "bankaccnt_routing"
        }
      },
      {
        "name": "isAchEnabled",
        "attr": {
          "type": "Boolean",
          "column": "bankaccnt_ach_enabled"
        }
      },
      {
        "name": "achGenerateCheckNumber",
        "attr": {
          "type": "Boolean",
          "column": "bankaccnt_ach_genchecknum"
        }
      },
      {
        "name": "achLeadTime",
        "attr": {
          "type": "Number",
          "column": "bankaccnt_ach_leadtime"
        }
      },
      {
        "name": "achOriginType",
        "attr": {
          "type": "String",
          "column": "bankaccnt_ach_origintype"
        }
      },
      {
        "name": "achOriginName",
        "attr": {
          "type": "String",
          "column": "bankaccnt_ach_originname"
        }
      },
      {
        "name": "achOrigin",
        "attr": {
          "type": "String",
          "column": "bankaccnt_ach_origin"
        }
      },
      {
        "name": "achDestinationType",
        "attr": {
          "type": "Boolean",
          "column": "bankaccnt_ach_desttype"
        }
      },
      {
        "name": "achDestinationName",
        "attr": {
          "type": "Boolean",
          "column": "bankaccnt_ach_desttype"
        }
      },
      {
        "name": "achDestination",
        "attr": {
          "type": "Boolean",
          "column": "bankaccnt_ach_dest"
        }
      },
      {
        "name": "achDestinationFederal",
        "attr": {
          "type": "Number",
          "column": "bankaccnt_ach_fed_dest"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "Customer",
    "table": "custinfo",
    "isExtension": true,
    "comment": "Extended by Payments",
    "privileges": {
      "all": {
        "create": "MaintainPayments",
        "read": "ViewPayments",
        "update": "MaintainPayments",
        "delete": "MaintainPayments"
      }
    },
    "relations": [
      {
        "column": "cust_id"
      }
    ],
    "properties": [
      {
        "name": "checks",
        "toMany": {
          "type": "CustomerPayment",
          "column": "cust_id",
          "inverse": "customer"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "CustomerPayment",
    "table": "checkhead",
    "comment": "Customer Payment Map",
    "privileges": {
      "all": {
        "create": "false",
        "read": "read",
        "update": "false",
        "delete": "false"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "checkhead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "recipientType",
        "attr": {
          "type": "String",
          "column": "checkhead_recip_type",
          "value": "C"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "Customer",
          "column": "checkhead_recip_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "Incident",
    "table": "incdt",
    "isExtension": true,
    "comment": "Extended by Payments",
    "relations": [
      {
        "column": "cntct_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "vendors",
        "toMany": {
          "isNested": true,
          "type": "IncidentVendor",
          "column": "incdt_id",
          "inverse": "source"
        }
      }
    ],
    "sequence": 0,
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "IncidentVendor",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Incident Vendor Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "INCDT"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Incident",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "V"
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "isNested": true,
          "type": "VendorInfo",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "TaxAuthority",
    "table": "taxauth",
    "isExtension": true,
    "comment": "Extended by Payments",
    "relations": [
      {
        "column": "taxauth_id",
        "inverse": "id"
      }
    ],
    "properties": [
      {
        "name": "checks",
        "toMany": {
          "type": "TaxAuthorityPayment",
          "column": "taxauth_id",
          "inverse": "tax_authority"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "TaxAuthorityPayment",
    "table": "checkhead",
    "comment": "Tax Authority Payment Map",
    "privileges": {
      "all": {
        "create": "MaintainPayments",
        "read": "ViewPayments",
        "update": "MaintainPayments",
        "delete": "MaintainPayments"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "checkhead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "recipientType",
        "attr": {
          "type": "String",
          "column": "checkhead_recip_type",
          "value": "T"
        }
      },
      {
        "name": "taxAuthority",
        "toOne": {
          "type": "TaxAuthority",
          "column": "checkhead_recip_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "Terms",
    "table": "terms",
    "isExtension": true,
    "comment": "Extended by Payments",
    "relations": [
      {
        "column": "terms_id"
      }
    ],
    "properties": [
      {
        "name": "usedForPayments",
        "attr": {
          "type": "Boolean",
          "column": "terms_ap"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "Vendor",
    "table": "vendinfo",
    "isExtension": true,
    "comment": "Extended by Payments",
    "relations": [
      {
        "column": "vend_id"
      }
    ],
    "properties": [
      {
        "name": "checks",
        "toMany": {
          "type": "VendorPayment",
          "column": "vend_id",
          "inverse": "vendor"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "payments",
    "nameSpace": "XM",
    "type": "VendorPayment",
    "table": "checkhead",
    "comment": "Vendor Payment Map",
    "privileges": {
      "all": {
        "create": "MaintainPayments",
        "read": "ViewPayments",
        "update": "MaintainPayments",
        "delete": "MaintainPayments"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "checkhead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "recipientType",
        "attr": {
          "type": "String",
          "column": "checkhead_recip_type",
          "value": "V"
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "type": "Vendor",
          "column": "checkhead_recip_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ApplyCredit",
    "table": "xt.aropencr",
    "comment": "Apply Credit Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "ApplyARMemos",
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "aropen_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "isNested": true,
          "type": "CustomerInfo",
          "column": "aropen_cust_id"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "aropen_docdate"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "aropen_doctype"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "aropen_docnumber"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "aropen_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "aropen_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "aropen_curr_rate"
        }
      },
      {
        "name": "applications",
        "toMany": {
          "isNested": true,
          "type": "ReceivableApplication",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      },
      {
        "name": "pendingApplications",
        "toMany": {
          "isNested": true,
          "type": "ReceivablePendingApplication",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      },
      {
        "name": "details",
        "toMany": {
          "isNested": true,
          "type": "ApplyCreditDetail",
          "column": "aropen_id",
          "inverse": "applyCredit"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ApplyCreditDetail",
    "table": "arcreditapply",
    "idSequenceName": "cashrcptitem_cashrcptitem_id_seq",
    "comment": "Apply Credit Detail Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "arcreditapply_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "applyCredit",
        "toOne": {
          "type": "ApplyCredit",
          "column": "arcreditapply_source_aropen_id"
        }
      },
      {
        "name": "receivable",
        "attr": {
          "type": "ApplyCreditReceivable",
          "column": "arcreditapply_target_aropen_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "arcreditapply_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "arcreditapply_curr_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ApplyCreditReceivable",
    "table": "xt.aropenid",
    "comment": "Apply Credit Receivable Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "ApplyARMemos",
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "aropen_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "CustomerInfo",
          "column": "aropen_cust_id"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "aropen_docdate"
        }
      },
      {
        "name": "dueDate",
        "attr": {
          "type": "Date",
          "column": "aropen_duedate"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "aropen_doctype"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "aropen_docnumber"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "aropen_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "aropen_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "aropen_curr_rate"
        }
      },
      {
        "name": "applications",
        "toMany": {
          "isNested": true,
          "type": "ReceivableApplication",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      },
      {
        "name": "pendingApplications",
        "toMany": {
          "isNested": true,
          "type": "ReceivablePendingApplication",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "BankAccount",
    "table": "bankaccnt",
    "idSequenceName": "bankaccnt_bankaccnt_id_seq",
    "comment": "Bank Account Map",
    "privileges": {
      "all": {
        "create": "MaintainBankAccounts",
        "read": "MaintainBankAccounts",
        "update": "MaintainBankAccounts",
        "delete": "MaintainBankAccounts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "bankaccnt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "bankaccnt_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "bankaccnt_descrip"
        }
      },
      {
        "name": "bankName",
        "attr": {
          "type": "String",
          "column": "bankaccnt_bankname"
        }
      },
      {
        "name": "accountNumber",
        "attr": {
          "type": "String",
          "column": "bankaccnt_accntnumber"
        }
      },
      {
        "name": "bankAccountType",
        "attr": {
          "type": "String",
          "column": "bankaccnt_type"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "bankaccnt_curr_id"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "bankaccnt_notes"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "BankAccountInfo",
    "table": "bankaccnt",
    "idSequenceName": "bankaccnt_bankaccnt_id_seq",
    "comment": "Bank Account Info Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "bankaccnt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "bankaccnt_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "bankaccnt_descrip"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "bankaccnt_curr_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Budget",
    "table": "budghead",
    "idSequenceName": "budghead_budghead_id_seq",
    "comment": "Budget Map",
    "privileges": {
      "all": {
        "create": "MaintainBudgets",
        "read": "MaintainBudgets",
        "update": "MaintainBudgets",
        "delete": "MaintainBudgets"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "budghead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "budghead_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "budghead_descrip"
        }
      },
      {
        "name": "items",
        "toMany": {
          "type": "BudgetDetail",
          "column": "budghead_id",
          "inverse": "budget"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "BudgetDetail",
    "table": "budgitem",
    "idSequenceName": "budgitem_budgitem_id_seq",
    "comment": "Budget Detail Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "budgitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "budget",
        "toOne": {
          "type": "Number",
          "column": "budgitem_budghead_id"
        }
      },
      {
        "name": "period",
        "toOne": {
          "type": "Period",
          "column": "budgitem_period_id"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "budgitem_accnt_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CashReceipt",
    "table": "cashrcpt",
    "idSequenceName": "cashrcpt_cashrcpt_id_seq",
    "orderSequence": "CashRcptNumber",
    "comment": "Cash Receipt Map",
    "privileges": {
      "all": {
        "create": "MaintainCashReceipts",
        "read": "ViewCashReceipts",
        "update": "MaintainCashReceipts",
        "delete": "MaintainCashReceipts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "cashrcpt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "cashrcpt_number"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "isNested": true,
          "type": "CustomerInfo",
          "column": "cashrcpt_cust_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "cashrcpt_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "cashrcpt_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "cashrcpt_curr_rate",
          "isRequried": true
        }
      },
      {
        "name": "fundsType",
        "attr": {
          "type": "String",
          "column": "cashrcpt_fundstype"
        }
      },
      {
        "name": "documentNumber",
        "attr": {
          "type": "String",
          "column": "cashrcpt_docnumber"
        }
      },
      {
        "name": "isUseCustomerDeposit",
        "attr": {
          "type": "Boolean",
          "column": "cashrcpt_usecustdeposit"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "cashrcpt_docdate"
        }
      },
      {
        "name": "bankAccount",
        "toOne": {
          "type": "BankAccount",
          "column": "cashrcpt_bankaccnt_id"
        }
      },
      {
        "name": "distributionDate",
        "attr": {
          "type": "Date",
          "column": "cashrcpt_distdate"
        }
      },
      {
        "name": "applicationDate",
        "attr": {
          "type": "Date",
          "column": "cashrcpt_applydate"
        }
      },
      {
        "name": "isPosted",
        "attr": {
          "type": "Boolean",
          "column": "cashrcpt_posted"
        }
      },
      {
        "name": "isVoid",
        "attr": {
          "type": "Boolean",
          "column": "cashrcpt_void"
        }
      },
      {
        "name": "details",
        "toMany": {
          "isNested": true,
          "type": "CashReceiptDetail",
          "column": "cashrcpt_id",
          "inverse": "cashReceipt"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "cashrcpt_notes"
        }
      },
      {
        "name": "posted",
        "attr": {
          "type": "Date",
          "column": "cashrcpt_posteddate"
        }
      },
      {
        "name": "postedBy",
        "attr": {
          "type": "String",
          "column": "cashrcpt_postedby"
        }
      }
    ],
    "order": [
      "cashrcpt_distdate desc",
      "cashrcpt_number desc"
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CashReceiptDetail",
    "table": "cashrcptitem",
    "idSequenceName": "cashrcptitem_cashrcptitem_id_seq",
    "comment": "Cash Receipt Detail Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "cashrcptitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "cashReceipt",
        "toOne": {
          "type": "CashReceipt",
          "column": "cashrcptitem_cashrcpt_id"
        }
      },
      {
        "name": "receivable",
        "toOne": {
          "type": "CashReceiptReceivable",
          "column": "cashrcptitem_aropen_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "cashrcptitem_amount"
        }
      },
      {
        "name": "discount",
        "attr": {
          "type": "Number",
          "column": "cashrcptitem_discount"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CashReceiptReceivable",
    "table": "aropen",
    "comment": "Cash Receipt Receivable Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "ViewCashReceipts",
        "update": "MaintainCashReceipts",
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "aropen_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "CustomerInfo",
          "column": "aropen_cust_id",
          "inverse": "id"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "aropen_docdate"
        }
      },
      {
        "name": "dueDate",
        "attr": {
          "type": "Date",
          "column": "aropen_duedate"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "aropen_doctype"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "aropen_docnumber"
        }
      },
      {
        "name": "orderNumber",
        "attr": {
          "type": "String",
          "column": "aropen_ordernumber"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "isNested": true,
          "type": "Terms",
          "column": "aropen_terms_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "aropen_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "aropen_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "aropen_curr_rate"
        }
      },
      {
        "name": "applications",
        "toMany": {
          "isNested": true,
          "type": "ReceivableApplication",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      },
      {
        "name": "pendingApplications",
        "toMany": {
          "isNested": true,
          "type": "ReceivablePendingApplication",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      },
      {
        "name": "isOpen",
        "attr": {
          "type": "Boolean",
          "column": "aropen_open"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Company",
    "table": "company",
    "idSequenceName": "company_company_id_seq",
    "comment": "Company Map",
    "privileges": {
      "all": {
        "create": "MaintainChartOfAccounts",
        "read": true,
        "update": "MaintainChartOfAccounts",
        "delete": "MaintainChartOfAccounts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "company_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "company_number"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "company_descrip"
        }
      },
      {
        "name": "yearEndLedgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "company_yearend_accnt_id"
        }
      },
      {
        "name": "gainLossLedgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "company_gainloss_accnt_id"
        }
      },
      {
        "name": "discrepancyLedgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "company_dscrp_accnt_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CurrencyRate",
    "table": "curr_rate",
    "idSequenceName": "curr_rate_curr_rate_id_seq",
    "comment": "Currency Rate Map",
    "privileges": {
      "all": {
        "create": "MaintainCurrencyRates",
        "read": "ViewCurrencyRates",
        "update": "MaintainCurrencyRates",
        "delete": "MaintainCurrencyRates"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "curr_rate_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "curr_id"
        }
      },
      {
        "name": "rate",
        "attr": {
          "type": "Number",
          "column": "curr_rate"
        }
      },
      {
        "name": "effective",
        "attr": {
          "type": "Date",
          "column": "curr_effective"
        }
      },
      {
        "name": "expires",
        "attr": {
          "type": "Date",
          "column": "curr_expires"
        }
      }
    ],
    "order": [
      "curr_effective DESC"
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Customer",
    "table": "custinfo",
    "idSequenceName": "cust_cust_id_seq",
    "orderSequence": "CRMAccountNumber",
    "comment": "Customer Map",
    "privileges": {
      "all": {
        "create": "MaintainCustomerMasters",
        "read": "ViewCustomerMasters",
        "update": "MaintainCustomerMasters",
        "delete": "MaintainCustomerMasters"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "cust_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "cust_number"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "cust_name"
        }
      },
      {
        "name": "customerType",
        "toOne": {
          "type": "CustomerType",
          "column": "cust_custtype_id"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "cust_active"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "cust_comments"
        }
      },
      {
        "name": "billingContact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "cust_cntct_id",
          "inverse": "id"
        }
      },
      {
        "name": "correspondenceContact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "cust_corrcntct_id",
          "inverse": "id"
        }
      },
      {
        "name": "salesRep",
        "toOne": {
          "type": "SalesRep",
          "column": "cust_salesrep_id"
        }
      },
      {
        "name": "commission",
        "attr": {
          "type": "Number",
          "column": "cust_commprcnt"
        }
      },
      {
        "name": "shipVia",
        "attr": {
          "type": "String",
          "column": "cust_shipvia"
        }
      },
      {
        "name": "shipCharge",
        "toOne": {
          "type": "ShipCharge",
          "column": "cust_shipchrg_id"
        }
      },
      {
        "name": "isFreeFormShipto",
        "attr": {
          "type": "Boolean",
          "column": "cust_ffshipto"
        }
      },
      {
        "name": "isFreeFormBillto",
        "attr": {
          "type": "Boolean",
          "column": "cust_ffbillto"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "cust_terms_id"
        }
      },
      {
        "name": "discount",
        "attr": {
          "type": "Number",
          "column": "cust_discntprcnt"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "cust_curr_id",
          "defalutValue": "baseCurrency"
        }
      },
      {
        "name": "creditStatus",
        "attr": {
          "type": "String",
          "column": "cust_creditstatus"
        }
      },
      {
        "name": "balanceMethod",
        "attr": {
          "type": "String",
          "column": "cust_balmethod"
        }
      },
      {
        "name": "creditLimit",
        "attr": {
          "type": "Number",
          "column": "cust_creditlmt"
        }
      },
      {
        "name": "creditLimitCurrency",
        "toOne": {
          "type": "Currency",
          "column": "cust_creditlmt_curr_id"
        }
      },
      {
        "name": "creditRating",
        "attr": {
          "type": "String",
          "column": "cust_creditrating"
        }
      },
      {
        "name": "graceDays",
        "attr": {
          "type": "Number",
          "column": "cust_gracedays"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "cust_taxzone_id"
        }
      },
      {
        "name": "shiptos",
        "toMany": {
          "isNested": true,
          "type": "CustomerShipto",
          "column": "cust_id",
          "inverse": "customer"
        }
      },
      {
        "name": "comments",
        "toMany": {
          "isNested": true,
          "type": "CustomerComment",
          "column": "cust_id",
          "inverse": "customer"
        }
      },
      {
        "name": "characteristics",
        "toMany": {
          "isNested": true,
          "type": "CustomerCharacteristic",
          "column": "cust_id",
          "inverse": "customer"
        }
      },
      {
        "name": "creditCards",
        "toMany": {
          "isNested": true,
          "type": "CustomerCreditCard",
          "column": "cust_id",
          "inverse": "customer"
        }
      },
      {
        "name": "creditCardPayments",
        "toMany": {
          "type": "CustomerCreditCardPayment",
          "column": "cust_id",
          "inverse": "customer"
        }
      },
      {
        "name": "contacts",
        "toMany": {
          "isNested": true,
          "type": "CustomerContact",
          "column": "cust_id",
          "inverse": "source"
        }
      },
      {
        "name": "items",
        "toMany": {
          "isNested": true,
          "type": "CustomerItem",
          "column": "cust_id",
          "inverse": "source"
        }
      },
      {
        "name": "files",
        "toMany": {
          "isNested": true,
          "type": "CustomerFile",
          "column": "cust_id",
          "inverse": "source"
        }
      },
      {
        "name": "images",
        "toMany": {
          "isNested": true,
          "type": "CustomerImage",
          "column": "cust_id",
          "inverse": "source"
        }
      },
      {
        "name": "urls",
        "toMany": {
          "isNested": true,
          "type": "CustomerUrl",
          "column": "cust_id",
          "inverse": "source"
        }
      },
      {
        "name": "customers",
        "toMany": {
          "isNested": true,
          "type": "CustomerCustomer",
          "column": "cust_id",
          "inverse": "source"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerCharacteristic",
    "table": "xm.characteristic_assignment",
    "idSequenceName": "charass_charass_id_seq",
    "comment": "Customer Characteristic Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "targetType",
          "value": "C"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "Customer",
          "column": "target"
        }
      },
      {
        "name": "characteristic",
        "toOne": {
          "type": "Characteristic",
          "column": "characteristic"
        }
      },
      {
        "name": "value",
        "attr": {
          "type": "String",
          "column": "value"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerComment",
    "table": "comment",
    "idSequenceName": "comment_comment_id_seq",
    "comment": "Customer Comment Map",
    "canDelete": false,
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": "EditOthersComments",
        "delete": false
      },
      "personal": {
        "update": "EditOwnComments",
        "properties": [
          "createdBy"
        ]
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "comment_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "comment_source",
          "value": "C"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "Customer",
          "column": "comment_source_id"
        }
      },
      {
        "name": "commentType",
        "toOne": {
          "type": "Customer",
          "column": "comment_cmnttype_id"
        }
      },
      {
        "name": "text",
        "attr": {
          "type": "String",
          "column": "comment_text"
        }
      },
      {
        "name": "isPublic",
        "attr": {
          "type": "Boolean",
          "column": "comment_public"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "comment_date"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "comment_user"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerContact",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Customer Contact Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "C"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Customer",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "C"
        }
      },
      {
        "name": "contact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerCreditCard",
    "table": "ccard",
    "idSequenceName": "ccard_ccard_id_seq",
    "comment": "Customer Credit Card Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "ccard_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "ccard_seq"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "Customer",
          "column": "ccard_cust_id"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "ccard_active"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "ccard_name",
          "isEncrypted": true
        }
      },
      {
        "name": "address1",
        "attr": {
          "type": "String",
          "column": "ccard_address1",
          "isEncrypted": true
        }
      },
      {
        "name": "address2",
        "attr": {
          "type": "String",
          "column": "ccard_address2",
          "isEncrypted": true
        }
      },
      {
        "name": "city",
        "attr": {
          "type": "String",
          "column": "ccard_city",
          "isEncrypted": true
        }
      },
      {
        "name": "state",
        "attr": {
          "type": "String",
          "column": "ccard_state",
          "isEncrypted": true
        }
      },
      {
        "name": "postalCode",
        "attr": {
          "type": "String",
          "column": "ccard_zip",
          "isEncrypted": true
        }
      },
      {
        "name": "country",
        "attr": {
          "type": "String",
          "column": "ccard_country",
          "isEncrypted": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "ccard_number",
          "isEncrypted": true
        }
      },
      {
        "name": "isDebit",
        "attr": {
          "type": "Boolean",
          "column": "ccard_debit"
        }
      },
      {
        "name": "monthExpire",
        "attr": {
          "type": "String",
          "column": "ccard_month_expired",
          "isEncrypted": true
        }
      },
      {
        "name": "yearExpire",
        "attr": {
          "type": "String",
          "column": "ccard_year_expired",
          "isEncrypted": true
        }
      },
      {
        "name": "cardType",
        "attr": {
          "type": "String",
          "column": "ccard_type"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "ccard_date_added"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "ccard_added_by_username"
        }
      },
      {
        "name": "updated",
        "attr": {
          "type": "Date",
          "column": "ccard_lastupdated"
        }
      },
      {
        "name": "updatedBy",
        "attr": {
          "type": "String",
          "column": "ccard_last_updated_by_username"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerCreditCardPayment",
    "table": "ccpay",
    "comment": "Customer Credit Card Payment Map",
    "privileges": {
      "all": {
        "create": "false",
        "read": "ProcessCreditCards",
        "update": "false",
        "delete": "false"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "ccpay_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "isNested": true,
          "type": "CustomerInfo",
          "column": "ccpay_cust_id"
        }
      },
      {
        "name": "customerCreditCardPaymentType",
        "attr": {
          "type": "String",
          "column": "ccpay_type"
        }
      },
      {
        "name": "customerCreditCardPaymentStatus",
        "attr": {
          "type": "String",
          "column": "ccpay_status"
        }
      },
      {
        "name": "documentNumber",
        "attr": {
          "type": "String",
          "column": "ccpay_order_number"
        }
      },
      {
        "name": "reference",
        "attr": {
          "type": "String",
          "column": "ccpay_r_ref"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "ccpay_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "ccpay_curr_id"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "ccpay_transaction_datetime"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "ccpay_by_username"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerCustomer",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Customer Account Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "C"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Customer",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "C"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "isNested": true,
          "type": "CustomerInfo",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerFile",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Customer File Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "C"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Customer",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "FILE"
        }
      },
      {
        "name": "file",
        "toOne": {
          "isNested": true,
          "type": "FileInfo",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerImage",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Customer Image Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "C"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Customer",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "IMG"
        }
      },
      {
        "name": "image",
        "toOne": {
          "isNested": true,
          "type": "ImageInfo",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerInfo",
    "table": "custinfo",
    "comment": "Customer Info Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "cust_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "cust_number"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "cust_name"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "cust_active"
        }
      },
      {
        "name": "billingContact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "cust_cntct_id"
        }
      },
      {
        "name": "isFreeFormShipto",
        "attr": {
          "type": "Boolean",
          "column": "cust_ffshipto"
        }
      },
      {
        "name": "isFreeFormBillto",
        "attr": {
          "type": "Boolean",
          "column": "cust_ffbillto"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "cust_curr_id"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "cust_terms_id"
        }
      },
      {
        "name": "creditStatus",
        "attr": {
          "type": "String",
          "column": "cust_creditstatus"
        }
      },
      {
        "name": "salesRep",
        "toOne": {
          "type": "SalesRep",
          "column": "cust_salesrep_id"
        }
      },
      {
        "name": "commission",
        "attr": {
          "type": "Number",
          "column": "cust_commprcnt"
        }
      },
      {
        "name": "discount",
        "attr": {
          "type": "Number",
          "column": "cust_discntprcnt"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "cust_taxzone_id"
        }
      },
      {
        "name": "shipCharge",
        "toOne": {
          "type": "ShipCharge",
          "column": "cust_shipchrg_id"
        }
      }
    ],
    "extensions": [
      {
        "table": "shiptoinfo",
        "relations": [
          {
            "column": "shipto_cust_id"
          }
        ],
        "properties": [
          {
            "name": "shipto",
            "toOne": {
              "isNested": true,
              "type": "CustomerShipto",
              "column": "shipto_id"
            }
          },
          {
            "name": "isDefault",
            "attr": {
              "type": "Boolean",
              "column": "shipto_default",
              "value": true,
              "isVisible": false
            }
          },
          {
            "name": "isActive",
            "attr": {
              "type": "Boolean",
              "column": "shipto_active",
              "value": true,
              "isVisible": false
            }
          }
        ],
        "nameSpace": "XM"
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerItem",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Customer Item Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "C"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Customer",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "C"
        }
      },
      {
        "name": "item",
        "toOne": {
          "isNested": true,
          "type": "ItemInfo",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerShipto",
    "table": "shiptoinfo",
    "idSequenceName": "shipto_shipto_id_seq",
    "comment": "Customer Shipto Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "shipto_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "Customer",
          "column": "shipto_cust_id"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "shipto_num"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "shipto_name"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "shipto_active"
        }
      },
      {
        "name": "isDefault",
        "attr": {
          "type": "Boolean",
          "column": "shipto_default"
        }
      },
      {
        "name": "salesRep",
        "toOne": {
          "type": "SalesRep",
          "column": "shipto_salesrep_id"
        }
      },
      {
        "name": "commission",
        "attr": {
          "type": "Number",
          "column": "shipto_commission"
        }
      },
      {
        "name": "shipZone",
        "toOne": {
          "type": "ShipZone",
          "column": "shipto_shipzone_id"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "shipto_taxzone_id"
        }
      },
      {
        "name": "shipVia",
        "attr": {
          "type": "String",
          "column": "shipto_shipvia"
        }
      },
      {
        "name": "shipCharge",
        "toOne": {
          "type": "ShipCharge",
          "column": "shipto_shipchrg_id"
        }
      },
      {
        "name": "contact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "shipto_cntct_id"
        }
      },
      {
        "name": "address",
        "toOne": {
          "isNested": true,
          "type": "AddressInfo",
          "column": "shipto_addr_id"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "shipto_comments"
        }
      },
      {
        "name": "shippingNotes",
        "attr": {
          "type": "String",
          "column": "shipto_shipcomments"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerShiptoInfo",
    "table": "shiptoinfo",
    "comment": "Customer Shipto Info Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "shipto_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "Customer",
          "column": "shipto_cust_id"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "shipto_num"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "shipto_name"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "shipto_active"
        }
      },
      {
        "name": "contact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "shipto_cntct_id"
        }
      },
      {
        "name": "address",
        "toOne": {
          "isNested": true,
          "type": "AddressInfo",
          "column": "shipto_addr_id"
        }
      },
      {
        "name": "salesRep",
        "toOne": {
          "type": "SalesRep",
          "column": "shipto_salesrep_id"
        }
      },
      {
        "name": "commission",
        "attr": {
          "type": "Number",
          "column": "shipto_commission"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "shipto_taxzone_id"
        }
      },
      {
        "name": "shipCharge",
        "toOne": {
          "type": "ShipCharge",
          "column": "shipto_shipchrg_id"
        }
      },
      {
        "name": "shipVia",
        "attr": {
          "type": "String",
          "column": "shipto_shipvia"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerTaxRegistration",
    "table": "taxreg",
    "idSequenceName": "taxreg_taxreg_id_seq",
    "comment": "Customer Tax Registration Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxreg_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "relationType",
        "attr": {
          "type": "String",
          "column": "taxreg_rel_type",
          "value": "C"
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "type": "Vendor",
          "column": "taxreg_rel_id"
        }
      },
      {
        "name": "taxAuthority",
        "toOne": {
          "type": "TaxAuthority",
          "column": "taxreg_taxauth_id"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "taxreg_number"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "taxreg_taxzone_id"
        }
      },
      {
        "name": "effective",
        "attr": {
          "type": "Date",
          "column": "taxreg_effective"
        }
      },
      {
        "name": "expires",
        "attr": {
          "type": "Date",
          "column": "taxreg_expires"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "taxreg_notes"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerType",
    "table": "custtype",
    "idSequenceName": "custtype_custtype_id_seq",
    "comment": "Vendor Type Map",
    "privileges": {
      "all": {
        "create": "MaintainCustomerTypes",
        "read": true,
        "update": "MaintainCustomerTypes",
        "delete": "MaintainCustomerTypes"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "custtype_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "custtype_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "custtype_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "CustomerUrl",
    "table": "xt.doc",
    "idSequenceName": "docass_docass_id_seq",
    "comment": "Customer Url Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "source_type",
          "value": "C"
        }
      },
      {
        "name": "source",
        "toOne": {
          "type": "Customer",
          "column": "source_id"
        }
      },
      {
        "name": "targetType",
        "attr": {
          "type": "String",
          "column": "target_type",
          "value": "URL"
        }
      },
      {
        "name": "url",
        "toOne": {
          "isNested": true,
          "type": "Url",
          "column": "target_id"
        }
      },
      {
        "name": "purpose",
        "attr": {
          "type": "String",
          "column": "purpose"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ExpenseCategory",
    "table": "expcat",
    "idSequenceName": "expcat_expcat_id_seq",
    "comment": "Expense Category Map",
    "privileges": {
      "all": {
        "create": "MaintainExpenseCategories",
        "read": true,
        "update": "MaintainExpenseCategories",
        "delete": "MaintainExpenseCategories"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "expcat_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "expcat_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "expcat_descrip"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "expcat_active"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "FinancialLayout",
    "table": "flhead",
    "idSequenceName": "flhead_flhead_id_seq",
    "comment": "Financial Layout Map",
    "privileges": {
      "all": {
        "create": "MaintainFinancialLayouts",
        "read": "MaintainFinancialLayouts",
        "update": "MaintainFinancialLayouts",
        "delete": "MaintainFinancialLayouts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "flhead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "flhead_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "flhead_descrip"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "flhead_active"
        }
      },
      {
        "name": "layoutType",
        "attr": {
          "type": "String",
          "column": "flhead_type"
        }
      },
      {
        "name": "groups",
        "toMany": {
          "isNested": true,
          "type": "FinancialLayoutGroup",
          "column": "flhead_id",
          "inverse": "financialLayout"
        }
      },
      {
        "name": "items",
        "toMany": {
          "isNested": true,
          "type": "FinancialLayoutItem",
          "column": "flhead_id",
          "inverse": "financialLayout"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "flhead_notes"
        }
      },
      {
        "name": "showTotal",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showtotal"
        }
      },
      {
        "name": "isShowBeginning",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showstart"
        }
      },
      {
        "name": "isShowEnding",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showend"
        }
      },
      {
        "name": "isShowDebitsCredits",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showdelta"
        }
      },
      {
        "name": "isShowBudget",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showbudget"
        }
      },
      {
        "name": "isShowDifference",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showdiff"
        }
      },
      {
        "name": "isShowCustom",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showcustom"
        }
      },
      {
        "name": "isAlternateBeginning",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealtbegin"
        }
      },
      {
        "name": "beginningLabel",
        "attr": {
          "type": "String",
          "column": "flhead_altbegin"
        }
      },
      {
        "name": "isAlternateEnding",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealtend"
        }
      },
      {
        "name": "endingLabel",
        "attr": {
          "type": "String",
          "column": "flhead_altend"
        }
      },
      {
        "name": "isAlternateDebits",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealtdebits"
        }
      },
      {
        "name": "debitsLabel",
        "attr": {
          "type": "String",
          "column": "flhead_altdebits"
        }
      },
      {
        "name": "isAlternateCredits",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealtcredits"
        }
      },
      {
        "name": "creditsLabel",
        "attr": {
          "type": "String",
          "column": "flhead_altcredits"
        }
      },
      {
        "name": "isAlternateBudget",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealtbudget"
        }
      },
      {
        "name": "budgetLabel",
        "attr": {
          "type": "String",
          "column": "flhead_altbudget"
        }
      },
      {
        "name": "isAlternateDifference",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealtdiff"
        }
      },
      {
        "name": "differenceLabel",
        "attr": {
          "type": "String",
          "column": "flhead_altdiff"
        }
      },
      {
        "name": "isAlternateTotal",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealttotal"
        }
      },
      {
        "name": "totalLabel",
        "attr": {
          "type": "String",
          "column": "flhead_alttotal"
        }
      },
      {
        "name": "customLabel",
        "attr": {
          "type": "String",
          "column": "flhead_custom_label"
        }
      },
      {
        "name": "isSystem",
        "attr": {
          "type": "Boolean",
          "column": "flhead_sys"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "FinancialLayoutGroup",
    "table": "flgrp",
    "idSequenceName": "flgrp_flgrp_id_seq",
    "comment": "Financial Layout Group Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "flgrp_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "financialLayout",
        "toOne": {
          "type": "FinancialLayout",
          "column": "flgrp_flhead_id"
        }
      },
      {
        "name": "financialLayoutGroup",
        "toOne": {
          "type": "FinancialLayoutGroup",
          "column": "flgrp_flgrp_id"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "flgrp_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "flgrp_descrip"
        }
      },
      {
        "name": "isShowSubtotal",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_subtotal"
        }
      },
      {
        "name": "isAlternateSubtotal",
        "attr": {
          "type": "String",
          "column": "flgrp_usealtsubtotal"
        }
      },
      {
        "name": "subtotalLabel",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_altsubtotal"
        }
      },
      {
        "name": "percentFinancialLayoutGroup",
        "toOne": {
          "type": "FinancialLayoutGroup",
          "column": "flgrp_prcnt_flgrp_id"
        }
      },
      {
        "name": "isSummarize",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_summarize"
        }
      },
      {
        "name": "isSubtract",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_subtract"
        }
      },
      {
        "name": "isShowBeginningBalance",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showstart"
        }
      },
      {
        "name": "isShowBeginningPercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showstartprcnt"
        }
      },
      {
        "name": "isShowEndEndingBalance",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showend"
        }
      },
      {
        "name": "isShowEndingPercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showendprcnt"
        }
      },
      {
        "name": "isShowDebitsCredits",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showdelta"
        }
      },
      {
        "name": "isShowDebitsCreditsPercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showdeltaprcnt"
        }
      },
      {
        "name": "isShowBudget",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showbudget"
        }
      },
      {
        "name": "isShowBudgetPercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showbudgetprcnt"
        }
      },
      {
        "name": "isShowDifference",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showdiff"
        }
      },
      {
        "name": "isShowDifferencePercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showdiffprcnt"
        }
      },
      {
        "name": "isShowCustom",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showcustom"
        }
      },
      {
        "name": "isShowCustomPercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showcustomprcnt"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "FinancialLayoutItem",
    "table": "flitem",
    "idSequenceName": "flitemitem_flitemitem_id_seq",
    "comment": "Financial Layout Item Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "flitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "financialLayout",
        "toOne": {
          "type": "FinancialLayout",
          "column": "flitem_flhead_id"
        }
      },
      {
        "name": "financialLayoutGroup",
        "toOne": {
          "type": "FinancialLayoutGroup",
          "column": "flitem_flgrp_id"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "flitem_accnt_id"
        }
      },
      {
        "name": "company",
        "attr": {
          "type": "String",
          "column": "flitem_company"
        }
      },
      {
        "name": "profitCenter",
        "attr": {
          "type": "String",
          "column": "flitem_profit"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "flitem_number"
        }
      },
      {
        "name": "subAccount",
        "attr": {
          "type": "String",
          "column": "flitem_sub"
        }
      },
      {
        "name": "accountType",
        "attr": {
          "type": "String",
          "column": "flitem_type"
        }
      },
      {
        "name": "subType",
        "attr": {
          "type": "String",
          "column": "flitem_subaccnttype_code"
        }
      },
      {
        "name": "isSubtract",
        "attr": {
          "type": "Boolean",
          "column": "flitem_subtract"
        }
      },
      {
        "name": "isShowBeginningBalance",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showstart"
        }
      },
      {
        "name": "isShowBeginningPercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showstartprcnt"
        }
      },
      {
        "name": "isShowEndEndingBalance",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showend"
        }
      },
      {
        "name": "isShowEndingPercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showendprcnt"
        }
      },
      {
        "name": "isShowDebitsCredits",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showdelta"
        }
      },
      {
        "name": "isShowDebitsCreditsPercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showdeltaprcnt"
        }
      },
      {
        "name": "isShowBudget",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showbudget"
        }
      },
      {
        "name": "isShowBudgetPercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showbudgetprcnt"
        }
      },
      {
        "name": "isShowDifference",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showdiff"
        }
      },
      {
        "name": "isShowDifferencePercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showdiffprcnt"
        }
      },
      {
        "name": "isShowCustom",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showcustom"
        }
      },
      {
        "name": "isShowCustomPercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showcustomprcnt"
        }
      },
      {
        "name": "customSource",
        "attr": {
          "type": "Boolean",
          "column": "flitem_custom_source"
        }
      },
      {
        "name": "percentFinancialLayoutGroup",
        "toOne": {
          "type": "FinancialLayoutGroup",
          "column": "flitem_prcnt_flgrp_id"
        }
      },
      {
        "name": "order",
        "attr": {
          "type": "Number",
          "column": "flitem_order"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "FiscalYear",
    "table": "yearperiod",
    "idSequenceName": "yearperiod_yearperiod_id_seq",
    "comment": "Fiscal Year Map",
    "privileges": {
      "all": {
        "create": "MaintainAccountingPeriods",
        "read": true,
        "update": "MaintainAccountingPeriods",
        "delete": "MaintainAccountingPeriods"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "yearperiod_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "start",
        "attr": {
          "type": "Date",
          "column": "yearperiod_start"
        }
      },
      {
        "name": "end",
        "attr": {
          "type": "Date",
          "column": "yearperiod_end"
        }
      },
      {
        "name": "closed",
        "attr": {
          "type": "Boolean",
          "column": "yearperiod_closed"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "GeneralLedger",
    "table": "xt.gl",
    "comment": "General Ledger Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "Viewglactions",
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "gl_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "date",
        "attr": {
          "type": "Date",
          "column": "gl_date"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "gl_notes"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "gl_accnt_id"
        }
      },
      {
        "name": "sense",
        "attr": {
          "type": "String",
          "column": "gl_sense"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "gl_amount"
        }
      },
      {
        "name": "journalNumber",
        "attr": {
          "type": "Number",
          "column": "gl_journalnumber"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "gl_created"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "gl_username"
        }
      },
      {
        "name": "isDeleted",
        "attr": {
          "type": "Boolean",
          "column": "gl_deleted"
        }
      }
    ],
    "order": [
      "gl_accnt_id",
      "gl_date",
      "gl_journalnumber DESC",
      "gl_sense DESC"
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Invoice",
    "table": "invchead",
    "idSequenceName": "invchead_invchead_id_seq",
    "orderSequence": "InvcNumber",
    "comment": "Invoice Map",
    "privileges": {
      "all": {
        "create": "MaintainMiscInvoices",
        "read": "ViewMiscInvoices",
        "update": "MaintainMiscInvoices",
        "delete": "MaintainMiscInvoices"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "invchead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "invchead_invcnumber"
        }
      },
      {
        "name": "orderNumber",
        "attr": {
          "type": "String",
          "column": "invchead_ordernumber"
        }
      },
      {
        "name": "orderDate",
        "attr": {
          "type": "Date",
          "column": "invchead_orderdate"
        }
      },
      {
        "name": "invoiceDate",
        "attr": {
          "type": "Date",
          "column": "invchead_invcdate"
        }
      },
      {
        "name": "shipDate",
        "attr": {
          "type": "Date",
          "column": "invchead_shipdate"
        }
      },
      {
        "name": "isPrinted",
        "attr": {
          "type": "Boolean",
          "column": "invchead_printed"
        }
      },
      {
        "name": "isPosted",
        "attr": {
          "type": "Boolean",
          "column": "invchead_posted"
        }
      },
      {
        "name": "isVoid",
        "attr": {
          "type": "Boolean",
          "column": "invchead_void"
        }
      },
      {
        "name": "customer",
        "toOne": {
          "isNested": true,
          "type": "CustomerInfo",
          "column": "invchead_cust_id"
        }
      },
      {
        "name": "billtoName",
        "attr": {
          "type": "String",
          "column": "invchead_billto_name"
        }
      },
      {
        "name": "billtoAddress1",
        "attr": {
          "type": "String",
          "column": "invchead_billto_address1"
        }
      },
      {
        "name": "billtoAddress2",
        "attr": {
          "type": "String",
          "column": "invchead_billto_address2"
        }
      },
      {
        "name": "billtoAddress3",
        "attr": {
          "type": "String",
          "column": "invchead_billto_address3"
        }
      },
      {
        "name": "billtoCity",
        "attr": {
          "type": "String",
          "column": "invchead_billto_city"
        }
      },
      {
        "name": "billtoState",
        "attr": {
          "type": "String",
          "column": "invchead_billto_state"
        }
      },
      {
        "name": "billtoPostalCode",
        "attr": {
          "type": "String",
          "column": "invchead_billto_zipcode"
        }
      },
      {
        "name": "billtoCountry",
        "attr": {
          "type": "String",
          "column": "invchead_billto_country"
        }
      },
      {
        "name": "billtoContactPhone",
        "attr": {
          "type": "String",
          "column": "invchead_billto_phone"
        }
      },
      {
        "name": "shipto",
        "toOne": {
          "isNested": true,
          "type": "CustomerShiptoInfo",
          "column": "invchead_shipto_id"
        }
      },
      {
        "name": "shiptoName",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_name"
        }
      },
      {
        "name": "shiptoAddress1",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_address1"
        }
      },
      {
        "name": "shiptoAddress2",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_address2"
        }
      },
      {
        "name": "shiptoAddress3",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_address3"
        }
      },
      {
        "name": "shiptoCity",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_city"
        }
      },
      {
        "name": "shiptoState",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_state"
        }
      },
      {
        "name": "shiptoPostalCode",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_zipcode"
        }
      },
      {
        "name": "shiptoCountry",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_country"
        }
      },
      {
        "name": "shiptoContactPhone",
        "attr": {
          "type": "String",
          "column": "invchead_shipto_phone"
        }
      },
      {
        "name": "salesRep",
        "toOne": {
          "type": "SalesRep",
          "column": "invchead_salesrep_id"
        }
      },
      {
        "name": "commission",
        "attr": {
          "type": "Number",
          "column": "invchead_commission"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "invchead_taxzone_id"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "invchead_terms_id"
        }
      },
      {
        "name": "purchaseOrderNumber",
        "attr": {
          "type": "String",
          "column": "invchead_ponumber"
        }
      },
      {
        "name": "shipVia",
        "attr": {
          "type": "String",
          "column": "invchead_shipvia"
        }
      },
      {
        "name": "incoTerms",
        "attr": {
          "type": "String",
          "column": "invchead_fob"
        }
      },
      {
        "name": "shipCharge",
        "toOne": {
          "type": "ShipCharge",
          "column": "invchead_shipchrg_id"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "invchead_curr_id"
        }
      },
      {
        "name": "freight",
        "attr": {
          "type": "Number",
          "column": "invchead_freight"
        }
      },
      {
        "name": "credits",
        "toMany": {
          "isNested": true,
          "type": "InvoiceCredit",
          "column": "invchead_id",
          "inverse": "invoice"
        }
      },
      {
        "name": "lines",
        "toMany": {
          "isNested": true,
          "type": "InvoiceLine",
          "column": "invchead_id",
          "inverse": "invoice"
        }
      },
      {
        "name": "freightTaxes",
        "toMany": {
          "isNested": true,
          "type": "InvoiceTaxFreight",
          "column": "invchead_id",
          "inverse": "invoice"
        }
      },
      {
        "name": "adjustmentTaxes",
        "toMany": {
          "isNested": true,
          "type": "InvoiceTaxAdjustment",
          "column": "invchead_id",
          "inverse": "invoice"
        }
      },
      {
        "name": "recurrences",
        "toMany": {
          "type": "InvoiceRecurrence",
          "column": "invchead_id",
          "inverse": "invoice"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "invchead_notes"
        }
      }
    ],
    "order": [
      "invchead_invcdate desc",
      "invchead_invcnumber desc"
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "InvoiceCredit",
    "table": "aropenalloc",
    "comment": "Invoice Credit Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "aropenalloc_aropen_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "value": "I",
          "column": "aropenalloc_doctype"
        }
      },
      {
        "name": "invoice",
        "toOne": {
          "type": "Invoice",
          "column": "aropenalloc_doc_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "aropenalloc_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "aropenalloc_curr_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "InvoiceInfo",
    "table": "invchead",
    "comment": "Invoice Info Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "invchead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "Number",
          "column": "invchead_invcnumber"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "InvoiceLine",
    "table": "invcitem",
    "comment": "Invoice Line Map",
    "idSequenceName": "invcitem_invcitem_id_seq",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "invcitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "invoice",
        "toOne": {
          "type": "Invoice",
          "column": "invcitem_invchead_id"
        }
      },
      {
        "name": "lineNumber",
        "attr": {
          "type": "Number",
          "column": "invcitem_linenumber"
        }
      },
      {
        "name": "item",
        "toOne": {
          "isNested": true,
          "type": "ItemInfo",
          "column": "invcitem_item_id"
        }
      },
      {
        "name": "itemNumber",
        "attr": {
          "type": "String",
          "column": "invcitem_number"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "invcitem_descrip"
        }
      },
      {
        "name": "salesCategory",
        "toOne": {
          "type": "SalesCategory",
          "column": "invcitem_salescat_id",
          "inverse": "id"
        }
      },
      {
        "name": "customerPartNumber",
        "attr": {
          "type": "String",
          "column": "invcitem_custpn"
        }
      },
      {
        "name": "ordered",
        "attr": {
          "type": "Number",
          "column": "invcitem_ordered"
        }
      },
      {
        "name": "billed",
        "attr": {
          "type": "Number",
          "column": "invcitem_billed"
        }
      },
      {
        "name": "quantityUnit",
        "toOne": {
          "type": "Unit",
          "column": "invcitem_qty_uom_id"
        }
      },
      {
        "name": "quantityUnitRatio",
        "attr": {
          "type": "Number",
          "column": "invcitem_qty_invuomratio"
        }
      },
      {
        "name": "price",
        "attr": {
          "type": "Number",
          "column": "invcitem_price"
        }
      },
      {
        "name": "priceUnit",
        "toOne": {
          "type": "Unit",
          "column": "invcitem_price_uom_id"
        }
      },
      {
        "name": "priceUnitRatio",
        "attr": {
          "type": "Number",
          "column": "invcitem_price_invuomratio"
        }
      },
      {
        "name": "customerPrice",
        "attr": {
          "type": "Number",
          "column": "invcitem_custprice"
        }
      },
      {
        "name": "taxType",
        "toOne": {
          "type": "TaxType",
          "column": "invcitem_taxtype_id"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "invcitem_notes"
        }
      },
      {
        "name": "taxes",
        "toMany": {
          "isNested": true,
          "type": "InvoiceLineTax",
          "column": "invcitem_id",
          "inverse": "invoiceLine"
        }
      }
    ],
    "order": [
      "invcitem_linenumber"
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "InvoiceLineTax",
    "table": "invcitemtax",
    "idSequenceName": "taxhist_taxhist_id_seq",
    "comment": "Invoice Line Tax Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxhist_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "invoiceLine",
        "toOne": {
          "type": "InvoiceLine",
          "column": "taxhist_parent_id"
        }
      },
      {
        "name": "taxType",
        "toOne": {
          "type": "TaxType",
          "column": "taxhist_taxtype_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_tax_id"
        }
      },
      {
        "name": "basis",
        "attr": {
          "type": "Number",
          "column": "taxhist_basis"
        }
      },
      {
        "name": "basisTaxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_basis_tax_id"
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "taxhist_sequence"
        }
      },
      {
        "name": "percent",
        "attr": {
          "type": "Number",
          "column": "taxhist_percent"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "taxhist_amount"
        }
      },
      {
        "name": "tax",
        "attr": {
          "type": "Number",
          "column": "taxhist_tax"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "taxhist_docdate"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "taxhist_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "taxhist_curr_rate"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "InvoiceRecurrence",
    "table": "recur",
    "idSequenceName": "recur_recur_id_seq",
    "comment": "Invoice Recurrence Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "recur_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "parentType",
        "attr": {
          "type": "String",
          "column": "recur_parent_type",
          "value": "I"
        }
      },
      {
        "name": "invoice",
        "toOne": {
          "type": "Invoice",
          "column": "recur_parent_id"
        }
      },
      {
        "name": "period",
        "attr": {
          "type": "String",
          "column": "recur_period"
        }
      },
      {
        "name": "frequency",
        "attr": {
          "type": "Number",
          "column": "recur_freq"
        }
      },
      {
        "name": "startDate",
        "attr": {
          "type": "Date",
          "column": "recur_start"
        }
      },
      {
        "name": "endDate",
        "attr": {
          "type": "Date",
          "column": "recur_end"
        }
      },
      {
        "name": "maximum",
        "attr": {
          "type": "Number",
          "column": "recur_max"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "InvoiceTaxAdjustment",
    "table": "xt.invcheadtaxadj",
    "idSequenceName": "taxhist_taxhist_id_seq",
    "comment": "Invoice Tax Adjustment Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxhist_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "invoice",
        "toOne": {
          "type": "Invoice",
          "column": "taxhist_parent_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_tax_id"
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "taxhist_sequence"
        }
      },
      {
        "name": "tax",
        "attr": {
          "type": "Number",
          "column": "taxhist_tax"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "taxhist_docdate"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "InvoiceTaxFreight",
    "table": "invcheadtax",
    "comment": "Invoice Freight Tax Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxhist_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "invoice",
        "toOne": {
          "type": "Invoice",
          "column": "taxhist_parent_id"
        }
      },
      {
        "name": "taxType",
        "toOne": {
          "type": "TaxType",
          "column": "taxhist_taxtype_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_tax_id"
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "taxhist_sequence"
        }
      },
      {
        "name": "tax",
        "attr": {
          "type": "Number",
          "column": "taxhist_tax"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "taxhist_docdate"
        }
      }
    ],
    "extensions": [
      {
        "table": "taxtype",
        "isChild": true,
        "relations": [
          {
            "column": "taxtype_id",
            "inverse": "taxType"
          }
        ],
        "properties": [
          {
            "name": "taxTypeName",
            "attr": {
              "type": "String",
              "column": "taxtype_name",
              "value": "Freight",
              "isVisible": false
            }
          }
        ],
        "nameSpace": "XM"
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ItemConversion",
    "table": "itemuomconv",
    "idSequenceName": "itemuomconv_itemuomconv_id_seq",
    "comment": "Item Conversion Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "itemuomconv_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "item",
        "toOne": {
          "type": "Item",
          "column": "itemuomconv_item_id"
        }
      },
      {
        "name": "fromUnit",
        "toOne": {
          "type": "Unit",
          "column": "itemuomconv_from_uom_id"
        }
      },
      {
        "name": "fromValue",
        "attr": {
          "type": "Number",
          "column": "itemuomconv_from_value"
        }
      },
      {
        "name": "toUnit",
        "toOne": {
          "type": "Unit",
          "column": "itemuomconv_to_uom_id"
        }
      },
      {
        "name": "toValue",
        "attr": {
          "type": "Number",
          "column": "itemuomconv_to_value"
        }
      },
      {
        "name": "fractional",
        "attr": {
          "type": "Boolean",
          "column": "itemuomconv_fractional"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ItemConversionTypeAssignment",
    "table": "itemuom",
    "idSequenceName": "itemuom_itemuom_id_seq",
    "comment": "Item Conversion Type Assignment Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "itemuom_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "itemConversion",
        "toOne": {
          "type": "ItemConversion",
          "column": "itemuom_itemuomconv_id"
        }
      },
      {
        "name": "unitType",
        "toOne": {
          "type": "Unit",
          "column": "itemuom_uomtype_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ItemConversionUnitType",
    "table": "itemuom",
    "idSequenceName": "itemuom_itemuom_id_seq",
    "comment": "Item Conversion Unit Type Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "itemuom_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "itemUnitConversion",
        "toOne": {
          "type": "ItemConversion",
          "column": "itemuom_itemuomconv_id"
        }
      },
      {
        "name": "itemUnitType",
        "attr": {
          "type": "Number",
          "column": "itemuom_uomtype_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ItemTax",
    "table": "itemtax",
    "idSequenceName": "itemtax_itemtax_id_seq",
    "comment": "Item Tax Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "itemtax_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "itemTax",
        "attr": {
          "type": "Number",
          "column": "itemtax_item_id"
        }
      },
      {
        "name": "itemTaxType",
        "attr": {
          "type": "Number",
          "column": "itemtax_taxtype_id"
        }
      },
      {
        "name": "itemTaxZone",
        "attr": {
          "type": "Number",
          "column": "itemtax_taxzone_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Journal",
    "table": "xt.jrnl",
    "comment": "Journal Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "ViewJournals",
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "jrnl_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "date",
        "attr": {
          "type": "Date",
          "column": "jrnl_date"
        }
      },
      {
        "name": "series",
        "attr": {
          "type": "Number",
          "column": "jrnl_sequence"
        }
      },
      {
        "name": "source",
        "attr": {
          "type": "String",
          "column": "jrnl_type"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "jrnl_doctype"
        }
      },
      {
        "name": "documentNumber",
        "attr": {
          "type": "String",
          "column": "jrnl_docnumber"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "jrnl_notes"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "jrnl_accnt_id"
        }
      },
      {
        "name": "sense",
        "attr": {
          "type": "String",
          "column": "jrnl_sense"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "jrnl_amount"
        }
      },
      {
        "name": "journal",
        "attr": {
          "type": "Boolean",
          "column": "jrnl_number"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "jrnl_created"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "jrnl_username"
        }
      }
    ],
    "order": [
      "jrnl_date",
      "jrnl_sequence DESC",
      "jrnl_sense DESC"
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "LayoutIncomeStatement",
    "table": "flhead",
    "idSequenceName": "flhead_flhead_id_seq",
    "comment": "Layout Income Statement Map",
    "privileges": {
      "all": {
        "create": "MaintainFinancialLayouts",
        "read": "ViewFinancialLayouts",
        "update": "MaintainFinancialLayouts",
        "delete": "MaintainFinancialLayouts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "flhead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "flhead_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "flhead_descrip"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "flhead_active"
        }
      },
      {
        "name": "layoutType",
        "attr": {
          "type": "String",
          "column": "flhead_type",
          "value": "I"
        }
      },
      {
        "name": "groups",
        "toMany": {
          "isNested": true,
          "type": "LayoutIncomeStatementGroup",
          "column": "flhead_id",
          "inverse": "layoutIncomeStatement"
        }
      },
      {
        "name": "details",
        "toMany": {
          "isNested": true,
          "type": "LayoutIncomeStatementDetail",
          "column": "flhead_id",
          "inverse": "layoutIncomeStatement"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "flhead_notes"
        }
      },
      {
        "name": "isShowTotal",
        "attr": {
          "type": "Boolean",
          "column": "flhead_showtotal"
        }
      },
      {
        "name": "isAlternateBudget",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealtbudget"
        }
      },
      {
        "name": "budgetLabel",
        "attr": {
          "type": "String",
          "column": "flhead_altbudget"
        }
      },
      {
        "name": "isAlternateTotal",
        "attr": {
          "type": "Boolean",
          "column": "flhead_usealttotal"
        }
      },
      {
        "name": "alternateTotalLabel",
        "attr": {
          "type": "String",
          "column": "flhead_alttotal"
        }
      },
      {
        "name": "isSystem",
        "attr": {
          "type": "Boolean",
          "column": "flhead_sys"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "LayoutIncomeStatementDetail",
    "table": "flitem",
    "idSequenceName": "flitemitem_flitemitem_id_seq",
    "comment": "Layout Income Statement Detail Map",
    "privileges": {
      "all": {
        "create": "MaintainFinancialLayouts",
        "read": "ViewFinancialLayouts",
        "update": "MaintainFinancialLayouts",
        "delete": "MaintainFinancialLayouts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "flitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "layoutIncomeStatement",
        "toOne": {
          "type": "LayoutIncomeStatement",
          "column": "flitem_flhead_id"
        }
      },
      {
        "name": "layoutIncomeStatementGroup",
        "toOne": {
          "type": "LayoutIncomeStatementGroup",
          "column": "flitem_flgrp_id"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "flitem_accnt_id"
        }
      },
      {
        "name": "company",
        "attr": {
          "type": "String",
          "column": "flitem_company"
        }
      },
      {
        "name": "profitCenter",
        "attr": {
          "type": "String",
          "column": "flitem_profit"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "flitem_number"
        }
      },
      {
        "name": "subAccount",
        "attr": {
          "type": "String",
          "column": "flitem_sub"
        }
      },
      {
        "name": "accountType",
        "attr": {
          "type": "String",
          "column": "flitem_type"
        }
      },
      {
        "name": "subType",
        "attr": {
          "type": "String",
          "column": "flitem_subaccnttype_code"
        }
      },
      {
        "name": "isSubtract",
        "attr": {
          "type": "Boolean",
          "column": "flitem_subtract"
        }
      },
      {
        "name": "isShowBudget",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showbudget"
        }
      },
      {
        "name": "isShowBudgetPercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showbudgetprcnt"
        }
      },
      {
        "name": "isShowDifference",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showdiff"
        }
      },
      {
        "name": "isShowDifferencePercent",
        "attr": {
          "type": "Boolean",
          "column": "flitem_showdiffprcnt"
        }
      },
      {
        "name": "customSource",
        "attr": {
          "type": "Boolean",
          "column": "flitem_custom_source",
          "value": "S"
        }
      },
      {
        "name": "percentlayoutIncomeStatementGroup",
        "toOne": {
          "type": "LayoutIncomeStatementGroup",
          "column": "flitem_prcnt_flgrp_id"
        }
      },
      {
        "name": "order",
        "attr": {
          "type": "Number",
          "column": "flitem_order"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "LayoutIncomeStatementGroup",
    "table": "flgrp",
    "idSequenceName": "flgrp_flgrp_id_seq",
    "comment": "Layout Income Statement Group Map",
    "privileges": {
      "all": {
        "create": "MaintainFinancialLayouts",
        "read": "ViewFinancialLayouts",
        "update": "MaintainFinancialLayouts",
        "delete": "MaintainFinancialLayouts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "flgrp_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "layoutIncomeStatement",
        "toOne": {
          "type": "LayoutIncomeStatement",
          "column": "flgrp_flhead_id"
        }
      },
      {
        "name": "layoutIncomeStatementGroup",
        "toOne": {
          "type": "LayoutIncomeStatementGroup",
          "column": "flgrp_flgrp_id"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "flgrp_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "flgrp_descrip"
        }
      },
      {
        "name": "isShowSubtotal",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_subtotal"
        }
      },
      {
        "name": "isAlternateSubtotal",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_usealtsubtotal"
        }
      },
      {
        "name": "alternateSubtotalLabel",
        "attr": {
          "type": "String",
          "column": "flgrp_altsubtotal"
        }
      },
      {
        "name": "percentLayoutIncomeStatementGroup",
        "toOne": {
          "type": "FinancialLayoutGroup",
          "column": "flgrp_prcnt_flgrp_id"
        }
      },
      {
        "name": "isSummarize",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_summarize"
        }
      },
      {
        "name": "isSubtract",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_subtract"
        }
      },
      {
        "name": "isShowBudget",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showbudget"
        }
      },
      {
        "name": "isShowBudgetPercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showbudgetprcnt"
        }
      },
      {
        "name": "isShowDifference",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showdiff"
        }
      },
      {
        "name": "isShowDifferencePercent",
        "attr": {
          "type": "Boolean",
          "column": "flgrp_showdiffprcnt"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "LedgerAccount",
    "table": "accnt",
    "idSequenceName": "accnt_accnt_id_seq",
    "comment": "Ledger Account Map",
    "privileges": {
      "all": {
        "create": "MaintainChartOfAccounts",
        "read": "MaintainChartOfAccounts",
        "update": "MaintainChartOfAccounts",
        "delete": "MaintainChartOfAccounts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "accnt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "company",
        "attr": {
          "type": "String",
          "column": "accnt_company"
        }
      },
      {
        "name": "profitCenter",
        "attr": {
          "type": "String",
          "column": "accnt_profit"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "accnt_number"
        }
      },
      {
        "name": "subAccount",
        "attr": {
          "type": "String",
          "column": "accnt_sub"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "accnt_descrip"
        }
      },
      {
        "name": "externalReference",
        "attr": {
          "type": "String",
          "column": "accnt_extref"
        }
      },
      {
        "name": "accountType",
        "attr": {
          "type": "String",
          "column": "accnt_type"
        }
      },
      {
        "name": "subType",
        "attr": {
          "type": "String",
          "column": "accnt_subaccnttype_code"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "accnt_active"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "accnt_comments"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "LedgerAccountInfo",
    "table": "accnt",
    "comment": "Ledger Account Info Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "accnt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "company",
        "attr": {
          "type": "String",
          "column": "accnt_company"
        }
      },
      {
        "name": "profitCenter",
        "attr": {
          "type": "String",
          "column": "accnt_profit"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "accnt_number"
        }
      },
      {
        "name": "subAccount",
        "attr": {
          "type": "String",
          "column": "accnt_sub"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "accnt_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "accnt_descrip"
        }
      },
      {
        "name": "accountType",
        "attr": {
          "type": "String",
          "column": "accnt_type"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Payable",
    "table": "apopen",
    "idSequenceName": "apopen_apopen_id_seq",
    "orderSequence": "APMemoNumber",
    "comment": "Receivable Map",
    "privileges": {
      "all": {
        "create": "MaintainAPMemos",
        "read": "ViewAPMemos",
        "update": "MaintainAPMemos",
        "delete": "MaintainAPMemos"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "apopen_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "isNested": true,
          "type": "VendorInfo",
          "column": "apopen_vend_id",
          "inverse": "id"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "apopen_docdate"
        }
      },
      {
        "name": "dueDate",
        "attr": {
          "type": "Date",
          "column": "apopen_duedate"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "apopen_doctype"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "apopen_docnumber"
        }
      },
      {
        "name": "orderNumber",
        "attr": {
          "type": "String",
          "column": "apopen_ponumber"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "apopen_terms_id"
        }
      },
      {
        "name": "payableStatus",
        "toOne": {
          "type": "String",
          "column": "apopen_status"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "apopen_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "apopen_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "apopen_curr_rate"
        }
      },
      {
        "name": "adjustmentTaxes",
        "toMany": {
          "isNested": true,
          "type": "PayableTaxAdjustment",
          "column": "apopen_id",
          "inverse": "payable"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "apopen_notes"
        }
      },
      {
        "name": "applications",
        "toMany": {
          "isNested": true,
          "type": "PayableApplication",
          "column": "apopen_id",
          "inverse": "payable"
        }
      },
      {
        "name": "isOpen",
        "attr": {
          "type": "Date",
          "column": "apopen_open"
        }
      },
      {
        "name": "closeDate",
        "attr": {
          "type": "Date",
          "column": "apopen_closedate"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "apopen_username"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "PayableApplication",
    "table": "xt.apapply",
    "comment": "Payable Application Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "ViewAPOpenItems",
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "apapply_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "type": "Vendor",
          "column": "apapply_vend_id",
          "inverse": "id"
        }
      },
      {
        "name": "payable",
        "toOne": {
          "type": "Payable",
          "column": "apopen_id",
          "inverse": "id"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "doctype"
        }
      },
      {
        "name": "documentNumber",
        "attr": {
          "type": "String",
          "column": "apapply_source_docnumber"
        }
      },
      {
        "name": "postDate",
        "attr": {
          "type": "Date",
          "column": "apapply_postdate"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "apapply_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "apapply_curr_id"
        }
      },
      {
        "name": "paid",
        "attr": {
          "type": "Number",
          "column": "apapply_target_paid"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "apapply_username"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "PayablePendingApplication",
    "table": "checkitem",
    "comment": "Payable Pending Application Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "checkitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "payment",
        "toOne": {
          "type": "Payment",
          "column": "checkitem_checkhead_id"
        }
      },
      {
        "name": "payable",
        "toOne": {
          "type": "Payable",
          "column": "checkitem_apopen_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "checkitem_amount"
        }
      },
      {
        "name": "discount",
        "attr": {
          "type": "Number",
          "column": "checkitem_discount"
        }
      }
    ],
    "extensions": [
      {
        "table": "checkhead",
        "isChild": true,
        "relations": [
          {
            "column": "checkhead_id",
            "inverse": "payment"
          }
        ],
        "properties": [
          {
            "name": "isPosted",
            "attr": {
              "type": "Boolean",
              "column": "checkhead_posted",
              "value": false,
              "isVisible": false
            }
          },
          {
            "name": "isVoid",
            "attr": {
              "type": "Boolean",
              "column": "checkhead_void",
              "value": false,
              "isVisible": false
            }
          }
        ],
        "nameSpace": "XM"
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "PayableTaxAdjustment",
    "table": "apopentax",
    "idSequenceName": "taxhist_taxhist_id_seq",
    "comment": "Payable Tax Adjustment Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxhist_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "payable",
        "toOne": {
          "type": "Payable",
          "column": "taxhist_parent_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_tax_id"
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "taxhist_sequence"
        }
      },
      {
        "name": "tax",
        "attr": {
          "type": "Number",
          "column": "taxhist_tax"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "taxhist_docdate"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Payment",
    "table": "checkhead",
    "idSequenceName": "checkhead_checkhead_id_seq",
    "comment": "Payment Map",
    "privileges": {
      "all": {
        "create": "MaintainPayments",
        "read": "ViewPayments",
        "update": "MaintainPayments",
        "delete": "MaintainPayments"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "checkhead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "bankAccount",
        "toOne": {
          "type": "BankAccount",
          "column": "checkhead_bankaccnt_id"
        }
      },
      {
        "name": "paymentDate",
        "attr": {
          "type": "Date",
          "column": "checkhead_checkdate"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "Number",
          "column": "checkhead_number"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "checkhead_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "checkhead_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "checkhead_curr_rate"
        }
      },
      {
        "name": "isMiscellaneous",
        "attr": {
          "type": "Boolean",
          "column": "checkhead_misc"
        }
      },
      {
        "name": "isPrinted",
        "attr": {
          "type": "Boolean",
          "column": "checkhead_printed"
        }
      },
      {
        "name": "isPosted",
        "attr": {
          "type": "Boolean",
          "column": "checkhead_posted"
        }
      },
      {
        "name": "isVoid",
        "attr": {
          "type": "Boolean",
          "column": "checkhead_void"
        }
      },
      {
        "name": "isReplaced",
        "attr": {
          "type": "Boolean",
          "column": "checkhead_replaced"
        }
      },
      {
        "name": "expenseCategory",
        "toOne": {
          "type": "ExpenseCategory",
          "column": "checkhead_expcat_id"
        }
      },
      {
        "name": "for",
        "attr": {
          "type": "String",
          "column": "checkhead_for"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "checkhead_notes"
        }
      },
      {
        "name": "isDeleted",
        "attr": {
          "type": "Boolean",
          "column": "checkhead_deleted"
        }
      },
      {
        "name": "achBatch",
        "attr": {
          "type": "String",
          "column": "checkhead_ach_batch"
        }
      },
      {
        "name": "details",
        "toMany": {
          "isNested": true,
          "type": "PaymentDetail",
          "column": "checkhead_id",
          "inverse": "payment"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "PaymentApproval",
    "table": "apselect",
    "idSequenceName": "apselect_apselect_id_seq",
    "comment": " Map",
    "privileges": {
      "all": {
        "create": "MaintainPayments",
        "read": "MaintainPayments",
        "update": "MaintainPayments",
        "delete": "MaintainPayments"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "apselect_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "payable",
        "toOne": {
          "type": "Payable",
          "column": "apselect_apopen_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "apselect_amount"
        }
      },
      {
        "name": "bankAccount",
        "toOne": {
          "type": "BankAccount",
          "column": "apselect_bankaccnt_id"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "apselect_curr_id"
        }
      },
      {
        "name": "date",
        "attr": {
          "type": "Date",
          "column": "apselect_date"
        }
      },
      {
        "name": "discount",
        "attr": {
          "type": "Number",
          "column": "apselect_discount"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "PaymentDetail",
    "table": "checkitem",
    "idSequenceName": "checkitem_checkitem_id_seq",
    "comment": "Payment Detail Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "checkitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "payment",
        "toOne": {
          "type": "Payment",
          "column": "checkitem_checkhead_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "checkitem_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "checkitem_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "checkitem_curr_rate"
        }
      },
      {
        "name": "discount",
        "attr": {
          "type": "Number",
          "column": "checkitem_discount"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "checkitem_docdate"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Period",
    "table": "period",
    "idSequenceName": "period_period_id_seq",
    "comment": "Period Map",
    "privileges": {
      "all": {
        "create": "MaintainAccountingPeriods",
        "read": true,
        "update": "MaintainAccountingPeriods",
        "delete": "MaintainAccountingPeriods"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "period_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "period_name"
        }
      },
      {
        "name": "start",
        "attr": {
          "type": "Date",
          "column": "period_start"
        }
      },
      {
        "name": "end",
        "attr": {
          "type": "Date",
          "column": "period_end"
        }
      },
      {
        "name": "fiscalYear",
        "toOne": {
          "type": "FiscalYear",
          "column": "period_yearperiod_id"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "Number",
          "column": "period_number"
        }
      },
      {
        "name": "quarter",
        "attr": {
          "type": "Number",
          "column": "period_quarter"
        }
      },
      {
        "name": "frozen",
        "attr": {
          "type": "Boolean",
          "column": "period_freeze"
        }
      },
      {
        "name": "closed",
        "attr": {
          "type": "Boolean",
          "column": "period_closed"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ReasonCode",
    "table": "rsncode",
    "comment": "Reason Code Map",
    "privileges": {
      "all": {
        "create": "MaintainReasonCodes",
        "read": true,
        "update": "MaintainReasonCodes",
        "delete": "MaintainReasonCodes"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "rsncode_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "rsncode_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "rsncode_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Receivable",
    "table": "aropen",
    "idSequenceName": "aropen_aropen_id_seq",
    "orderSequence": "ARMemoNumber",
    "comment": "Receivable Map",
    "privileges": {
      "all": {
        "create": "MaintainARMemos",
        "read": "ViewARMemos",
        "update": "MaintainARMemos",
        "delete": "MaintainARMemos"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "aropen_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "isNested": true,
          "type": "CustomerInfo",
          "column": "aropen_cust_id",
          "inverse": "id"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "aropen_docdate"
        }
      },
      {
        "name": "dueDate",
        "attr": {
          "type": "Date",
          "column": "aropen_duedate"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "aropen_doctype"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "aropen_docnumber"
        }
      },
      {
        "name": "orderNumber",
        "attr": {
          "type": "String",
          "column": "aropen_ordernumber"
        }
      },
      {
        "name": "reasonCode",
        "toOne": {
          "type": "ReasonCode",
          "column": "aropen_rsncode_id",
          "inverse": "id"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "aropen_terms_id"
        }
      },
      {
        "name": "salesRep",
        "toOne": {
          "type": "SalesRep",
          "column": "aropen_salesrep_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "aropen_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "aropen_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "aropen_curr_rate"
        }
      },
      {
        "name": "adjustmentTaxes",
        "toMany": {
          "isNested": true,
          "type": "ReceivableTaxAdjustment",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      },
      {
        "name": "commissionDue",
        "attr": {
          "type": "Number",
          "column": "aropen_commission_due"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "aropen_notes"
        }
      },
      {
        "name": "applications",
        "toMany": {
          "isNested": true,
          "type": "ReceivableApplication",
          "column": "aropen_id",
          "inverse": "receivable"
        }
      },
      {
        "name": "isOpen",
        "attr": {
          "type": "Boolean",
          "column": "aropen_open"
        }
      },
      {
        "name": "closeDate",
        "attr": {
          "type": "Date",
          "column": "aropen_closedate"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "aropen_username"
        }
      }
    ],
    "order": [
      "aropen_docdate desc",
      "aropen_docnumber desc"
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ReceivableApplication",
    "table": "xt.arapply",
    "comment": "Receivable Application Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "ViewAROpenItems",
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "arapply_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "customer",
        "toOne": {
          "type": "Customer",
          "column": "arapply_cust_id",
          "inverse": "id"
        }
      },
      {
        "name": "receivable",
        "toOne": {
          "type": "Receivable",
          "column": "aropen_id",
          "inverse": "id"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "doctype"
        }
      },
      {
        "name": "documentNumber",
        "attr": {
          "type": "String",
          "column": "docnumber"
        }
      },
      {
        "name": "postDate",
        "attr": {
          "type": "Date",
          "column": "arapply_postdate"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "arapply_applied"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "arapply_curr_id"
        }
      },
      {
        "name": "paid",
        "attr": {
          "type": "Number",
          "column": "arapply_target_paid"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "arapply_username"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ReceivableInfo",
    "table": "aropen",
    "comment": "Receivable Info Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "aropen_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "aropen_docnumber"
        }
      },
      {
        "name": "documentType",
        "attr": {
          "type": "String",
          "column": "aropen_doctype"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ReceivablePendingApplication",
    "table": "xt.arpending",
    "comment": "Receivable Pending Application Map",
    "privileges": {
      "all": {
        "create": "false",
        "read": "true",
        "update": "false",
        "delete": "false"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "arpending_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "pendingApplicationType",
        "attr": {
          "type": "String",
          "column": "arpending_type"
        }
      },
      {
        "name": "receivable",
        "toOne": {
          "type": "CashReceiptReceivable",
          "column": "arpending_aropen_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "arpending_amount"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ReceivableTaxAdjustment",
    "table": "aropentax",
    "idSequenceName": "taxhist_taxhist_id_seq",
    "comment": "Receivable Tax Adjustment Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxhist_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "receivable",
        "toOne": {
          "type": "Receivable",
          "column": "taxhist_parent_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_tax_id"
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "taxhist_sequence"
        }
      },
      {
        "name": "tax",
        "attr": {
          "type": "Number",
          "column": "taxhist_tax"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "taxhist_docdate"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "SalesCategory",
    "table": "salescat",
    "idSequenceName": "salescat_salescat_id_seq",
    "comment": "Sales Category Map",
    "privileges": {
      "all": {
        "create": "MaintainSalesCategories",
        "read": true,
        "update": "MaintainSalesCategories",
        "delete": "MaintainSalesCategories"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "salescat_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "salescat_active"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "salescat_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "salescat_descrip"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ShipCharge",
    "table": "shipchrg",
    "idSequenceName": "shipchrg_shipchrg_id_seq",
    "comment": "Ship Charge Map",
    "privileges": {
      "all": {
        "create": "MaintainShippingChargeTypes",
        "read": true,
        "update": "MaintainShippingChargeTypes",
        "delete": "MaintainShippingChargeTypes"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "shipchrg_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "shipchrg_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "shipchrg_descrip"
        }
      },
      {
        "name": "isCustomerPay",
        "attr": {
          "type": "Boolean",
          "column": "shipchrg_custfreight"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ShipVia",
    "table": "shipvia",
    "idSequenceName": "shipvia_shipvia_id_seq",
    "comment": "Ship Via Map",
    "privileges": {
      "all": {
        "create": "MaintainShipVias",
        "read": true,
        "update": "MaintainShipVias",
        "delete": "MaintainShipVias"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "shipvia_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "shipvia_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "shipvia_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "ShipZone",
    "table": "shipzone",
    "idSequenceName": "shipzone_shipzone_id_seq",
    "comment": "Ship Zone Map",
    "privileges": {
      "all": {
        "create": "MaintainShippingZones",
        "read": true,
        "update": "MaintainShippingZones",
        "delete": "MaintainShippingZones"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "shipzone_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "shipzone_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "shipzone_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "StandardJournal",
    "table": "stdjrnl",
    "comment": "Standard Journal Map",
    "privileges": {
      "all": {
        "create": "MaintainStandardJournals",
        "read": "MaintainStandardJournals",
        "update": "MaintainStandardJournals",
        "delete": "MaintainStandardJournals"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "stdjrnl_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "Date",
          "column": "stdjrnl_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "stdjrnl_descrip"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "stdjrnl_notes"
        }
      },
      {
        "name": "items",
        "toMany": {
          "isNested": true,
          "type": "StandardJournalItem",
          "column": "stdjrnl_id",
          "inverse": "standardJournal"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "StandardJournalGroup",
    "table": "stdjrnlgrp",
    "comment": "Standard Journal Group Map",
    "privileges": {
      "all": {
        "create": "MaintainStandardJournalGroups",
        "read": "MaintainStandardJournalGroups",
        "update": "MaintainStandardJournalGroups",
        "delete": "MaintainStandardJournalGroups"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "stdjrnlgrp_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "Date",
          "column": "stdjrnlgrp_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "stdjrnlgrp_descrip"
        }
      },
      {
        "name": "items",
        "toMany": {
          "isNested": true,
          "type": "StandardJournalGroupItem",
          "column": "stdjrnlgrp_id",
          "inverse": "standardJournalGroup"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "StandardJournalGroupItem",
    "table": "stdjrnlgrpitem",
    "comment": "Standard Journal Group Item Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "stdjrnlgrpitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "standardJournalGroup",
        "toOne": {
          "type": "StandardJournalGroup",
          "column": "stdjrnlgrpitem_stdjrnlgrp_id"
        }
      },
      {
        "name": "standardJournal",
        "toOne": {
          "type": "StandardJournal",
          "column": "stdjrnlgrpitem_stdjrnl_id"
        }
      },
      {
        "name": "apply",
        "attr": {
          "type": "Number",
          "column": "stdjrnlgrpitem_applied"
        }
      },
      {
        "name": "effective",
        "attr": {
          "type": "Date",
          "column": "stdjrnlgrpitem_effective"
        }
      },
      {
        "name": "expires",
        "attr": {
          "type": "Date",
          "column": "stdjrnlgrpitem_expires"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "StandardJournalItem",
    "table": "stdjrnlitem",
    "comment": "Standard Journal Item Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "stdjrnlitem_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "standardJournal",
        "toOne": {
          "type": "StandardJournal",
          "column": "stdjrnlitem_stdjrnl_id"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "stdjrnlitem_accnt_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "stdjrnlitem_amount"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "stdjrnlitem_notes"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "SubAccount",
    "table": "subaccnt",
    "idSequenceName": "subaccnt_subaccnt_id_seq",
    "comment": "Sub Account Map",
    "privileges": {
      "all": {
        "create": "MaintainChartOfAccounts",
        "read": true,
        "update": "MaintainChartOfAccounts",
        "delete": "MaintainChartOfAccounts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "subaccnt_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "subaccnt_number"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "subaccnt_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "SubAccountType",
    "table": "subaccnttype",
    "idSequenceName": "subaccnttype_subaccnttype_id_seq",
    "comment": "Sub Account Type Map",
    "privileges": {
      "all": {
        "create": "MaintainChartOfAccounts",
        "read": true,
        "update": "MaintainChartOfAccounts",
        "delete": "MaintainChartOfAccounts"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "subaccnttype_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "accountType",
        "attr": {
          "type": "String",
          "column": "subaccnttype_accnt_type"
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "subaccnttype_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "subaccnttype_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TaxAssignment",
    "table": "taxass",
    "idSequenceName": "taxass_taxass_id_seq",
    "comment": "Tax Assignment Map",
    "privileges": {
      "all": {
        "create": "MaintainTaxAssignments",
        "read": "ViewTaxAssignments",
        "update": "MaintainTaxAssignments",
        "delete": "MaintainTaxAssignments"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxass_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "taxass_taxzone_id"
        }
      },
      {
        "name": "taxType",
        "toOne": {
          "type": "TaxType",
          "column": "taxass_taxtype_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxass_tax_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TaxClass",
    "table": "taxclass",
    "idSequenceName": "taxclass_taxclass_id_seq",
    "comment": "Tax Class Map",
    "privileges": {
      "all": {
        "create": "MaintainTaxClasses",
        "read": "ViewTaxClasses",
        "update": "MaintainTaxClasses",
        "delete": "MaintainTaxClasses"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxclass_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "taxclass_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "taxclass_descrip"
        }
      },
      {
        "name": "groupSequence",
        "attr": {
          "type": "Number",
          "column": "taxclass_sequence"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TaxCode",
    "table": "tax",
    "idSequenceName": "tax_tax_id_seq",
    "comment": "Tax Code Map",
    "privileges": {
      "all": {
        "create": "MaintainTaxCodes",
        "read": "ViewTaxCodes",
        "update": "MaintainTaxCodes",
        "delete": "MaintainTaxCodes"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "tax_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "tax_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "tax_descrip"
        }
      },
      {
        "name": "taxClass",
        "toOne": {
          "type": "TaxClass",
          "column": "tax_taxclass_id"
        }
      },
      {
        "name": "taxAuthority",
        "toOne": {
          "type": "TaxAuthority",
          "column": "tax_taxauth_id"
        }
      },
      {
        "name": "basisTaxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "tax_basis_tax_id"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TaxRate",
    "table": "taxrate",
    "idSequenceName": "taxrate_taxrate_id_seq",
    "comment": "Tax Rate Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxrate_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxrate_tax_id"
        }
      },
      {
        "name": "percent",
        "attr": {
          "type": "Number",
          "column": "taxrate_percent"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "taxrate_amount"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "isNested": true,
          "type": "Currency",
          "column": "taxrate_curr_id"
        }
      },
      {
        "name": "effective",
        "attr": {
          "type": "Date",
          "column": "taxrate_effective"
        }
      },
      {
        "name": "expires",
        "attr": {
          "type": "Date",
          "column": "taxrate_expires"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TaxRegistration",
    "table": "taxreg",
    "idSequenceName": "taxreg_taxreg_id_seq",
    "comment": "Tax Registration Map",
    "privileges": {
      "all": {
        "create": "MaintainTaxRegistrations",
        "read": true,
        "update": "MaintainTaxRegistrations",
        "delete": "MaintainTaxRegistrations"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxreg_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "relation",
        "attr": {
          "type": "Number",
          "column": "taxreg_rel_id",
          "value": -1
        }
      },
      {
        "name": "taxAuthority",
        "toOne": {
          "type": "TaxAuthority",
          "column": "taxreg_taxauth_id"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "taxreg_number"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "taxreg_taxzone_id"
        }
      },
      {
        "name": "effective",
        "attr": {
          "type": "Date",
          "column": "taxreg_effective"
        }
      },
      {
        "name": "expires",
        "attr": {
          "type": "Date",
          "column": "taxreg_expires"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "taxreg_notes"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TaxType",
    "table": "taxtype",
    "idSequenceName": "taxtype_taxtype_id_seq",
    "comment": "Tax Type Map",
    "privileges": {
      "all": {
        "create": "MaintainTaxTypes",
        "read": "ViewTaxTypes",
        "update": "MaintainTaxTypes",
        "delete": "MaintainTaxTypes"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxtype_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "taxtype_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "taxtype_descrip"
        }
      },
      {
        "name": "isSystem",
        "attr": {
          "type": "Boolean",
          "column": "taxtype_sys"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TaxZone",
    "table": "taxzone",
    "idSequenceName": "taxzone_taxzone_id_seq",
    "comment": "Tax Zone Map",
    "privileges": {
      "all": {
        "create": "MaintainTaxZones",
        "read": true,
        "update": "MaintainTaxZones",
        "delete": "MaintainTaxZones"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxzone_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "taxzone_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "taxzone_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Terms",
    "table": "terms",
    "idSequenceName": "terms_terms_id_seq",
    "comment": "Terms Map",
    "privileges": {
      "all": {
        "create": "MaintainTerms",
        "read": true,
        "update": "MaintainTerms",
        "delete": "MaintainTerms"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "terms_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "terms_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "terms_descrip"
        }
      },
      {
        "name": "termsType",
        "attr": {
          "type": "String",
          "column": "terms_type"
        }
      },
      {
        "name": "dueDays",
        "attr": {
          "type": "Number",
          "column": "terms_duedays"
        }
      },
      {
        "name": "discountDays",
        "attr": {
          "type": "Number",
          "column": "terms_discdays"
        }
      },
      {
        "name": "discountPercent",
        "attr": {
          "type": "Number",
          "column": "terms_discprcnt"
        }
      },
      {
        "name": "cutOffDay",
        "attr": {
          "type": "Number",
          "column": "terms_cutoffday"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "TrialBalance",
    "table": "trialbal",
    "comment": "Trial Balance Map",
    "privileges": {
      "all": {
        "create": false,
        "read": "ViewTrialBalances",
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "trialbal_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "period",
        "toOne": {
          "type": "Period",
          "column": "trialbal_period_id"
        }
      },
      {
        "name": "ledgerAccount",
        "toOne": {
          "isNested": true,
          "type": "LedgerAccountInfo",
          "column": "trialbal_accnt_id"
        }
      },
      {
        "name": "beginning",
        "attr": {
          "type": "Number",
          "column": "trialbal_beginning"
        }
      },
      {
        "name": "ending",
        "attr": {
          "type": "Number",
          "column": "trialbal_ending"
        }
      },
      {
        "name": "credits",
        "attr": {
          "type": "Number",
          "column": "trialbal_credits"
        }
      },
      {
        "name": "debits",
        "attr": {
          "type": "Number",
          "column": "trialbal_debits"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "UnitConversion",
    "table": "uomconv",
    "idSequenceName": "uomconv_uomconv_id_seq",
    "comment": "Unit Conversion Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "uomconv_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "fromUnit",
        "toOne": {
          "type": "Unit",
          "column": "uomconv_from_uom_id"
        }
      },
      {
        "name": "fromValue",
        "attr": {
          "type": "Number",
          "column": "uomconv_from_value"
        }
      },
      {
        "name": "toUnit",
        "toOne": {
          "type": "Unit",
          "column": "uomconv_to_uom_id"
        }
      },
      {
        "name": "toValue",
        "attr": {
          "type": "Number",
          "column": "uomconv_to_value"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "UnitType",
    "table": "uomtype",
    "idSequenceName": "uomtype_uomtype_id_seq",
    "comment": "Unit Type Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "uomtype_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "Number",
          "column": "uomtype_name"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "uomtype_descrip"
        }
      },
      {
        "name": "multiple",
        "attr": {
          "type": "Boolean",
          "column": "uomtype_multiple"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Vendor",
    "table": "vendinfo",
    "idSequenceName": "vend_vend_id_seq",
    "orderSequence": "CRMAccountNumber",
    "comment": "Vendor Map",
    "privileges": {
      "all": {
        "create": "MaintainVendors",
        "read": "ViewVendors",
        "update": "MaintainVendors",
        "delete": "MaintainVendors"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "vend_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "vend_number"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "vend_name"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "vend_active"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "vend_comments"
        }
      },
      {
        "name": "isReceives1099",
        "attr": {
          "type": "Boolean",
          "column": "vend_1099"
        }
      },
      {
        "name": "incoTermsSource",
        "attr": {
          "type": "String",
          "column": "vend_fobsource"
        }
      },
      {
        "name": "incoTerms",
        "attr": {
          "type": "String",
          "column": "vend_fob"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "vend_terms_id"
        }
      },
      {
        "name": "shipVia",
        "attr": {
          "type": "String",
          "column": "vend_shipvia"
        }
      },
      {
        "name": "vendorType",
        "toOne": {
          "type": "VendorType",
          "column": "vend_vendtype_id"
        }
      },
      {
        "name": "isQualified",
        "attr": {
          "type": "Boolean",
          "column": "vend_qualified"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "vend_curr_id"
        }
      },
      {
        "name": "primaryContact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "vend_cntct1_id"
        }
      },
      {
        "name": "secondaryContact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "vend_cntct2_id"
        }
      },
      {
        "name": "mainAddress",
        "toOne": {
          "isNested": true,
          "type": "AddressInfo",
          "column": "vend_addr_id"
        }
      },
      {
        "name": "alternateAddresses",
        "toMany": {
          "type": "VendorAddress",
          "column": "vend_id",
          "inverse": "vendor",
          "isNested": true
        }
      },
      {
        "name": "isMatch",
        "attr": {
          "type": "Boolean",
          "column": "vend_match"
        }
      },
      {
        "name": "isAchEnabled",
        "attr": {
          "type": "Boolean",
          "column": "vend_ach_enabled"
        }
      },
      {
        "name": "achAccountType",
        "attr": {
          "type": "String",
          "column": "vend_ach_accnttype"
        }
      },
      {
        "name": "isAchUseVendorInfo",
        "attr": {
          "type": "Boolean",
          "column": "vend_ach_use_vendinfo"
        }
      },
      {
        "name": "achIndividualNumber",
        "attr": {
          "type": "String",
          "column": "vend_ach_indiv_number"
        }
      },
      {
        "name": "achIndividualName",
        "attr": {
          "type": "String",
          "column": "vend_ach_indiv_name"
        }
      },
      {
        "name": "achRoutingNumber",
        "attr": {
          "type": "String",
          "column": "vend_ach_routingnumber",
          "isEncrypted": true
        }
      },
      {
        "name": "achAccountNumber",
        "attr": {
          "type": "String",
          "column": "vend_ach_accntnumber",
          "isEncrypted": true
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "vend_taxzone_id"
        }
      },
      {
        "name": "taxRegistrations",
        "toMany": {
          "type": "VendorTaxRegistration",
          "column": "vend_id",
          "inverse": "vendor",
          "isNested": true
        }
      },
      {
        "name": "comments",
        "toMany": {
          "type": "VendorComment",
          "column": "vend_id",
          "inverse": "vendor",
          "isNested": true
        }
      }
    ],
    "isSystem": true,
    "sourceCode": "V",
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VendorAddress",
    "table": "vendaddrinfo",
    "comment": "Vendor Address Map",
    "privileges": {
      "all": {
        "create": "MaintainVendorAddresses",
        "read": "ViewVendorAddresses",
        "update": "MaintainVendorAddresses",
        "delete": "MaintainVendorAddresses"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "vendaddr_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "type": "Vendor",
          "column": "vendaddr_vend_id"
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "vendaddr_code"
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "vendaddr_name"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "vendaddr_comments"
        }
      },
      {
        "name": "contact",
        "toOne": {
          "isNested": true,
          "type": "ContactInfo",
          "column": "vendaddr_cntct_id"
        }
      },
      {
        "name": "address",
        "toOne": {
          "isNested": true,
          "type": "AddressInfo",
          "column": "vendaddr_addr_id"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VendorComment",
    "table": "comment",
    "idSequenceName": "comment_comment_id_seq",
    "comment": "Vendor Comment Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": "EditOthersComments",
        "delete": false
      },
      "personal": {
        "update": "EditOwnComments",
        "properties": [
          "createdBy"
        ]
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "comment_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "sourceType",
        "attr": {
          "type": "String",
          "column": "comment_source",
          "value": "V"
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "type": "Vendor",
          "column": "comment_source_id"
        }
      },
      {
        "name": "commentType",
        "toOne": {
          "type": "CommentType",
          "column": "comment_cmnttype_id"
        }
      },
      {
        "name": "text",
        "attr": {
          "type": "String",
          "column": "comment_text"
        }
      },
      {
        "name": "isPublic",
        "attr": {
          "type": "Boolean",
          "column": "comment_public"
        }
      },
      {
        "name": "created",
        "attr": {
          "type": "Date",
          "column": "comment_date"
        }
      },
      {
        "name": "createdBy",
        "attr": {
          "type": "String",
          "column": "comment_user"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VendorInfo",
    "table": "vendinfo",
    "comment": "Vendor Info Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "vend_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "vend_name"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "vend_number"
        }
      },
      {
        "name": "isActive",
        "attr": {
          "type": "Boolean",
          "column": "vend_active"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "vend_terms_id"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "vend_curr_id"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VendorTaxRegistration",
    "table": "taxreg",
    "idSequenceName": "taxreg_taxreg_id_seq",
    "comment": "Vendor Tax Registration Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxreg_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "relationType",
        "attr": {
          "type": "String",
          "column": "taxreg_rel_type",
          "value": "V"
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "type": "Vendor",
          "column": "taxreg_rel_id"
        }
      },
      {
        "name": "taxAuthority",
        "toOne": {
          "type": "TaxAuthority",
          "column": "taxreg_taxauth_id"
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "taxreg_number"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "taxreg_taxzone_id"
        }
      },
      {
        "name": "effective",
        "attr": {
          "type": "Date",
          "column": "taxreg_effective"
        }
      },
      {
        "name": "expires",
        "attr": {
          "type": "Date",
          "column": "taxreg_expires"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "taxreg_notes"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VendorType",
    "table": "vendtype",
    "idSequenceName": "vendtype_vendtype_id_seq",
    "comment": "Vendor Type Map",
    "privileges": {
      "all": {
        "create": "MaintainVendorTypes",
        "read": true,
        "update": "MaintainVendorTypes",
        "delete": "MaintainVendorTypes"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "vendtype_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "code",
        "attr": {
          "type": "String",
          "column": "vendtype_code"
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "vendtype_descrip"
        }
      }
    ],
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "Voucher",
    "table": "vohead",
    "idSequenceName": "vohead_vohead_id_seq",
    "orderSequence": "VcNumber",
    "comment": "Voucher Map",
    "privileges": {
      "all": {
        "create": "MaintainVouchers",
        "read": "ViewVouchers",
        "update": "MaintainVouchers",
        "delete": "MaintainVouchers"
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "vohead_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "vendor",
        "toOne": {
          "isNested": true,
          "type": "Vendor",
          "column": "vohead_vend_id"
        }
      },
      {
        "name": "isMiscellaneous",
        "attr": {
          "type": "Boolean",
          "column": "vohead_misc",
          "value": true
        }
      },
      {
        "name": "number",
        "attr": {
          "type": "String",
          "column": "vohead_number"
        }
      },
      {
        "name": "isPosted",
        "attr": {
          "type": "Boolean",
          "column": "vohead_posted"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "vohead_docdate"
        }
      },
      {
        "name": "isFlagFor1099",
        "attr": {
          "type": "Boolean",
          "column": "vohead_1099"
        }
      },
      {
        "name": "reference",
        "attr": {
          "type": "String",
          "column": "vohead_reference"
        }
      },
      {
        "name": "terms",
        "toOne": {
          "type": "Terms",
          "column": "vohead_terms_id"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "vohead_curr_id"
        }
      },
      {
        "name": "taxZone",
        "toOne": {
          "type": "TaxZone",
          "column": "vohead_taxzone_id"
        }
      },
      {
        "name": "taxType",
        "toOne": {
          "type": "TaxType",
          "column": "vohead_taxtype_id"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "vohead_notes"
        }
      },
      {
        "name": "recurrences",
        "toMany": {
          "type": "VoucherRecurrence",
          "column": "vohead_id",
          "inverse": "voucher"
        }
      }
    ],
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VoucherDistribution",
    "table": "vodist",
    "idSequenceName": "vodist_vodist_id_seq",
    "comment": "Voucher Distribution Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "vodist_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "voucher",
        "toOne": {
          "type": "Voucher",
          "column": "vodist_vohead_id"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "vodist_amount"
        }
      },
      {
        "name": "quantity",
        "attr": {
          "type": "Number",
          "column": "vodist_qty"
        }
      },
      {
        "name": "expenseCategory",
        "toOne": {
          "type": "ExpenseCategory",
          "column": "vodist_expcat_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "vodist_tax_id"
        }
      },
      {
        "name": "isDiscountable",
        "attr": {
          "type": "Boolean",
          "column": "vodist_discountable"
        }
      },
      {
        "name": "notes",
        "attr": {
          "type": "String",
          "column": "vodist_notes"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true,
    "extensions": []
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VoucherRecurrence",
    "table": "recur",
    "idSequenceName": "recur_recur_id_seq",
    "comment": "Voucher Recurrence Map",
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "recur_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "parentType",
        "attr": {
          "type": "String",
          "column": "recur_parent_type",
          "value": "V"
        }
      },
      {
        "name": "voucher",
        "toOne": {
          "type": "Voucher",
          "column": "recur_parent_id"
        }
      },
      {
        "name": "period",
        "attr": {
          "type": "String",
          "column": "recur_period"
        }
      },
      {
        "name": "frequency",
        "attr": {
          "type": "Number",
          "column": "recur_freq"
        }
      },
      {
        "name": "startDate",
        "attr": {
          "type": "Date",
          "column": "recur_start"
        }
      },
      {
        "name": "endDate",
        "attr": {
          "type": "Date",
          "column": "recur_end"
        }
      },
      {
        "name": "maximum",
        "attr": {
          "type": "Number",
          "column": "recur_max"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  },
  {
    "context": "xtuple",
    "nameSpace": "XM",
    "type": "VoucherTax",
    "table": "voheadtax",
    "idSequenceName": "taxhist_taxhist_id_seq",
    "comment": "Voucher Tax Map",
    "privileges": {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "taxhist_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "voucher",
        "toOne": {
          "type": "Voucher",
          "column": "taxhist_parent_id"
        }
      },
      {
        "name": "taxType",
        "toOne": {
          "type": "TaxType",
          "column": "taxhist_taxtype_id"
        }
      },
      {
        "name": "taxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_tax_id"
        }
      },
      {
        "name": "basis",
        "attr": {
          "type": "Number",
          "column": "taxhist_basis"
        }
      },
      {
        "name": "basisTaxCode",
        "toOne": {
          "type": "TaxCode",
          "column": "taxhist_basis_tax_id"
        }
      },
      {
        "name": "sequence",
        "attr": {
          "type": "Number",
          "column": "taxhist_sequence"
        }
      },
      {
        "name": "percent",
        "attr": {
          "type": "Number",
          "column": "taxhist_percent"
        }
      },
      {
        "name": "amount",
        "attr": {
          "type": "Number",
          "column": "taxhist_amount"
        }
      },
      {
        "name": "tax",
        "attr": {
          "type": "Number",
          "column": "taxhist_tax"
        }
      },
      {
        "name": "documentDate",
        "attr": {
          "type": "Date",
          "column": "taxhist_docdate"
        }
      },
      {
        "name": "currency",
        "toOne": {
          "type": "Currency",
          "column": "taxhist_curr_id"
        }
      },
      {
        "name": "currencyRate",
        "attr": {
          "type": "Number",
          "column": "taxhist_curr_rate"
        }
      }
    ],
    "isNestedOnly": true,
    "isSystem": true
  }
]

