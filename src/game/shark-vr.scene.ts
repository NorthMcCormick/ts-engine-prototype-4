import * as BABYLON from 'babylonjs';
import * as GUI from "babylonjs-gui";

import { Scene } from '../engine/scene.class';
import { GameUtils } from '../game-utils';

import { Input } from '../engine/input.class';

export class SceneVRShark extends Scene {
	private _engine: BABYLON.Engine;
	private _camera: BABYLON.ArcRotateCamera;
	private _light: BABYLON.HemisphericLight;

	private _sharkMesh: BABYLON.AbstractMesh;
	private _sharkAnimationTime = 0;
	private _swim: boolean = false;

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

		Input.getInstance().init();

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

		/*this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);

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
			});*/
	}

	sceneBeforeRender(deltaTime) {
		super.sceneBeforeRender(deltaTime);

		// let inputManager = Input.getInstance();
		Input.getInstance().update();

		if (Input.getInstance().buttonPressed('A', false)) {
			console.log('A!');
		}

		if (Input.getInstance().buttonPressed('A', true)) {
			console.log('AAA!');
		}

		if (Input.getInstance().buttonPressed('D-LEFT', false)) {
			console.log('Lefties!');
		}

		// console.log(inputManager.padAAxesStatus);

		// console.log((Input.getInstance().padAAxesStatus))
	

		// this._gamepadManager.update();

		/*if (this._gamepadManager.buttonPressed('A')) {
			console.log('a');

			this._swim = !this._swim;
		}*/

		// this.animateShark(deltaTime);
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