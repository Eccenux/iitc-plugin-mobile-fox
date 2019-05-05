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
		this.minLength = 50;
		this.log = document.querySelector('#log');
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
		this.log.innerHTML += `<p>${type}</p>`;
	}

	initEvents(container) {
		container.addEventListener('touchstart', (e) => {
			this.handleStart(e);
		}, false);
		container.addEventListener('touchmove', (e) => {
			this.handleMove(e);
		}, false);
	}

	reset() {
		this.startx = null;
		this.starty = null;
	}

	handleStart(event) {
		const touch = event.touches[0];
		this.startx = touch.clientX;
		this.starty = touch.clientY;
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
			console.log('too close');
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
		this.startx = null;
		this.starty = null;
	}
}