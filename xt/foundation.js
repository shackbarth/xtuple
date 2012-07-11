
/**
*/
XT = {

  /**
    System precision scale for money.

    @static
    @constant
    @type Number
    @default 2
  */
  MONEY_SCALE: 2,

  /**
    System precision scale for quantity.

    @static
    @constant
    @type Number
    @default 6
  */
  QTY_SCALE: 6,

  /**
    System precision scale for quantity per.

    @static
    @constant
    @type Number
    @default 7
  */
  QTY_PER_SCALE: 7,

  /**
    System precision scale for costs.

    @static
    @constant
    @type Number
    @default 6
  */
  COST_SCALE: 6,

  /**
    System precision scale for sales prices.

    @static
    @constant
    @type Number
    @default 4
  */
  SALES_PRICE_SCALE: 4,

  /**
    System precision scale for purchase prices.

    @static
    @constant
    @type Number
    @default 6
  */
  PURCHASE_PRICE_SCALE: 6,

  /**
    System precision scale for extended prices.

    @static
    @constant
    @type Number
    @default 0
  */
  EXTENDED_PRICE_SCALE:4,

  /**
    System precision scale for unit conversion ratios.

    @static
    @constant
    @type Number
    @default 7
  */
  UNIT_RATIO_SCALE: 8,

  /**
    System precision scale for percentages.

    @static
    @constant
    @type Number
    @default 4
  */
  PERCENT_SCALE: 4,

  /**
    System precision scale for weight.

    @static
    @constant
    @type Number
    @default 2
  */
  WEIGHT_SCALE: 2

};

/**
*/
XM = {};

/**
*/
_.extend(XT,
  /** */ {

  /** */
  K: function (){},

  /** */
  _date: new Date(),

  /** */
  toReadableTimestamp: function (millis) {
    var re = XT._date || (XT._date = new Date());
    re.setTime(millis);
    return re.toLocaleTimeString();
  },

  getObjectByName: function (target) {

    if (!target.split) return null;

    var parts = target.split(".");
    var ret;
    var part;
    var idx = 0;
    for (; idx < parts.length; ++idx) {
      part = parts[idx];
      ret = ret? ret[part] : window[part];
      if (ret === null || ret === undefined) {
        return null;
      }
    }
    return ret;
  },

  /**
    @NOTE: some logic borrowed from SproutCore
  */
  A: function (obj) {
    if (obj === null || obj === undefined) return [];
    if (obj.slice instanceof Function) {
      if (typeof obj === "string") return [obj];
      else return obj.slice();
    }

    var ret = [];

    // case of function arguments that has length property
    if (obj.length) {
      var len = obj.length;
      while(--len >= 0) ret[len] = obj[len];
      return ret;
    }

    // for cases where we just convert the values from an
    // object to an array and discard the keys...
    return _.values(obj);
  }

});

XT.$A = XT.A;


var XV = XV || {};
XV.WorkspacePanelDescriptor = {
  Project: // the key is uppercase because the model name is uppercase
    [{
      title: "Project Info",
      location: "top",
      fields: [
        { label: "Number", fieldName: "number", placeholder: "Enter project number" },
        { label: "Name", fieldName: "name", placeholder: "Enter project name" },
        { label: "Notes", fieldName: "notes", placeholder: "Enter project notes" }
      ]
    },
    {
      title: "Schedule",
      location: "top",
      fields: [
        { label: "Owner", fieldName: "owner.propername", fieldType: "ObjectWidget" },
        { label: "Assigned To", fieldName: "assignedTo.propername", fieldType: "ObjectWidget" },
        { label: "Due", fieldName: "dueDate", fieldType: "DateWidget" },
        { label: "Assigned", fieldName: "assignDate", fieldType: "DateWidget" },
        { label: "Started", fieldName: "startDate", fieldType: "DateWidget" },
        { label: "Completed", fieldName: "completeDate", fieldType: "DateWidget" }
      ]
    },
    //{
      //title: "Billing",
      //location: "top",
      //fields: [
      //  { label: "Customer", fieldName: "projectCustomer", placeholder: "The customer to be billed" },
      //  { label: "Rate", fieldName: "projectRate", placeholder: "Enter project rate" },
      //]
    //},
    {
      title: "Tasks",
      location: "bottom",
      boxType: "Grid",
      fields: [
        { label: "Number", fieldName: "tasks.number", width: "120" },
        { label: "Name", fieldName: "tasks.name", width: "120" },
        { label: "Notes", fieldName: "tasks.notes", width: "220" },
        { label: "Actual Hours", fieldName: "tasks.actualHours", fieldType: "NumberWidget", width: "40" },
        { label: "Actual Expenses", fieldName: "tasks.actualExpenses", fieldType: "NumberWidget", width: "40" }
      ]
    }/*,
    {
      title: "Comments",
      location: "bottom",
      boxType: "Grid",
      fields: [
        { label: "Date", width: "120" },
        { label: "Type", width: "80" },
        { label: "User", width: "80" },
        { label: "Comment", width: "300" }
      ]
    }*/
  ]
};


