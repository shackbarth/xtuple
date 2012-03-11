// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// =========================================================================
/*globals XM */

/** @mixin

  Support for core document assignments on models
  including contacts, items, files, images and urls.
  
*/

XM.CoreDocuments = {
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
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
  
  // ..........................................................
  // PRIVATE
  //
  
  /* @private */
  contactsLength: 0,
  
  /* @private */
  contactsLengthBinding: SC.Binding.from('.contacts.length').noDelay(),
  
  /* @private */
  itemsLength: 0,
  
  /* @private */
  itemsLengthBinding: SC.Binding.from('.items.length').noDelay(),
  
  /* @private */
  filesLength: 0,
  
  /* @private */
  filesLengthBinding: SC.Binding.from('.files.length').noDelay(),
  
  /* @private */
  imagesLength: 0,
  
  /* @private */
  imagesLengthBinding: SC.Binding.from('.urls.length').noDelay(),
  
  /* @private */
  urlsLength: 0,
  
  /* @private */
  urlsLengthBinding: SC.Binding.from('.urls.length').noDelay(),
  
  //..................................................
  // OBSERVERS
  //
  
  /* @private */
  _xm_contactsDidChange: function() {
    var documents = this.get('documents'),
        contacts = this.get('contacts');

    documents.addEach(contacts);    
  }.observes('contactsLength'),
  
  /* @private */
  _xm_itemsDidChange: function() {
    var documents = this.get('documents'),
        items = this.get('items');

    documents.addEach(items);  
  }.observes('itemsLength'),
  
  /* @private */
  _xm_filesDidChange: function() {
    var documents = this.get('documents'),
        files = this.get('files');

    documents.addEach(files);  
  }.observes('filesLength'),
  
  /* @private */
  _xm_imagesDidChange: function() {
    var documents = this.get('documents'),
        images = this.get('images');

    documents.addEach(images);    
  }.observes('imagesLength'),
  
  /* @private */
  _xm_urlsDidChange: function() {
    var documents = this.get('documents'),
        urls = this.get('urls');

    documents.addEach(urls);  
  }.observes('urlsLength')

};
