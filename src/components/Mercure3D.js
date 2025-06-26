// src/components/Mercure3D.js
'use client';

import { Engine, Scene } from 'react-babylonjs';
import {
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3
} from '@babylonjs/core';
import { useRef } from 'react';
import { Joystick } from 'react-joystick-component';

export default function Mercure3D({ pointCount, onPointIntersect }) {
  const sceneRef = useRef(null);

  // Gère le mouvement de la caméra via le joystick
  const handleMove = ({ x, y }) => {
    const cam = sceneRef.current?.activeCamera;
    if (cam) {
      cam.alpha += x * 0.005;
      cam.beta  -= y * 0.005;
    }
  };

  return (
    <div className="relative w-full h-full">
      <Engine antialias adaptToDeviceRatio canvasId="mercure-canvas">
        <Scene
          onSceneMount={({ canvas, scene }) => {
            sceneRef.current = scene;

            // Caméra orbitale
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

            // Lumière
            new HemisphericLight('light', new Vector3(0, 1, 0), scene);

            // Sphère texturée avec mercury2.jpg placé directement dans public/
            const sphere = MeshBuilder.CreateSphere(
              'mercure',
              { segments: 32, diameter: 1.8 },
              scene
            );
            const mat = new StandardMaterial('mercureMat', scene);
            const tex = new Texture(
              '/mercury2.jpg',
              scene,
              false,
              false,
              Texture.TRILINEAR_SAMPLINGMODE,
              () => console.log('✅ Texture mercury2.jpg chargée'),
              (msg, ex) => console.error('❌ Échec chargement texture mercury2.jpg', msg, ex)
            );
            mat.diffuseTexture = tex;
            sphere.material = mat;

            // Points noirs
            for (let i = 0; i < pointCount; i++) {
              const u = Math.random() * Math.PI * 2;
              const v = Math.acos(2 * Math.random() - 1);
              const r = 0.91;
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
              matP.diffuseColor = new Vector3(0, 0, 0);
              pt.material = matP;
            }

            // Collision center-screen
            scene.onBeforeRenderObservable.add(() => {
              const w = scene.getEngine().getRenderWidth();
              const h = scene.getEngine().getRenderHeight();
              const pick = scene.pick(w / 2, h / 2);
              if (pick.hit && pick.pickedMesh?.name.startsWith('point-')) {
                const idx = parseInt(pick.pickedMesh.name.split('-')[1], 10);
                onPointIntersect(idx);
                scene.onBeforeRenderObservable.clear();
              }
            });
          }}
        />
      </Engine>

      {/* Joystick mobile */}
      <div className="absolute bottom-4 left-4 w-32 h-32 z-30">
        <Joystick size={100} baseColor="#333" stickColor="#999" move={handleMove} />
      </div>
    </div>
  );
}
