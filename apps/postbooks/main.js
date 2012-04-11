// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT XM Postbooks sc_assert */

SC.ENABLE_CSS_TRANSITIONS = true;

XT.DataSource.prototype.logLevels = SC.Object.create({
  warn:  false,
  info:  false,
  error: false
});

function main() {
  Postbooks.statechart.initStatechart();

}

Postbooks.RenderModelHierarchy = function() {
  var ui = document.getElementById('ui');

  document.body.removeAttribute('style');

  ui.style.color = 'black';
  document.body.style.backgroundColor = 'white';

  var handleChildAttribute, handleRecordAttribute, processRecordClass;

  var relationships = 0;

  handleChildAttribute = function(key, attribute, parentElement) {
    // console.log('handleChildAttribute', key);
    relationships++;

    var p = document.createElement('p'),
        ul = document.createElement('ul'),
        li = document.createElement('li'),
        typeClass = attribute.get('typeClass');

    p.innerText = "(%@) %@:".fmt(attribute.isChildrenAttribute? 'to many' : 'to one', key);
    parentElement.appendChild(p);
    parentElement.appendChild(ul);

    ul.appendChild(li);
    processRecordClass(typeClass, li);
  };

  handleRecordAttribute = function(key, attribute, parentElement) {
    // console.log('handleRecordAttribute', key);

    var typeClass = attribute.get('typeClass');

    if (typeClass === String) typeClass = 'String';
    else if (typeClass === Number) typeClass = 'Number';
    else if (typeClass === Boolean) typeClass = 'Boolean';
    else if (typeClass === Array) typeClass = 'Array';
    else if (typeClass === Object) typeClass = 'Hash';
    else if (attribute.isManyAttribute || attribute.isSingleAttribute) relationships++;

    parentElement.innerText = "%@: %@ (%@)".fmt(key, typeClass, attribute.get('isEditable')? 'editable' : 'not editable');
  };

  processRecordClass = function(klass, parentElement) {
    // console.log('processRecordClass', klass.prototype.className);

    var p = document.createElement('p'),
        ul = document.createElement('ul');

    p.innerText = klass.prototype.className;
    parentElement.appendChild(p);
    parentElement.appendChild(ul);
    
    var proto = klass.prototype;
    
    for (var key in proto) {
      var property = proto[key];
      if (property && property.isRecordAttribute) {
        var li = document.createElement('li');
        ul.appendChild(li);
    
        if (property.isChildrenAttribute) handleChildAttribute(key, property, li);
        else if (property.isChildAttribute) handleChildAttribute(key, property, li);
        else if (property.isRecordAttribute) handleRecordAttribute(key, property, li);
      }
    }
  };

  var ul = document.createElement('ul');

  var child; while (child = document.body.firstElementChild) document.body.removeChild(child);
  document.body.appendChild(ul);
  document.body.style.overflowY = 'scroll';

  // var classes = [];
  // for (var key in XM) {
  //   if (key.slice(0,1) === '_') continue;
  //   var klass = XM[key];
  //   if (klass && klass.isClass && klass.subclassOf(XT.Record)) classes.push(klass);
  // }

  var count = 0;
  for (var key in XM) {
    if (key.slice(0,1) === '_') continue;
    var klass = XM[key];
    if (klass && klass.isClass && klass.subclassOf(XT.Record)) count++;
  }
  console.log('XM has', count, 'non-generated XT.Record subclasses.');

  // TODO: Find out why CashReceipt and CreditMemo have permission errors.
  // var xtupleClasses = 'Account BankAccount CashReceipt CreditMemo Customer Incident Invoice LedgerAccount Opportunity Payable Payment Receivable ToDo Vendor Voucher Project'.w();
  var xtupleClasses = 'Account BankAccount Customer Incident Invoice LedgerAccount Opportunity Payable Payment Receivable ToDo Vendor Voucher Project'.w();

  console.log("There are", xtupleClasses.length, "root classes in the 'xtuple' XBO:");
  xtupleClasses.forEach(function(className, idx) {
    var klass = XM[className];
    sc_assert(klass);
    sc_assert(klass.isClass);
    sc_assert(klass.subclassOf(XT.Record));

    var li = document.createElement('li');
    ul.appendChild(li);
    processRecordClass(klass, li);
    console.log(idx + 1, klass);
  });

  console.log("There are", relationships, "child relationships.");
};
