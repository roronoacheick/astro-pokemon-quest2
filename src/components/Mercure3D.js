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

export default function Mercure3D({ onPointIntersect }) {
  const sceneRef = useRef(null);

  // fonction appelée quand le joystick bouge
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
            // Sauvegarde la scène pour le joystick
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

            // 2) Lumière hémisphérique
            new HemisphericLight('light', new Vector3(0, 1, 0), scene);

            // 3) Création de la sphère texturée
            const sphere = MeshBuilder.CreateSphere(
              'mercure',
              { segments: 32, diameter: 1.8 },
              scene
            );
            const mat = new StandardMaterial('mercureMat', scene);
            mat.diffuseTexture = new Texture('/planets/mercury.jpg', scene);
            sphere.material = mat;
          }}
        />
      </Engine>

      {/* Joystick mobile */}
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
