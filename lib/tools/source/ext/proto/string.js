
_.extend(String.prototype, {
  camelize: function () {
    var args = XT.$A(arguments);
    return XT.String.camelize(this, args);
  },
  camelToHyphen: function () {
    var args = XT.$A(arguments);
    return XT.String.camelToHyphen(this, args);
  },
  decamelize: function () {
    var args = XT.$A(arguments);
    return XT.String.decamelize(this, args);
  },
  f: function () {
    var args = XT.$A(arguments);
    return XT.String.format(this, args);
  },
  loc: function () {
    var args = XT.$A(arguments);
    args.unshift(this);
    return XT.String.loc.apply(XT.String, args);
  },
  trim: function () {
    return XT.String.trim(this);
  },
  pluralize: function () {
    return owl.pluralize(this);
  },
  prefix: function () {
    var args = XT.$A(arguments);
    return XT.String.prefix(this, args);
  },
  suffix: function () {
    var args = XT.$A(arguments);
    return XT.String.suffix(this, args);
  },
  leftPad: function () {
    var args = XT.$A(arguments);
    return XT.String.leftPad(this.toString(), args[0], args[1]);
  },
  rightPad: function () {
    var args = XT.$A(arguments);
    return XT.String.rightPad(this.toString(), args[0], args[1]);
  }
});
