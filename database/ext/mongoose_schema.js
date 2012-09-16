/**
 xTuple's implementation of a Mongoose schema.

 @class
*/
X.MongooseSchema = X.Object.extend(
  /** @lends X.MongooseSchema.prototype */ {

  /**
   Initialize the schema. This function will not create a schema twice
   if it has already been created.

  */
  init: function () {
    var name = "%@Schema".f(this.get("name"));
    var def = this.get("definition");
    var schemas = X.schemas = X.schemas? X.schemas: {};

    // don't create it twice if it was already
    // instantiated by another schema
    if (!schemas[name]) {
      schemas[name] = new X.mongoose.Schema(def);
    }
  }

});
