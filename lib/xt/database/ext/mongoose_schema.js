
XT.MongooseSchema = XT.Object.extend(
  /** @lends XT.MongooseSchema.prototype */ {

  init: function() {
    var name = "%@Schema".f(this.get("name"));
    var def = this.get("definition");
    var schemas = XT.schemas = XT.schemas? XT.schemas: {};
    
    // don't create it twice if it was already
    // instantiated by another schema
    if (!schemas[name]) {
      schemas[name] = new XT.mongoose.Schema(def);
    }
  }
    
});