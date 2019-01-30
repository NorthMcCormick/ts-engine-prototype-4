export class Scene {
	sceneName: string;
	_scene: BABYLON.Scene;
	_gravityVector: BABYLON.Vector3 =  new BABYLON.Vector3(0, -9.81, 0);
	_physicsPlugin: BABYLON.OimoJSPlugin = new BABYLON.OimoJSPlugin();

	initScene(_engine) {
		this._scene = new BABYLON.Scene(_engine);

		console.log(`Scene: Init ${ this.sceneName }`);
	}

	getScene() {
		return this._scene;
	}

	sceneBeforeRender(deltaTime) {

	}
}