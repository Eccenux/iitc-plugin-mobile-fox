/* global missionsOverwrite */
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
