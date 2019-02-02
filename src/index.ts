import { Engine } from './engine/engine.class';
import 'babylonjs-materials';
import 'babylonjs-loaders';
import CANNON = require('cannon');
import { SceneVRShark } from './game/scenes/shark-vr.scene';

window.addEventListener('DOMContentLoaded', () => {
  // Set global variable for cannonjs physics engine
  let game = Engine.getInstance();
  game.init('renderCanvas');

  game.animate();

  let scene = new SceneVRShark();

  game.setScene(scene);

  game.animate();


  
  /*let game = new EngineB('renderCanvas');
  game.createScene();
  game.animate();*/
});
