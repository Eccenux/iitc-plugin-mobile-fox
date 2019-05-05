// ==UserScript==
// @author         Eccenux
// @id             iitc-plugin-mobile-fox@jonatkins
// @name           IITC plugin: Mobile Fox UX
// @category       Misc
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @version        0.1.0
// @description    [0.1.0] Plugin focused on making IITC better for mobile phones. This is for users of Firefox mobile.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// @updateURL      https://github.com/Eccenux/iitc-plugin-mobile-fox/raw/master/mobile-fox.meta.js
// @downloadURL    https://github.com/Eccenux/iitc-plugin-mobile-fox/raw/master/mobile-fox.user.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// use own namespace for plugin
window.plugin.mobileFoxUx = function() {};

/**
 * CSS
 */
window.plugin.mobileFoxUx.CSS = `
	//
	// Drawer (chat links etc)
	//
	#link-drawer {
		// 100 - updatestatus
		//height: calc(100vh - 23px);
		background: #0e3d4e;

		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 3100;

		box-sizing: border-box;
		padding: .2em .5em;

		// flex to easily make items start from bottom
		display: flex;
		flex-flow: column-reverse wrap;
	}
	// links similar to toolbox links
	#link-drawer > a {
		box-sizing: border-box;
		display: block;
		padding: .5em .5em;
		margin-top: .5em;
		margin-bottom: .2em;

		text-align: left;

		border: 2px outset #20A8B1;
	}

	// open drawer
	.open-drawer-button {
		background: #0e3d4e;

		position: absolute;
		left: 0;
		z-index: 3100;
		// bookmark button + bottom bar +  extra margin
		bottom: calc(19px + 23px + 5px);

		box-sizing: border-box;
		display: block;
		padding: 1em;

		border-radius: 0 1em 1em 0;
		border: 1px solid #20A8B1;

		opacity: .6;
	}

	//
	// Portal/info sidebar
	//

	/*
	// tweak sidebar for 'margin-top: auto;' to work
	#sidebar {
		display: flex;
		flex-direction: column;
	}
	*/
	// align bottom bar
	#sidebar .mobile-fox-nav-bar {
		position: fixed;
		bottom: 0;
		background: #0e3d4e;
	}
	#sidebar .mobile-fox-nav-bar {
		box-sizing: border-box;
		padding: 3px;
	}
	// bottom bar links like toolbox links
	#sidebar .mobile-fox-nav-bar > a {
		box-sizing: border-box;
		display: block;
		text-align: center;

		padding: 5px;
		margin-top: 3px;
		margin-bottom: 3px;
		border: 2px outset #20A8B1;
	}

	// left side toolbar overflow handling
	.leaflet-left.leaflet-top {
		//margin-top: 20px;
		display: flex;
		flex-flow: column;
		// 100 - top - bookmark button - bottom bar
		height: calc(100vh - 20px - 19px - 23px);
		flex-wrap: wrap;
	}

	//
	// Layers chooser
	//

	// scroll excesive content
	.leaflet-control-layers {
		// -bottom bar; -top margin; -extra margin
		max-height: calc(100vh - 23px - 5px - 5px);
		overflow-y: scroll;
		box-sizing: border-box;

		// make sure there is gap on the left to close the chooser (tap outside)
		max-width: calc(100vw - 2em);
	}

	// reset styles
	.leaflet-control-layers-base,
	.leaflet-control-layers-overlays {
		float: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border-left-style: none;
		overflow-y: visible;
	}
	// two column layout
	.leaflet-control-layers-list {
		columns: 2;
		column-rule: 1px solid #ddd;
	}
	// switch to single column
	@media (max-width: 460px) {
		.leaflet-control-layers-list {
			columns: 1;
		}
	}

	// element spacing better for fingers
	.leaflet-control-layers-overlays {
		padding: 1em 0;
	}
	.leaflet-control-layers label {
		margin: 1em;
		padding: .2em 0;
	
	}

	// titles
	.leaflet-control-layers-base:before {
		content: 'Tiles:';
	}
	.leaflet-control-layers-overlays:before {
		content: 'Layers:';
	}

`.replace(/\n[ \t]*\/\/.*/g, ''); // remove inline comments

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

	// closing info pane
	window.plugin.mobileFoxUx.setupSidebar();

	// fix layers chooser
	window.plugin.mobileFoxUx.setupLayers();

	// add CSS
	window.plugin.mobileFoxUx.setupCss();
};

