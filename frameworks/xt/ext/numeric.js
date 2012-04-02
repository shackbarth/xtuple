/*globals XT */

/** 
  @class 

  Special number objects used for number formatting in transforms.
*/

function Money(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function Quantity(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function QuantityPer(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function Cost(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function SalesPrice(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function PurchasePrice(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function Percent(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function UnitRatio(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

function Weight(val) { 
  this.val = val;
  var self = this;

  self.valueOf = function() { 
    return this.val; 
  }
  
  self.toString = function() { 
    return "" + this.val; 
  }
};

