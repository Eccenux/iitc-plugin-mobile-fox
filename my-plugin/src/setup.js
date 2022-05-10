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

/**
 * Setup plugin (after IITC loaded).
 */
window.plugin.mobileFoxUx.setup = function() {
	// skip if not in mobile mode
	// Note! This can be tested on desktop FF by using responsive mode
	// (only predefined Android phones like "Galaxy S5" seem to work)
	if (!isSmartphone()) {
		console.log('[mobileFoxUx]', 'Not in mobile mode.');
		return;
	}
	console.log('[mobileFoxUx]', 'Mobile mode was detected. Running setup.');

	// drawer
	window.plugin.mobileFoxUx.initDrawer();
	// plugins in drawer
	setTimeout(function(){
		if (window.plugin.bookmarks) {
			window.plugin.mobileFoxUx.addPane("plugin-bookmarks", "Bookmarks");
		}
		if (window.plugin.missions) {
			$.extend(window.plugin.missions, missionsOverwrite);
			window.plugin.missions.createMissionsPane();
			window.plugin.mobileFoxUx.addPane('plugin-missions', 'Missions');
			// fix action in toolbox
			try {
				document.querySelector('#toolbox a[onclick^="plugin.missions.open"]').setAttribute('onclick', `show('plugin-missions');`);
			} catch (e) {
				console.warn(e);
			}
		}
	}, 900)

	// closing info pane
	window.plugin.mobileFoxUx.setupSidebar();

	// fix layers chooser
	window.plugin.mobileFoxUx.setupLayers();

	// full-screen
	window.plugin.mobileFoxUx.setupFullScreen();

	// add CSS
	window.plugin.mobileFoxUx.setupCss();

	// panel switching tweaks
	window.addHook('paneChanged', function(panelId) {
		if (panelId === 'map') {
			$('body > .leaflet-top').show();
		} else {
			// required for `setupLayers` (and possibly other moved outside of the map element)
			$('body > .leaflet-top').hide();
		}
	});
};

/**
 * Missions plugin overwrites.
 * 
 * @todo Move this to separate plugin?
 */
let missionsOverwrite = {
	showMissionListDialog : function (missions) {
		console.log('[missionsOverwrite]', 'showMissionListDialog');

		let contentElement = this.renderMissionList(missions);
		this.mobilePaneContainer.appendChild(contentElement);
	},

	onPaneChanged : function (pane) {
		console.log('[missionsOverwrite]', 'onPaneChanged', this);

		if(pane == 'plugin-missions') {
			document.body.appendChild(this.mobilePane);
			$(this.mobilePaneContainer).empty();
			this.openTopMissions();
		} else if(this.mobilePane.parentNode) {
			this.mobilePane.parentNode.removeChild(this.mobilePane);
		}
	
	},
	
	createMissionsPane : function () {
		console.log('[missionsOverwrite]', 'createMissionsPane', this);

		this.mobilePane = document.createElement('div');
		this.mobilePane.className = 'plugin-mission-pane';
	
		this.mobilePaneContainer = document.createElement('div');
		this.mobilePane.appendChild(this.mobilePaneContainer);
		addHook('paneChanged', (pane) => {
			this.onPaneChanged(pane);
		});
	},

	showMissionDialog: function(mission) {
		var me = this;
		var markers = this.drawMission(mission);
		var content = this.renderMission(mission);
		var id = mission.guid.replace(/\./g, '_'); // dots irritate the dialog framework and are not allowed in HTML IDs
		
		dialog({
			id: 'plugin-mission-details-' + id,
			title: mission.title,
			html: content,
			height: Math.ceil(document.documentElement.clientHeight * 0.9),
			width: '95vw',
			closeCallback: function() {
				me.removeMissionLayers(markers);
			},
			focus: function() {
				me.highlightMissionLayers(markers);
			}
		}).dialog('option', 'buttons', {
			'Zoom to mission': function() {
				me.zoomToMission(mission);
				// show map and collapse dialog
				show('map');
				$(this).parent().find('.ui-dialog-titlebar-button-collapse').click();
			},
			'Close': function() { $(this).dialog('close'); },
		});
	},
}
