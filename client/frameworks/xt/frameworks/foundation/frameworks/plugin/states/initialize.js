
/*globals PLUGIN */

/** @class

  @todo This allows random access to critical data,
    possibly implement a semaphore or something?

*/
PLUGIN.INITIALIZE = SC.State.extend(
  /** @scope PLUGIN.INITIALIZE.prototype */ {

  enterState: function() {
    this.checklist = PLUGIN.DEFAULT_CHECKLIST.slice();
    var wait =  ! this.get("owner").noXBO;
    if(!wait)
      this.statechart.sendEvent("work");
  },
  
  work: function() {
    var cl = this.checklist.slice();
    while(cl.length > 0) {
      var job = cl.pop();
      this.statechart.sendEvent(job);
    }
  },
  
  done: function(job) {
    console.log("DONE CALLED FOR =>", job);
    var cl = this.checklist, idx;
    if(!cl || cl.length == 0)
      throw "Could not retrieve checklist for plugin"
    idx = cl.indexOf(job);
    if(idx !== -1) {
      cl.removeAt(idx);
      if(cl.length == 0)
        this.statechart.sendEvent("ready");
    }
  },
  
  patchXbos: function() {
    var xbos = this.get("owner")._xbo_ext;
    if(xbos && xbos.length > 0)
      for(var i=0; i<xbos.length; ++i)
        XT.XboManager.patch(xbos[i]);
    this.statechart.sendEvent("done", "patchXbos");
  }
    
}) ;
