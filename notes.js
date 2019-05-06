/**
	Originals from:
	IITC_Ingress_intel_map_total_conversion\total-conversion-build.user.notes.js
*/

//
// Dialog
// jUI API: http://api.jqueryui.com/1.8/dialog/
//

/* The global ID of onscreen dialogs.
 * Starts at 0.
 */
window.DIALOG_ID = 0;

/* All onscreen dialogs, keyed by their ID.
 */
window.DIALOGS = {};

/* The number of dialogs on screen.
 */
window.DIALOG_COUNT = 0;

/* The dialog that has focus.
 */
window.DIALOG_FOCUS = null;


//
// Adding panels (example)
// Bookmarks in drawer
//
if(window.useAndroidPanes())
android.addPane("plugin-bookmarks", "Bookmarks", "ic_action_star");
window.addHook('paneChanged', window.plugin.bookmarks.onPaneChanged);


//
// Show/hide panels
//
window.show = function(id) {
  if(window.currentPane == id) return;
  window.currentPane = id;
  window.hideall();

  runHooks("paneChanged", id);

  switch(id) {
    case 'all':
    case 'faction':
    case 'alerts':
      window.chat.show(id);
      break;
    case 'debug':
      window.debug.console.show();
      break;
    case 'map':
      window.smartphone.mapButton.click();
      $('#portal_highlight_select').show();
      $('#farm_level_select').show();
      break;
    case 'info':
      window.smartphone.sideButton.click();
      break;
  }

  if (typeof android !== 'undefined' && android && android.switchToPane) {
    android.switchToPane(id);
  }
}

window.hideall = function() {
  $('#chatcontrols, #chat, #chatinput, #sidebartoggle, #scrollwrapper, #updatestatus, #portal_highlight_select').hide();
  $('#farm_level_select').hide();
  $('#map').css('visibility', 'hidden');
  $('.ui-tooltip').remove();
}

//
// Show chat
//
window.chat.show = function(name) {
    window.isSmartphone()
        ? $('#updatestatus').hide()
        : $('#updatestatus').show();
    $('#chat, #chatinput').show();

    window.chat.chooseTab(name);
}

//
// Hooks
//
window.addHook('portalAdded', function(data) { console.log(data) });
// paneChanged  called when the current pane has changed. On desktop,
//              this only selects the current chat pane; on mobile, it
//              also switches between map, info and other panes defined
//              by plugins