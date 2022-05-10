// ==UserScript==
// @author      Eccenux
// @name        IITC plugin: Mobile Fox UX
// @id          iitc-plugin-mobile-fox@jonatkins
// @category    Misc
// @namespace   https://github.com/jonatkins/ingress-intel-total-conversion
// @version     0.2.2
// @description [0.2.2] Plugin focused on making IITC better for mobile phones. Mostly for users of Firefox for Android.
// @updateURL   https://github.com/Eccenux/iitc-plugin-mobile-fox/raw/master/mobile-fox.meta.js
// @downloadURL https://github.com/Eccenux/iitc-plugin-mobile-fox/raw/master/mobile-fox.user.js
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @match       https://intel.ingress.com/*
// @match       https://intel.ingress.com/*
// @grant       none
// ==/UserScript==

var _css = /*css*/ `
/**
	Drawer (chat links etc)
*/
#link-drawer {
  max-height: 100vh;
  background: #0e3d4e;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10101;
  box-sizing: border-box;
  padding-left: 6px;
  padding-bottom: 6px;
  display: flex;
  flex-flow: column-reverse wrap;
}
#link-drawer > a {
  box-sizing: border-box;
  display: block;
  padding: 0.5em 0.5em;
  margin: 6px;
  margin-bottom: 3px;
  margin-left: 3px;
  text-align: left;
  border: 2px outset #20A8B1;
  background: #0e3d4e;
  box-shadow: 0 0 0 9px #0e3d4e;
}
#link-drawer > a:hover {
  text-decoration: none;
}
.open-drawer-button {
  box-sizing: border-box;
  display: block;
  position: absolute;
  z-index: 10100;
  bottom: calc(19px + 23px + 5px);
  left: -5px;
  padding: 5px 8px 5px 0;
  font-size: 25px;
  background: #0e3d4e;
  border-radius: 0 10px 10px 0;
  opacity: 0.6;
}
/**
	Portal info view (sidebar in desktop mode)
*/
/*
// tweak sidebar for 'margin-top: auto;' to work
#sidebar {
	display: flex;
	flex-direction: column;
}
*/
#sidebar .mobile-fox-nav-bar {
  position: fixed;
  bottom: 0;
  background: #0e3d4e;
}
#sidebar .mobile-fox-nav-bar {
  box-sizing: border-box;
  padding: 3px;
}
#sidebar .mobile-fox-nav-bar > a {
  box-sizing: border-box;
  display: block;
  text-align: center;
  padding: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
  border: 2px outset #20A8B1;
}
.leaflet-left.leaflet-top {
  display: flex;
  flex-flow: column;
  height: calc(100vh - 20px - 19px - 23px);
  flex-wrap: wrap;
}
/**
	Layers chooser
*/
.leaflet-control-layers {
  max-height: calc(100vh - 23px - 5px - 5px);
  overflow-y: scroll;
  box-sizing: border-box;
  max-width: calc(100vw - 2em);
}
.leaflet-control-layers-base,
.leaflet-control-layers-overlays {
  float: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border-left-style: none;
  overflow-y: visible;
}
.leaflet-control-layers-list {
  height: auto !important;
}
.leaflet-control-layers-list {
  columns: 2;
  column-rule: 1px solid #ddd;
}
@media (max-width: 460px) {
  .leaflet-control-layers-list {
    columns: 1;
  }
}
.leaflet-control-layers-overlays {
  padding: 1em 0;
}
.leaflet-control-layers label {
  margin: 1em;
  padding: 0.2em 0;
}
.leaflet-control-layers-base:before {
  content: 'Tiles:';
}
.leaflet-control-layers-overlays:before {
  content: 'Layers:';
}
.leaflet-control-layers-list > .layers-close-button {
  float: right;
  color: black;
}

`;

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

/* global SwipeHelper, layerChooser */
/**
 * Add pane/panel.
 * 
 * Similar to `android.addPane`, but instead of resource name you can add a class to the link.
 * 
 * Note some plugins are detected and added automatically.
 * If you have a plugin not listed just run this function from your plugin.
 */
window.plugin.mobileFoxUx.addPane = function(id, name, className) {
	if (typeof className !== 'string') {
		className = 'plugin-link';
	}
	$('#link-drawer').append(`<a class="${className}" onclick="show('${id}')">${name}</a>`);
}

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
	//swipeEdgeHelper.edgeSize = 40;	// about the same as a single column of tools (leaflet-left).
	swipeEdgeHelper.edgeSize = 20;
	swipeEdgeHelper.edgeCapture = ['left'];
	swipeEdgeHelper.captureExceptionElements = ['a', 'button', 'input'];
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
		<a class="close-button" onclick="this.parentNode.style.display = 'none'">❎ Close</a>

		<a onclick="show('all')"    >Log: all</a>
		<a onclick="show('faction')">Log: faction</a>
		<a onclick="show('alerts')" >Log: alerts</a>

		<a onclick="show('map')">🗺️ Map</a>
		<a onclick="show('info')">ℹ️ Info</a>

	</div>
	<a class="open-drawer-button" onclick="$('#link-drawer').show()">☰</a>
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

	// close button
	var nel = document.createElement('a');
	nel.href="#";
	nel.className = 'layers-close-button'
	nel.innerHTML = '❎ Close';
	nel.onclick = (event)=>{
		layerChooser._collapse();
		event.preventDefault();
	}
	var chooserParent = document.querySelector('.leaflet-control-layers-list');
	chooserParent.insertBefore(nel, chooserParent.firstChild);
}

