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