/**
 * Drawer creation.
 */
window.plugin.mobileFoxUx.initDrawer = function() {
	window.plugin.mobileFoxUx.createDrawer();
	window.plugin.mobileFoxUx.initDrawerEvents();
}

window.plugin.mobileFoxUx.initDrawerEvents = function() {
	// open (and close) from edge
	// closing should also work when you open and change your mind
	let swipeEdgeHelper = new SwipeHelper();
	swipeEdgeHelper.swipe = function(type) {
		console.log('[swipeEdgeHelper]', type);
		switch (type) {
			case 'left':
				$('#link-drawer').hide();
			break;
			case 'right':
				$('#link-drawer').show();
			break;
		}
	}
	swipeEdgeHelper.start();

	// close from anywhere in the opened drawer
	let swipeOutHelper = new SwipeHelper();
	swipeOutHelper.fromEdge = false;
	swipeOutHelper.swipe = function(type) {
		console.log('[swipeOutHelper]', type);
		switch (type) {
			case 'left':
				$('#link-drawer').hide();
			break;
		}
	}
	swipeOutHelper.start(document.querySelector('#link-drawer'));
}

window.plugin.mobileFoxUx.createDrawer = function() {
	$('body').append(`<div id="link-drawer" style="display:none">
		<a class="close-button" onclick="this.parentNode.style.display = 'none'">Close</a>

		<a onclick="show('all')"    >Log: all</a>
		<a onclick="show('faction')">Log: faction</a>
		<a onclick="show('alerts')" >Log: alerts</a>

		<a onclick="show('map')">Map</a>
		<a onclick="show('info')">Info</a>

	</div>
	//<a class="open-drawer-button" onclick="$('#link-drawer').show()">D</a>
	`.replace(/\n[ \t]*\/\/.*/g, '')	// remove inline comments
	);
}

/**
 * Sidebar manipulation.
 */
window.plugin.mobileFoxUx.setupSidebar = function() {
	$('#sidebar').append(`<div class="mobile-fox-nav-bar">
		<a title="Go back to map" onclick="show('map')">Close</a>
	</div>`);
}

/**
 * Append CSS for the whole plugin.
 */
window.plugin.mobileFoxUx.setupCss = function() {
	var el = document.createElement('style');
	el.type = 'text/css';
	el.media = 'screen';
	el.appendChild(document.createTextNode(window.plugin.mobileFoxUx.CSS));
	document.querySelector('head').appendChild(el);
}

/**
 * Setup/fix layers chooser.
 */
window.plugin.mobileFoxUx.setupLayers = function() {
	// move layers outside of the map element (to enable scrolling)
	var layers = document.querySelector('.leaflet-control-layers')
	var container = document.createElement('div');
	container.className = 'leaflet-top';	// seem to be required for toggle to work
	container.style.cssText = 'right:5px; z-index: 2600';	// space for tap; above highlight selector
	container.appendChild(layers);
	document.body.appendChild(container);

	// hide layers tooltip
	var toggle = layers.querySelector('.leaflet-control-layers-toggle');
	toggle.title = '';
}

//window.plugin.mobileFoxUx.setup();

/**
 * Show remaining checkpoints.
 * 
 * All times passed as a timestamp in ms.
 * 
 * @param {Number} checkpointEnd Time of first checkpoint to be shown (should be the end time of current checkpoint).
 * @param {Number} cycleStart Start time of the cycle to show.
 * @param {Number} cycleEnd End time of the cycle to show. Might be replaced with final date to be shown.
 * @param {Number} checkpointLength [const] Checkpoint lenght in ms.
 *
window.plugin.mobileFoxUx.showCheckpointsDialog = function (checkpointTime, cycleStart, cycleEnd, checkpointLength) {
	var now = new Date().getTime();
	var maxCp = window.plugin.mobileFoxUx.CHECKPOINTS_COUNT;
	var html = '<table>';
	var checkpointNumber = Math.floor((checkpointTime-cycleStart)/checkpointLength);
	for (var checkpoint = checkpointTime; checkpoint <= cycleEnd; checkpoint+=checkpointLength) {
		html += plugin.mobileFoxUx.formatRow(now, '#'+checkpointNumber, checkpoint);
		checkpointNumber++;
		if (checkpointNumber > maxCp) {
			checkpointNumber -= maxCp;
		}
	}
	html += '</table>';

	dialog({
		html: html,
		dialogClass: 'ui-dialog-mobileFoxUx',
		title: 'Remaining checkpoints'
	});
};
/**/


