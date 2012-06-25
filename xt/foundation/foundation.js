
/**
*/
XT = window.XT = {
  
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
XM = window.XM = {};

/**
*/
enyo.mixin(XT,
  /** */ {
    
  /** */
  K: function(){},
  
  /** */
  _date: new Date(),
  
  /** */
  toReadableTimestamp: function(millis) {
    var re = XT._date || (XT._date = new Date());
    re.setTime(millis);
    return re.toLocaleTimeString();
  },
  
  getObjectByName: Backbone.Relational.store.getObjectByName

});