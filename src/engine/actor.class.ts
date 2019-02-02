import * as BABYLON from 'babylonjs';

export class Actor {
	protected _scene;

	constructor(_scene) {
		if (!_scene) {
			console.error('No scene for actor, must have a scene');
		} else {
			this._scene = _scene;
		}
	}
}