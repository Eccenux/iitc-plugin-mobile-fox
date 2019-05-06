//
// Bookmarks in drawer
//
if(window.useAndroidPanes())
android.addPane("plugin-bookmarks", "Bookmarks", "ic_action_star");
window.addHook('paneChanged', window.plugin.bookmarks.onPaneChanged);


//
// Missions
//
if (window.plugin.missions) {
	window.plugin.mobileFoxUx.createMissionsPane.call(window.plugin.missions);
	window.plugin.mobileFoxUx.addPane('plugin-missions', 'Missions');
}

window.plugin.mobileFoxUx.createMissionsPane = function() {
	this.mobilePane = document.createElement('div');
	this.mobilePane.className = 'plugin-mission-pane';

	var button = this.mobilePane.appendChild(document.createElement('button'));
	button.textContent = 'Missions in view';
	button.addEventListener('click', function(){ this.openTopMissions(); }.bind(this), false);

	this.tabs = this.mobilePane.appendChild(document.createElement('div'));
	this.tabBar = this.tabs.appendChild(document.createElement('ul'));
	this.tabHeaders = {};
	this.tabMarkers = {};

	$(this.tabs)
		.tabs({
			activate: function(event, ui) {
				if(!ui.newTab) return;
				
				var header = $(ui.newTab)[0];
				var id = header.dataset['mission_id'];
				this.highlightMissionLayers(this.tabMarkers[id]);
			}.bind(this),
		})
		.find('.ui-tabs-nav').sortable({
			axis: 'x',
			stop: function() {
				$(this.tabs).tabs('refresh');
			},
		});

	addHook('paneChanged', this.onPaneChanged.bind(this));
}

/**
 * Originals from:
 * IITC_Ingress_intel_map_total_conversion\total-conversion-build.user.notes.js
 */

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