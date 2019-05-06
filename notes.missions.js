//
// Missions notes
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
