// original wrapper
//function wrapper(plugin_info) {

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// use own namespace for plugin
window.plugin.mobileFoxUx = function() {};

/**
 * CSS
 */
// _css will be provided via `gulp` build.
window.plugin.mobileFoxUx.CSS = _css;
