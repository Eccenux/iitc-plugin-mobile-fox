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
}