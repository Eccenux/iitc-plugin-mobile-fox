//
// Missions notes
//

if (window.plugin.missions) {
	window.plugin.mobileFoxUx.createMissionsPane.call(window.plugin.missions);
	window.plugin.mobileFoxUx.addPane('plugin-missions', 'Missions');
}

class MissionsOverwrite {
	constructor() {}

	showMissionListDialog (missions) {
		this.container = this.renderMissionList(missions);
	}

	onPaneChanged (pane) {
		if(pane == 'plugin-missions') {
			document.body.appendChild(this.mobilePane);
			this.openTopMissions();
		} else if(this.mobilePane.parentNode) {
			this.mobilePane.parentNode.removeChild(this.mobilePane);
		}
	
	}

	createMissionsPane () {
		this.mobilePane = document.createElement('div');
		this.mobilePane.className = 'plugin-mission-pane';
	
		this.container = this.mobilePane.appendChild(document.createElement('div'));
		addHook('paneChanged', () => {
			this.onPaneChanged();
		});
	}
}

