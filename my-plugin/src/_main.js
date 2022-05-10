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
