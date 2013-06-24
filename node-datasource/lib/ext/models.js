/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global SYS:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Extension = XM.SimpleModel.extend({

    recordType: 'SYS.Extension'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Oauth2client = XM.SimpleModel.extend({

    recordType: 'SYS.Oauth2client'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Oauth2clientRedirs = XM.SimpleModel.extend({

    recordType: 'SYS.Oauth2clientRedirs'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.Oauth2token = XM.SimpleModel.extend({

    recordType: 'SYS.Oauth2token'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.SessionStore = XM.SimpleModel.extend({
    /** @scope SYS.SessionStore.prototype */

    recordType: 'SYS.SessionStore',

    idAttribute: 'id',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.User = XM.SimpleModel.extend({
    /** @scope SYS.User.prototype */

    recordType: 'SYS.User'

  });

  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.UserAccountRole = XM.SimpleModel.extend({
    /** @scope SYS.UserAccountRole.prototype */

    recordType: 'SYS.UserAccountRole'

  });


  /**
    @class

    @extends XM.SimpleModel
  */
  SYS.BiCache = XM.SimpleModel.extend(/** @lends SYS.BiCache.prototype */{

    recordType: 'SYS.BiCache',

    idAttribute: 'key'

  });


  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  SYS.Oauth2clientCollection = XM.Collection.extend({

    model: SYS.Oauth2client

  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.Oauth2clientRedirsCollection = XM.Collection.extend({

    model: SYS.Oauth2clientRedirs

  });
  /**
    @class

    @extends XM.Collection
  */
  SYS.Oauth2tokenCollection = XM.Collection.extend({

    model: SYS.Oauth2token

  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.ExtensionCollection = XM.Collection.extend(/** @lends SYS.ExtensionCollection.prototype */{

    model: SYS.Extension

  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.UserCollection = XM.Collection.extend({
    /** @scope SYS.UserCollection.prototype */

    model: SYS.User

  });

  /**
    @class

    @extends XM.Collection
  */
  SYS.BiCacheCollection = XM.Collection.extend({
    /** @scope SYS.BiCacheCollection.prototype */

    model: SYS.BiCache

  });
}());
