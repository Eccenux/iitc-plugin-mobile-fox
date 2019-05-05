/**
 * Helper class for detecting swipe events.
 * 
 * Note! Override `swipe` function to handle swipe events.
 */
class SwipeHelper {
	/**
	 * Init.
	 * 
	 * @param {Element?} container Event container/base element. Defaults to document.
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

		if (!(container instanceof Element)) {
			container = document;
		}

		// events
		this.initEvents(container);

		// reset
		this.reset();
	}

	/**
	 * Handle swipe event.
	 * 
	 * @param {String} type Swipe type (dominant direction).
	 */
	swipe(type) {
		
	}

	initEvents(container) {
		container.addEventListener('touchstart', (e) => {
			this.handleStart(e);
		}, false);
		container.addEventListener('touchmove', (e) => {
			this.handleMove(e);
		}, false);
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
		this.reset(touch);
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