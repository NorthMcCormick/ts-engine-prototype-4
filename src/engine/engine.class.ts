import {GameUtils} from '../game-utils';
import * as BABYLON from 'babylonjs';
import * as GUI from "babylonjs-gui";
import { Scene } from './scene.class';

export class Engine {
  private static instance: Engine;
  
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  
  private currentScene: Scene = null;
  
  private constructor() {
    // do something construct...
  }
  
  static getInstance() {
    if (!Engine.instance) {
      Engine.instance = new Engine();
      // ... any one time initialization goes here ...
    }
    return Engine.instance;
  }
  
  init(canvasElementId: string) {
    this._canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);
    this._engine = new BABYLON.Engine(this._canvas, true);
  }
  
  setScene(scene: Scene) {
    // TODO: Scene destroy
    this.currentScene = scene;
    this.currentScene.initScene(this._engine);
  }
  
  /**
  * Starts the animation loop.
  */
  animate(): void {
    if (this.currentScene !== null) {
      this.currentScene.getScene().registerBeforeRender(() => {
        let deltaTime: number = (1 / this._engine.getFps());
        
        this.currentScene.sceneBeforeRender(deltaTime);
      });
      
      // run the render loop
      this._engine.runRenderLoop(() => {
        this.currentScene.getScene().render();
      });
      
      // the canvas/window resize event handler
      window.addEventListener('resize', () => {
        this._engine.resize();
      });
    } else {
      console.error('No current scene');
    }
  }
}