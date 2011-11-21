
XT.ColumnDelegate = {

  /**
    Walk like a duck?
  */
  isColumnDelegate: YES,

  /** @private */
  template: function(tpl) {
    var template = SC.TEMPLATES.get(tpl);
    // var template = SC.TEMPLATES.get("xt_%@".fmt(this.get("index")));
    return template ? template.rawTemplate : null ;
  },

  /** @private */
  render: function(context, record, isEven) {
  
    // throw it to the renderData method
    return this.renderData(context, record, isEven);
  },


  /** @private */
  renderData: function(record) {


    var fields = this.get("fields");
    var keys = this.get("keys");
    var column = this.template("xt_column");
    var classes = this.get("classNames");
    var rows = "";
    
    for(var i=0, len=fields.length; i<len; ++i)
      rows += this.renderField(record, fields[ i ], keys);

    column = column.replace(/\{\{classes\}\}/, classes);
    column = column.replace(/\{\{rows\}\}/, rows);

    return column;

  },

  /** @private */
  renderField: function(rec, field, keys) {

    // grab the data we want to play with (if it exists)
    var def = keys[ field ].default || null;
    var formatter = keys[ field ].formatter || null;
    var classes = keys[ field ].classNames || null; 
    var normalize = keys[ field ].normalize === NO ? NO : YES;
    var hint = keys[ field ].hint || null;

    var container = '<div class="xt-row-data-container">';

    var label = '<span class="xt-row-data-label">';

    label += field;

    label += '</span>';

    container += label;

    var row = this.template("xt_row");

    var properties = {
      default: def,
      classNames: classes,
      hint: hint,
    };

    // see if there is any data on the record
    var data = rec.get(field) || def || null;

    // the data span
    var span = '<span';

    // see if there is a formatter and try to use it if there is
    if(formatter && SC.typeOf(formatter) === SC.T_FUNCTION) {
      var mod = formatter(data, rec.get("readOnlyAttributes"), properties);
      if(mod) data = mod;
    }

    if(normalize) data = XT.capitalize(data);

    if(properties.hint) span += ' hint="' + properties.hint + '"';

    span += ' class="xt-data-span';

    if(properties.hint) span += ' xt-has-hint';

    if(data === def) span += ' xt-default-value';

    if(properties.classNames !== "") {
      span += ' ' + properties.classNames + '">';
    } else { span += '">'; }
    
    // add the data
    span += data || "&nbsp;"; 

    // close the span
    span += '</span>';

    container += span;

    container += '</div>';

    // return the constructed and formatted data span
    row = row.replace(/\{\{width\}\}/, this.get("width") + "px");
    return row.replace(/\{\{data\}\}/, span);
  },

  renderFooter: function(context) {
    
    // @note For now there is no footer, but there could be! 

  },
  
};
