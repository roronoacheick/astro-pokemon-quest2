'use client';

import { Engine, Scene } from 'react-babylonjs';
import {
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  ActionManager,
  ExecuteCodeAction,
  Animation,
  Color4
} from '@babylonjs/core';
import { useRef } from 'react';
import { Joystick } from 'react-joystick-component';

export default function Mercure3D({ pointCount, onPointIntersect }) {
  const sceneRef = useRef(null);

  const handleMove = ({ x, y }) => {
    const cam = sceneRef.current?.activeCamera;
    if (cam) {
      cam.alpha += x * 0.005;
      cam.beta -= y * 0.005;
    }
  };

  return (
    <div
      className="relative w-full h-full"
      style={{
        backgroundImage: "url('/stars_milky_way.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Engine antialias adaptToDeviceRatio canvasId="mercure-canvas">
        <Scene
          onSceneMount={({ canvas, scene }) => {
            // rendre le fond transparent pour voir le div parent
            scene.clearColor = new Color4(0, 0, 0, 0);
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

            // Lumière hémisphérique
            new HemisphericLight('light', new Vector3(0, 1, 0), scene);

            // Sphère texturée
            const sphere = MeshBuilder.CreateSphere(
              'mercure',
              { segments: 32, diameter: 1.8 },
              scene
            );
            const mat = new StandardMaterial('mercureMat', scene);
            mat.diffuseTexture = new Texture('/mercury2.jpg', scene);
            sphere.material = mat;

            // Points cliquables
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

              // ActionManager click + zoom
              pt.actionManager = new ActionManager(scene);
              pt.actionManager.registerAction(
                new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                  const zoomAnim = new Animation(
                    'zoomIn',
                    'radius',
                    60,
                    Animation.ANIMATIONTYPE_FLOAT,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                  );
                  zoomAnim.setKeys([
                    { frame: 0, value: camera.radius },
                    { frame: 30, value: 0.5 }
                  ]);
                  camera.animations = [zoomAnim];
                  scene.beginAnimation(camera, 0, 30, false, 1, () => {
                    onPointIntersect(i);
                  });
                }))
            }
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