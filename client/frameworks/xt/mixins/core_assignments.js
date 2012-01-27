/*globals XT */

/** @mixin

  Support for core document assignments on models
  including contacts, items, files, images and urls.
  
*/

XM.CoreAssignments = {

  /**
  Source type code that is to be applied to new
  documents.
  
  @type String
  */
  sourceType: null,
  
  /**
  A set of all the document assignments on this record
  
  @type SC.Set
  */
  documents: function(key, value) {
    if(value) { 
      this._documents = value;
    } else if(!this._documents) { 
      this._documents = SC.Set.create(); 
    }
    
    return this._documents;
  }.property().cacheable(),
  
  /**
  @type XM.ContactAssignment
  */
  contacts: XM.Record.toMany('XM.ContactAssignment', {
    isNested: YES
  }),
    
  /**
  @type XM.ItemAssignment
  */
  items: XM.Record.toMany('XM.ItemAssignment', {
    isNested: YES
  }),
  
  /**
  @type XM.FileAssignment
  */
  files: XM.Record.toMany('XM.FileAssignment', {
    isNested: YES
  }),
  
  /**
  @type XM.ImageAssignment
  */
  images: XM.Record.toMany('XM.ImageAssignment', {
    isNested: YES
  }),
  
  /**
  @type XM.ImageAssignment
  */
  urls: XM.Record.toMany('XM.UrlAssignment', {
    isNested: YES
  }),
  
  // ..........................................................
  // PRIVATE
  //
  
  /* @private */
  _contactsLength: 0,
  
  /* @private */
  _contactsLengthBinding: '.contacts.length',
  
  /* @private */
  _itemsLength: 0,
  
  /* @private */
  _itemsLengthBinding: '.items.length',
  
  /* @private */
  _filesLength: 0,
  
  /* @private */
  _filesLengthBinding: '.files.length',
  
  /* @private */
  _imagesLength: 0,
  
  /* @private */
  _imagesLengthBinding: '.urls.length',
  
  /* @private */
  _urlsLength: 0,
  
  /* @private */
  _urlsLengthBinding: '.urls.length',
  
  /* @private */
  _contactsDidChange: function() {
    var documents = this.get('documents'),
        contacts = this.get('contacts');

    documents.addEach(contacts);    
  }.observes('contactsLength'),
  
  /* @private */
  _itemsDidChange: function() {
    var documents = this.get('documents'),
        items = this.get('items');

    documents.addEach(items);  
  }.observes('itemsLength'),
  
  /* @private */
  _filesDidChange: function() {
    var documents = this.get('documents'),
        files = this.get('files');

    documents.addEach(files);  
  }.observes('filesLength'),
  
  /* @private */
  _imagesDidChange: function() {
    var documents = this.get('documents'),
        images = this.get('images');

    documents.addEach(images);    
  }.observes('imagesLength'),
  
  /* @private */
  _urlsDidChange: function() {
    var documents = this.get('documents'),
        urls = this.get('urls');

    documents.addEach(urls);  
  }.observes('urlsLength')

};
