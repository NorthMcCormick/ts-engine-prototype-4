import { Observable } from 'rxjs';

export class Utilities {
	/**
	* Returns Observable of mesh array, which are loaded from a file.
	* After mesh importing all meshes become given scaling, position and rotation.
	* @param fileName
	* @param scene
	* @param scaling
	* @param position
	* @param rotationQuaternion
	*/
	public static createMeshFromObjFile(folderName: string, fileName: string, scene: BABYLON.Scene,
		scaling?: BABYLON.Vector3, position?: BABYLON.Vector3, rotationQuaternion?: BABYLON.Quaternion): Observable<BABYLON.AbstractMesh[]> {
			
			if (!fileName) {
				return Observable.throw("GameUtils.createMeshFromObjFile: parameter fileName is empty");
			}
			if (!scene) {
				return Observable.throw("GameUtils.createMeshFromObjFile: parameter fileName is empty");
			}
			
			if (!folderName) folderName = "";
			if (!scaling) scaling = BABYLON.Vector3.One();
			if (!position) position = BABYLON.Vector3.Zero();
			if (!rotationQuaternion) rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
			
			let assetsFolder = './assets/' + folderName;
			
			return Observable.create(observer => {
				BABYLON.SceneLoader.ImportMesh(null, assetsFolder, fileName, scene,
					(	meshes: BABYLON.AbstractMesh[],
						particleSystems: BABYLON.ParticleSystem[],
						skeletons: BABYLON.Skeleton[]) => {
							meshes.forEach((mesh) => {
								mesh.position = position;
								mesh.rotationQuaternion = rotationQuaternion;
								mesh.scaling = scaling;
							});
							
							console.log("Imported Mesh: " + fileName);

							observer.next(meshes);
						});
					});
				}
			}