var setup =  window.plugin.mobileFoxUx.setup;

/**
 * Helper class for detecting swipe events.
 * 
 * Note! Override `swipe` function to handle swipe events.
 * Note! Call `start` when you are ready to handle events.
 */
class SwipeHelper {
	/**
	 * Init.
	 */
	constructor(container) {
		// settings
		/**
		 * Minimum lenght the finger must travel for an event to be fired.
		 */
		this.minLength = 50;
		/**
		 * Allow multiple events within single move.
		 * 
		 * When true many events might be fired without lifting a finger.
		 */
		this.allowMultiple = true;

		/**
		 * If events should be captured from edges.
		 */
		this.fromEdge = true;

		/**
		 * Edge size in pixels.
		 */
		this.edgeSize = 10;

		// reset
		this.reset();
	}

	/**
	 * Start handling events.
	 * 
	 * @param {Element?} container Event container/base element. Defaults to document.
	 */
	start(container) {
		if (!(container instanceof Element)) {
			container = document;
		}

		// events
		this.initEvents(container);
	}
	
	/**
	 * Handle swipe event.
	 * 
	 * @param {String} type Swipe type (dominant direction).
	 */
	swipe(type) {
	}
	
	initEvents(container) {
		if (!this.fromEdge) {
			container.addEventListener('touchstart', (e) => {
				this.handleStart(e);
			}, false);
			container.addEventListener('touchmove', (e) => {
				this.handleMove(e);
			}, false);
		} else {
			container.addEventListener('touchstart', (e) => {
				// Note! Do NOT remove this log. It is required for Firefox!
				// See bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1549220
				console.log('touchstart', e);
				this.handleStart(e);
				return true;
			}, {passive: false, capture: true});
			container.addEventListener('touchmove', (e) => {
				//console.log('touchmove', e);
				this.handleMove(e);
				return true;
			}, {passive: false, capture: false});
		}

	}

	/**
	 * Reset/set starting point.
	 * @param {Touch?} touch Touch object.
	 */
	reset(touch) {
		if (typeof touch === 'object') {
			this.startx = touch.clientX;
			this.starty = touch.clientY;
		} else {
			this.startx = null;
			this.starty = null;
		}
	}

	handleStart(event) {
		const touch = event.touches[0];
		//console.log('touch', touch);
		if (!this.fromEdge) {
			this.reset(touch);
		} else {
			let onEdge = false;
			if (touch.clientX < this.edgeSize) {
				onEdge = 'left';
			} else if (document.documentElement.clientWidth - touch.clientX < this.edgeSize) {
				onEdge = 'right';
			} else if (touch.clientY < this.edgeSize) {
				onEdge = 'top';
			} else if (document.documentElement.clientHeight - touch.clientY < this.edgeSize) {
				onEdge = 'bottom';
			}
			if (onEdge) {
				event.preventDefault();
				event.stopImmediatePropagation();
				this.reset(touch);
			} else {
				this.reset();
			}
		}
	}

	handleMove(event) {
		if (this.startx === null || this.starty === null) {
			return;
		}

		const touch = event.touches[0];
		let movedx = touch.clientX;
		let movedy = touch.clientY;
		let dx = this.startx - movedx;
		let dy = this.starty - movedy;
		let distancex = Math.abs(dx);
		let distancey = Math.abs(dy);

		// make sure we covered the given distance
		if (distancex < this.minLength && distancey < this.minLength) {
			//console.log('too close');
			return;
		}

		// check which direction dominates
		if (distancex > distancey) {
			if (dx > 0) {
				this.swipe('left');
			} else {
				this.swipe('right');
			}
		} else {
			if (dy > 0) {
				this.swipe('up');
			} else {
				this.swipe('down');
			}
		}

		// reset
		if (this.allowMultiple) {
			this.reset(touch);
		} else {
			this.reset();
		}
	}
}
// SwipeHelper END

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
