import { Observable } from 'rxjs';
export class Input {
	private static instance: Input;

	controllers: any[] = []; // TODO: Types and multiple players. a player can have multiple controllers
	buttonsCache: any[] = [];
	buttonsStatus: any[] = [];
	padAAxesStatus: any[] = [0, 0, 0, 0, 0, 0, 0, 0];
	padBAxesStatus: any[] = [];

	axisChange: Observable<any> = Observable.create();

	padAAxesMap = {
		'D-LEFT': 7, // Default value is -1, -0.8 'clicked'
		'D-RIGHT': 4, // Default value is -1, -0.8 'clicked'
		'D-TOP': 3, // Default value is -1, -0.8 'clicked'
		'D-BOTTOM': 6, // Default value is -1, -0.8 'clicked'
		'J-LEFT-VERTICAL': 1,
		'J-LEFT-HORIZONTAL': 0,
		'J-RIGHT-VERTICAL': 5,
		'J-RIGHT-HORIZONTAL': 2
	};

	padAAxesMapReverse = {
		0: 'J-LEFT-HORIZONTAL',
		1: 'J-LEFT-VERTICAL',
		2: 'J-RIGHT-HORIZONTAL',
		3: 'D-TOP',
		4: 'D-RIGHT',
		5: 'J-RIGHT-VERTICAL',
		6: 'D-BOTTOM',
		7: 'D-LEFT',
	}

	padA = [
		'Start',
		'D-LEFT', 'D-RIGHT', 'D-UP', 'D-DOWN'
	];

	padB = [
		'A', 'B', 'X', 'Y',
		'LB', 'RB', 'LT', 'RT'
	];

	private constructor() {
		
	}

	static getInstance() {
		if (!Input.instance) {
			Input.instance = new Input();
			// ... any one time initialization goes here ...
		}

		return Input.instance;
	}
	
	init() {
		window.addEventListener('gamepadconnected', (e) => {
			this.connect(e)
		});
		window.addEventListener('gamepaddisconnected', (e) => {
			this.disconnect(e);
		});
	}

	pollGamepads() {
		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
				if (gamepads[i].index in this.controllers) {
					this.controllers[gamepads[i].index] = gamepads[i];
				} else {
					// addgamepad(gamepads[i]);
				}
			}
		}
	}

	private connect(e: any) {
		console.log('Something connected: ', e);
		if (e.gamepad) {
			// if (e.gamepad.mapping.trim() != '') {
				this.controllers[e.gamepad.index] = e.gamepad;
			// }
		}
	}

	private disconnect(e: any) {
		console.warn('Something disconnected', e);
	}

	buttonPressed(button, hold): boolean {
		var newPress = false;
		// loop through pressed buttons
		for (let i = 0, s = this.buttonsStatus.length; i < s; i++) {
			// if we found the button we're looking for...
			if (this.buttonsStatus[i] == button) {
				// set the boolean variable to true
				newPress = true;
				// if we want to check the single press
				if (!hold) {
					// loop through the cached states from the previous frame
					for (var j = 0, p = this.buttonsCache.length; j < p; j++) {
						// if the button was already pressed, ignore new press
						if (this.buttonsCache[j] == button) {
							newPress = false;
						}
					}
				}
			}
		}

		return newPress;
	}

	update() {
		this.pollGamepads();

		this.buttonsCache = [];

		// move the buttons status from the previous frame to the cache
		for(var k = 0; k < this.buttonsStatus.length; k++) {
			this.buttonsCache[k] = this.buttonsStatus[k];
		}
		
		// clear the buttons status
		this.buttonsStatus = [];

		var pressed = [];
		let padAAxes = [];
		let padBAxes = [];
		
		this.controllers.forEach((controller, controllerIndex) => {
			// console.log(c);

			if (controllerIndex === 0) {
				for (let b = 0, t = controller.buttons.length; b < t; b++) {
					if (controller.buttons[b].pressed || controller.buttons[b].value > 0) {
						// console.log('Pressed: ', this.padA[b], controller.buttons[b], b);

						/*if (this.padAAxesStatus[Input.getInstance().padAAxesStatus.length - 1] > -1) {
							console.log('D LEFFFTT :) ');
						}*/

						pressed.push(this.padA[b]);
					}
				}

				if (controller.axes) {
					for (let a = 0 , x = controller.axes.length; a < x; a++) {
						padAAxes.push(controller.axes[a].toFixed(2));

						switch(a) {
							/*case 0:
							case 1:
							case 2:
							case 5:
								if (controller.axes[a] > 0) {
									pressed.push(this.padAAxesMapReverse[a]);
								}
							break;*/
							
							case 3:
							case 4:
							case 6:
							case 7:
							if (controller.axes[a] > -0.8) {
								pressed.push(this.padAAxesMapReverse[a]);
							}
							break;
						}
					}
				}
			}

			if (controllerIndex === 1) {
				for (let b = 0, t = controller.buttons.length; b < t; b++) {
					if (controller.buttons[b].pressed || controller.buttons[b].value > 0) {
						// console.log('Pressed: ', controller.buttons[b], b);

						pressed.push(this.padB[b]);
					}
				}

				if (controller.axes) {
					for (let a = 0 , x = controller.axes.length; a < x; a++) {
						padBAxes.push(controller.axes[a].toFixed(2));
					}
				}
			}

			this.padAAxesStatus = padAAxes;
			this.padBAxesStatus = padBAxes;
			this.buttonsStatus = pressed;
	

			/*if (controller.buttons) {
				for (var b = 0, t = controller.buttons.length; b < t; b++) {
					if (controller.buttons[b].pressed || controller.buttons[b].value > 0) {
						console.log('Pressed: ', controller.buttons[b], b);

						pressed.push(this.buttons[b]);
					}
				}
			}*/
			
			// console.log(controller.buttons);

			/*controller.buttons.forEach((button) => {
				// console.log(button);

				if (button.pressed) {
					// console.log(button, controller);
				}
			});

			if (controllerIndex === 0) {
				for (let i = 0; i < 8; i++) {
					if (controller.axes[i]) {
						switch(i) {
							case 0:
							case 1:
							case 2:
							case 5:
								if (controller.axes[i] > 0) {
									console.log(controller.axes[i], controller);
								}
							break;

							case 3:
							case 4:
							case 6:
							case 7:
								if (controller.axes[i] > -1) {
									console.log(controller.axes[i], controller);
								}
							break;
						}
					}
				}
			}*/
		});
	}
}