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
				if (this.edgeCapture instanceof Array && this.edgeCapture.indexOf(onEdge) >= 0) {
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