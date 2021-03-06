import * as BABYLON from 'babylonjs';
import * as GUI from "babylonjs-gui";

import { Scene } from '../../engine/scene.class';
import { GameUtils } from '../../game-utils';

export class SceneShark extends Scene {
	private _engine: BABYLON.Engine;
	private _camera: BABYLON.ArcRotateCamera;
	private _light: BABYLON.HemisphericLight;

	private _sharkMesh: BABYLON.AbstractMesh;
	private _sharkAnimationTime = 0;
	private _swim: boolean = false;

	constructor() {
		super();

		this.sceneName = 'scene';

		console.log('Shark Scene Instance');
	}

	initScene(_engine, _canvas) {
		this._engine = _engine;

		super.initScene(this._engine, _canvas);

		this._scene.enablePhysics(this._gravityVector, this._physicsPlugin);

		this._camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 30, BABYLON.Vector3.Zero(), this._scene);

		// this._camera.attachControl(this._canvas, true);

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