'use client';

import { Engine, Scene } from 'react-babylonjs';
import {
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  Color3
} from '@babylonjs/core';
import { useRef } from 'react';
import { Joystick } from 'react-joystick-component';

export default function Mercure3D({ pointCount, onPointIntersect }) {
  const sceneRef = useRef(null);

  // Contrôle caméra via joystick
  const handleMove = ({ x, y }) => {
    const cam = sceneRef.current?.activeCamera;
    if (cam) {
      cam.alpha += x * 0.005;
      cam.beta  -= y * 0.005;
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      <Engine antialias adaptToDeviceRatio canvasId="mercure-canvas">
        <Scene
          onSceneMount={({ canvas, scene }) => {
            sceneRef.current = scene;

            // 1) Caméra orbitale
            const camera = new ArcRotateCamera(
              'camera',
              Math.PI / 2,
              Math.PI / 2,
              2,
              Vector3.Zero(),
              scene
            );
            camera.attachControl(canvas, true);
            camera.lowerBeta = 0.5;
            camera.upperBeta = Math.PI;
            camera.wheelPrecision = 50;

            // 2) Lumière
            new HemisphericLight('light', new Vector3(0, 1, 0), scene);

            // 3) Sphère texturée de Mercure
            const sphere = MeshBuilder.CreateSphere(
              'mercure',
              { segments: 32, diameter: 1.8 },
              scene
            );
            const mat = new StandardMaterial('mercureMat', scene);
            mat.diffuseTexture = new Texture('/planets/mercury.jpg', scene);
            sphere.material = mat;

            // 4) Génération des points noirs
            const markers = [];
            for (let i = 0; i < pointCount; i++) {
              const u = Math.random() * 2 * Math.PI;
              const v = Math.acos(2 * Math.random() - 1);
              const r = 0.91; // juste au-dessus de la surface
              const x = r * Math.sin(v) * Math.cos(u);
              const y = r * Math.sin(v) * Math.sin(u);
              const z = r * Math.cos(v);

              const pt = MeshBuilder.CreateSphere(
                `point-${i}`,
                { diameter: 0.05 },
                scene
              );
              pt.position = new Vector3(x, y, z);
              const matP = new StandardMaterial(`matP-${i}`, scene);
              matP.diffuseColor = new Color3(0, 0, 0);
              pt.material = matP;
              markers.push(pt);
            }

            // 5) Détection de collision au centre de l'écran
            scene.onBeforeRenderObservable.add(() => {
              const engine = scene.getEngine();
              const pick = scene.pick(
                engine.getRenderWidth() / 2,
                engine.getRenderHeight() / 2
              );
              if (pick.hit && pick.pickedMesh?.name.startsWith('point-')) {
                const idx = parseInt(pick.pickedMesh.name.split('-')[1], 10);
                onPointIntersect(idx);
                scene.onBeforeRenderObservable.clear();
              }
            });
          }}
        />
      </Engine>

      {/* Joystick tactile */}
      <div className="absolute bottom-4 left-4 w-32 h-32">
        <Joystick
          size={100}
          baseColor="#333"
          stickColor="#999"
          move={handleMove}
        />
      </div>
    </div>
  );
}
