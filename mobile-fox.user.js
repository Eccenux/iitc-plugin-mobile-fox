// ==UserScript==
// @id             iitc-plugin-mobile-fox@jonatkins
// @name           IITC plugin: Mobile Fox
// @category       Misc
// @version        0.0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    [0.0.1] Plugin focused in making IITC better for mobile phones. This is for users of Firefox mobile.
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

window.plugin.mobileFoxUx.CHECKPOINT = 5*60*60; //5 hours per checkpoint
window.plugin.mobileFoxUx.CYCLE = 7*25*60*60; //7 25 hour 'days' per cycle
window.plugin.mobileFoxUx.CHECKPOINTS_COUNT = window.plugin.mobileFoxUx.CYCLE / window.plugin.mobileFoxUx.CHECKPOINT;


window.plugin.mobileFoxUx.setup  = function() {

  // add a div to the sidebar, and basic style
  $('#sidebar').append('<div id="score_cycle_times_display"></div>');
  $('#score_cycle_times_display').css({'color':'#ffce00'});


  window.plugin.mobileFoxUx.update();
};

/**
	Get time left information.
*/
var formatDeltaTime = function(deltaT) {
	var deltaInfo = '';
	if (deltaT < 0) {
	} else if (deltaT < 1) {
		deltaInfo = '&lt;1 min';
	} else if (deltaT < 60) {
		deltaInfo = Math.round(deltaT) + ' min';
	} else if (deltaT < 2*60) {
		var h = Math.floor(deltaT/60);
		deltaInfo = h + 'h ';
		deltaInfo += Math.round(deltaT - 60 * h) + ' min';
	} else if (deltaT < 48*60) {
		deltaInfo = '~' + Math.round(deltaT/60) + 'h';
	} else {
		deltaInfo = '~' + Math.round(deltaT/60/24) + ' days';
	}
	return deltaInfo;
};

/**
 * Update CP and cycle times.
 */
window.plugin.mobileFoxUx.update = function() {

	// checkpoint and cycle start times are based on a simple modulus of the timestamp
	// no special epoch (other than the unix timestamp/javascript's 1970-01-01 00:00 UTC) is required

	// when regional scoreboards were introduced, the first cycle would have started at 2014-01-15 10:00 UTC - but it was
	// a few checkpoints in when scores were first added

	var now = new Date().getTime();

	var cycleStart = Math.floor(now / (window.plugin.mobileFoxUx.CYCLE*1000)) * (window.plugin.mobileFoxUx.CYCLE*1000);
	var cycleEnd = cycleStart + window.plugin.mobileFoxUx.CYCLE*1000;

	var checkpointLength = window.plugin.mobileFoxUx.CHECKPOINT*1000;
	var checkpointStart = Math.floor(now / checkpointLength) * checkpointLength;
	var checkpointEnd = checkpointStart + checkpointLength;

	var html = '<table>'
		+ plugin.mobileFoxUx.formatRow(now, 'Cycle s.', cycleStart)
		+ plugin.mobileFoxUx.formatRow(now, 'Prev CP', checkpointStart)
		+ plugin.mobileFoxUx.formatRow(now, 'Next CP', checkpointEnd, 'next-cp')
		+ plugin.mobileFoxUx.formatRow(now, 'Cycle e.', cycleEnd)
		+ '</table>'
	;

	$('#score_cycle_times_display').html(html);

	$('#score_cycle_times_display .next-cp').click(function() {
		plugin.mobileFoxUx.showCheckpointsDialog(checkpointEnd, cycleStart, cycleEnd, checkpointLength);
	});
	$('#score_cycle_times_display .next-cp .val')
		.append(' <span style="cursor:pointer" title="Show remaining checkpoints">[...]</span>')
	;

	var closestDeltaT = (checkpointEnd - now) / 1000 / 60;	// that should be closest
	setTimeout ( window.plugin.mobileFoxUx.update, updateInterval(closestDeltaT));
};


/**
 * Show remaining checkpoints.
 * 
 * All times passed as a timestamp in ms.
 * 
 * @param {Number} checkpointEnd Time of first checkpoint to be shown (should be the end time of current checkpoint).
 * @param {Number} cycleStart Start time of the cycle to show.
 * @param {Number} cycleEnd End time of the cycle to show. Might be replaced with final date to be shown.
 * @param {Number} checkpointLength [const] Checkpoint lenght in ms.
 */
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



var setup =  window.plugin.mobileFoxUx.setup;

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