window.plugin.mobileFoxUx.fullScreenImage = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBvbHlnb24gZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHBvaW50cz0iNDYuNDI3LDAuMDAzIDEwMC4wMDQsMC4wMDMgMTAwLjAwNCw1My41NzMgICI+PC9wb2x5Z29uPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTMuNTcsMjguNTc0TDc0Ljk5OCw3LjE0NmM0Ljc0My00Ljc0MywxMi45OC00Ljg4MiwxNy44NTYsMCAgIGM0Ljg4Myw0Ljg3Niw0Ljc0MywxMy4xMTQsMCwxNy44NUw3MS40MjcsNDYuNDNjLTQuNzQzLDQuNzQ0LTEyLjk3NSw0Ljg4Mi0xNy44NTYsMEM0OC42ODcsNDEuNTQ3LDQ4LjgyNywzMy4zMSw1My41NywyOC41NzR6Ij48L3BhdGg+PC9nPjxnPjxwb2x5Z29uIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBwb2ludHM9IjUzLjU3LDEwMCAwLDEwMCAwLDQ2LjQzICAiPjwvcG9seWdvbj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQ2LjQyNyw3MS40M0wyNC45OTksOTIuODU3Yy00Ljc0Myw0Ljc0My0xMi45NzQsNC44ODMtMTcuODU2LDAgICBzLTQuNzQzLTEzLjExMywwLTE3Ljg1NmwyMS40MjgtMjEuNDI4YzQuNzQzLTQuNzQ0LDEyLjk3NC00Ljg4MywxNy44NTYsMEM1MS4zMSw1OC40NTUsNTEuMTcsNjYuNjg3LDQ2LjQyNyw3MS40M3oiPjwvcGF0aD48L2c+PC9zdmc+";

/**
 * Full-screen toggle setup.
 */
window.plugin.mobileFoxUx.setupFullScreen = function() {
	// TEMP/TODO: full screen mode
	var container = document.createElement('div');
	container.className = 'leaflet-top';	// seem to be required for toggle to work
	container.style.cssText = 'right:50px; z-index: 2599';	// space for tap; above highlight selector
	var toggleImage = window.plugin.mobileFoxUx.fullScreenImage;
	container.innerHTML = `
		<div class="leaflet-control" style="">
			<a onclick="window.plugin.mobileFoxUx.toggleFullScreen(event)"
			style="
				background: white;
				border-radius: 4px;
				box-shadow: 0 1px 5px rgba(0,0,0,0.4);

				display:block;
				box-sizing: border-box;
				width: 36px; height: 36px;
			">
			<img alt="toggle full-screen"
				style="
					width: 28px; height: 28px;
					padding: 4px;
					opacity: .8;
				"
				src="${toggleImage}"
			></a>
		</div>
	`;
	document.body.appendChild(container);
}
/**
 * Full-screen toggle action.
 */
window.plugin.mobileFoxUx.toggleFullScreen = function(event) {
	event.preventDefault();

	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen(); 
		}
	}
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

/**
 * Missions plugin overwrites.
 * 
 * This is meant to extend the original like so:
 * $.extend(window.plugin.missions, missionsOverwrite);
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
	
	/**
	 * Handle capture exceptions.
	 */
	shouldCapture(onEdge, event) {
		// capture event only on specifc edges
		if (this.edgeCapture instanceof Array && this.edgeCapture.indexOf(onEdge) >= 0) {
			// don't capture for some target elements
			let targetElement = event.target.nodeName.toLowerCase();
			if (this.captureExceptionElements instanceof Array) {
				// current element
				if (this.captureExceptionElements.indexOf(targetElement) >= 0) {
					console.log('[SwipeHelper] touch NOT captured for target: ', targetElement);
					return false;
				}
				// any ancestor
				if ($(event.target).parents(this.captureExceptionElements.join(',')).length > 0) {
					console.log('[SwipeHelper] touch NOT captured for target: ', targetElement);
					return false;
				}
				return true;
			} else {
				return true;
			}
		}
		return false;
	}

	/**
	 * Touch (and swipe) start event.
	 */
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
				// handle capture exceptions
				if (this.shouldCapture(onEdge, event)) {
					event.preventDefault();
					event.stopImmediatePropagation();
					console.log('[SwipeHelper] touch captured');
				}
				this.reset(touch);
			} else {
				this.reset();
			}
		}
	}

	/**
	 * Touch move event (continue swipe).
	 */
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

// only small wrapper to allow debugging
function wrapper(plugin_info) {
	var setup =  window.plugin.mobileFoxUx.setup;

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
