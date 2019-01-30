import * as BABYLON from 'babylonjs';
import * as GUI from "babylonjs-gui";

import { Scene } from '../engine/scene.class';
import { GameUtils } from '../game-utils';

export class SceneVRShark extends Scene {
	private _engine: BABYLON.Engine;
	private _camera: BABYLON.ArcRotateCamera;
	private _light: BABYLON.HemisphericLight;

	private _sharkMesh: BABYLON.AbstractMesh;
	private _sharkAnimationTime = 0;
	private _swim: boolean = false;

	private _gamepadManager: any;

	constructor() {
		super();

		this.sceneName = 'scene-vr';

		console.log(`Shark Scene Instance ${ this.sceneName }`);
	}

	initScene(_engine) {
		this._engine = _engine;

		super.initScene(this._engine);

		this._scene.enablePhysics(this._gravityVector, this._physicsPlugin);

		this._camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 30, BABYLON.Vector3.Zero(), this._scene);



		var gamepadAPI = {
			controller: {},
			turbo: false,
			connect: function(e: any) {
				gamepadAPI.controller = e.gamepad;
				gamepadAPI.turbo = true;
				
				console.log('Gamepad connected.', e.gamepad);
			},
			disconnect: function(e) {
				gamepadAPI.turbo = false;

				delete gamepadAPI.controller;

				console.log('Gamepad disconnected.');
			},			
			update: function() {
				// clear the buttons cache
				gamepadAPI.buttonsCache = [];
				// move the buttons status from the previous frame to the cache
				for(var k=0; k<gamepadAPI.buttonsStatus.length; k++) {
					gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
				}
				// clear the buttons status
				gamepadAPI.buttonsStatus = [];
				// get the gamepad object
				var c: any = gamepadAPI.controller || {};

				// loop through buttons and push the pressed ones to the array
				var pressed = [];
				// console.log(c);
				if(c.buttons) {
					for(var b=0,t=c.buttons.length; b<t; b++) {
						if(c.buttons[b].pressed || c.buttons[b].value > 0) {
							console.log('Pressed: ', c.buttons[b], b);
							pressed.push(gamepadAPI.buttons[b]);
						}
					}
				}

				// loop through axes and push their values to the array
				var axes = [];
				if(c.axes) {
					for(var a=0,x=c.axes.length; a<x; a++) {
						axes.push(c.axes[a].toFixed(2));
					}
				}
				// assign received values
				gamepadAPI.axesStatus = axes;
				gamepadAPI.buttonsStatus = pressed;
				// return buttons for debugging purposes
				return pressed;
			},
			buttonPressed: function(button, hold) {
				var newPress = false;
				// loop through pressed buttons
				for(var i=0,s=gamepadAPI.buttonsStatus.length; i<s; i++) {
					// if we found the button we're looking for...
					if(gamepadAPI.buttonsStatus[i] == button) {
						// set the boolean variable to true
						newPress = true;
						// if we want to check the single press
						if(!hold) {
							// loop through the cached states from the previous frame
							for(var j=0,p=gamepadAPI.buttonsCache.length; j<p; j++) {
								// if the button was already pressed, ignore new press
								if(gamepadAPI.buttonsCache[j] == button) {
									newPress = false;
								}
							}
						}
					}
				}
				return newPress;
			},
			buttons: [
				'DPad-Up','DPad-Down','DPad-Left','DPad-Right',
				'Start','Back','Axis-Left','Axis-Right',
				'LB','RB','Power','A','B','X','Y',
			],
			buttonsCache: [],
			buttonsStatus: [],
			axesStatus: []
		};

		window.addEventListener("gamepadconnected", gamepadAPI.connect);
		window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);


		this._gamepadManager = gamepadAPI;


		// this._camera.attachControl(this._canvas, true);

		/*this._gamepadManager = new BABYLON.GamepadManager();

		this._gamepadManager.onGamepadConnectedObservable.add((gamepad: BABYLON.GenericPad, state)=>{
			console.log(gamepad, state);

			//if (gamepad instanceof BABYLON.GenericPad) {
				gamepad.onButtonDownObservable.add((button, state)=>{
					console.log(button, state)
				});

				gamepad.onleftstickchanged((values)=>{
					//Left stick has been moved
					console.log(values.x+" "+values.y)
				});
			//}

			window.addEventListener("gamepadbuttondown", function(e: any){
				// Button down
				console.log(
		 
					 "Button down",
					 e.button, // Index of button in buttons array
					 e.gamepad
		 
				);
		 });
		});

		this._gamepadManager.onGamepadDisconnectedObservable.add((gamepad, state)=>{
			console.log(gamepad, state);
		});*/

		this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);

		let skybox = GameUtils.createSkybox("skybox", "./assets/texture/skybox/TropicalSunnyDay", this._scene);

		let ground = GameUtils.createGround(this._scene);
		// creates the watermaterial and adds the relevant nodes to the renderlist
		let waterMaterial = GameUtils.createWater(this._scene);

		waterMaterial.addToRenderList(skybox);
		waterMaterial.addToRenderList(ground);

		GameUtils.createShark(this._scene)
			.subscribe(sharkMesh => {
				this._sharkMesh = sharkMesh;
				this._sharkMesh.getChildren().forEach(
					mesh => {
						waterMaterial.addToRenderList(mesh);
					}
				);
			});

		// finally the new ui
		GameUtils.createGui("Start Swimming",
			(btn) => {
				let textControl = btn.children[0] as GUI.TextBlock;
				this._swim = !this._swim;
				if (this._swim) {
					textControl.text = "Stop Swimming";
				}
				else {
					textControl.text = "Start Swimming";
				}
			});
	}

	sceneBeforeRender(deltaTime) {
		super.sceneBeforeRender(deltaTime);

		this._gamepadManager.update();

		if (this._gamepadManager.buttonPressed('A')) {
			console.log('a');

			this._swim = !this._swim;
		}

		this.animateShark(deltaTime);
	}

	animateShark(deltaTime: number): void {
		if (this._sharkMesh && this._swim) {
			this._sharkAnimationTime += deltaTime;            
			this._sharkMesh.getChildren().forEach(
				mesh => {
					let vertexData = BABYLON.VertexData.ExtractFromMesh(mesh as BABYLON.Mesh);
					let positions = vertexData.positions;
					let numberOfPoints = positions.length / 3;
					for (let i = 0; i < numberOfPoints; i++) {
						positions[i * 3] +=
							Math.sin(0.2 * positions[i * 3 + 2] + this._sharkAnimationTime * 3) * 0.1;
					}
					vertexData.applyToMesh(mesh as BABYLON.Mesh);
				}
			);
		}
	}
}