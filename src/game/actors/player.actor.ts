import * as BABYLON from 'babylonjs';

import { Actor } from '../../engine/actor.class';

export class Player extends Actor {
	mesh: BABYLON.Mesh;

	constructor(_scene) {
		super(_scene)

		this.mesh = BABYLON.Mesh.CreateBox("box", 3.0, this._scene);
		this.mesh.position.x = -3;
		this.mesh.position.y = 3;
		this.mesh.position.z = 8;

		this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.05 }, this._scene);
	}
}