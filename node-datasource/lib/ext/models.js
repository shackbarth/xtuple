/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Extension = XM.SimpleModel.extend({

    recordType: 'XM.Extension'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2client = XM.SimpleModel.extend({

    recordType: 'XM.Oauth2client'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2clientRedirs = XM.SimpleModel.extend({

    recordType: 'XM.Oauth2clientRedirs'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.Oauth2token = XM.SimpleModel.extend({

    recordType: 'XM.Oauth2token'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.SessionStore = XM.SimpleModel.extend({
    /** @scope XM.SessionStore.prototype */

    recordType: 'XM.SessionStore',

    idAttribute: 'id',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  XM.User = XM.SimpleModel.extend({
    /** @scope XM.User.prototype */

    recordType: 'XM.UserAccount'

  });


  /**
    @class

    @extends XM.SimpleModel
  */
  XM.BiCache = XM.SimpleModel.extend(/** @lends XM.BiCache.prototype */{

    recordType: 'XM.BiCache',

    idAttribute: 'key'

  });


  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.Oauth2clientCollection = XM.Collection.extend({

    model: XM.Oauth2client

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.Oauth2clientRedirsCollection = XM.Collection.extend({

    model: XM.Oauth2clientRedirs

  });
  /**
    @class

    @extends XM.Collection
  */
  XM.Oauth2tokenCollection = XM.Collection.extend({

    model: XM.Oauth2token

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ExtensionCollection = XM.Collection.extend(/** @lends XM.ExtensionCollection.prototype */{

    model: XM.Extension

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.UserCollection = XM.Collection.extend({
    /** @scope XM.UserCollection.prototype */

    model: XM.User

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.BiCacheCollection = XM.Collection.extend({
    /** @scope XM.BiCacheCollection.prototype */

    model: XM.BiCache

  });
}());
