
/*globals Plugin */

/** @namespace

  Loadable Plugins are a key component of the Postbooks SC framework.
  These are the housings for the actual content of the application. It
  allows it to be both modular and scalable. Plugins have many built-in
  features and there is a built-in controller that manages them. During the
  build process the XTBuildAssistant actually gathers information about the
  Plugins based on their .loadable configuration file and generates a
  javascript file that gets loaded at runtime (prior to the Plugins getting
  loaded) so that the application can be aware of what is available and
  some other key feautures. Plugins are loaded on-demand. For more information
  on Plugins, see the 'Creating Loadable Plugins' tutorial and documentation.

  Plugins also provide a mechanism through which XBOs (xTuple Business Objects)
  are modified and their relationships refined so they are not all loaded
  unnecessarily. It does this through procedural "patches" (extentions and 
  direct modifications to XBOs).

  @extends XT.Object
*/
Plugin = XT.Object.create(
  /** @scope PLUGIN.prototype */ {
    
  NAMESPACE: "Plugin",
  VERSION: "0.1.0",

  /** @property
    Loadable Plugins each have at least 1 page (@see Plugin.Page)
    that houses their default views. Due to the way they are loaded
    these pages are not stored directly in the namespace of the Plugin
    but instead in this object.

    For an example, see Dev. 

    ```Plugins.pages.dev = Plugin.Page.create(...)```
  */
  pages: {},

  views: {},
  
}) ;
