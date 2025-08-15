import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

interface ThreeViewerProps {
  models: string[];
  isLoading: boolean;
}

function Scene({ models }: { models: string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();
  const [loadedModels, setLoadedModels] = useState<THREE.Group[]>([]);

  useEffect(() => {
    if (models.length === 0) return;

    const loader = new GLTFLoader();
    const loadedGroups: THREE.Group[] = [];

    Promise.all(
      models.map((modelUrl) =>
        new Promise<THREE.Group>((resolve, reject) => {
          loader.load(
            modelUrl,
            (gltf) => {
              const group = new THREE.Group();
              group.add(gltf.scene);
              resolve(group);
            },
            undefined,
            reject
          );
        })
      )
    ).then((groups) => {
      setLoadedModels(groups);
    }).catch((error) => {
      console.error('Error loading models:', error);
    });
  }, [models]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.clear();
      loadedModels.forEach((model) => {
        groupRef.current?.add(model);
      });
    }
  }, [loadedModels]);

  useFrame(() => {
    if (groupRef.current && loadedModels.length > 0) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Placeholder content when no models are loaded */}
      {loadedModels.length === 0 && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#666" wireframe />
        </mesh>
      )}
    </group>
  );
}

export const ThreeViewer: React.FC<ThreeViewerProps> = ({ models, isLoading }) => {
  return (
    <div className="flex-1 h-full bg-background border border-viewer-border relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-primary font-mono">Loading 3D tiles...</div>
        </div>
      )}
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enablePan enableZoom enableRotate />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Scene content */}
        <Scene models={models} />
        
        {/* Grid and helpers for better visualization */}
        <gridHelper args={[10, 10]} />
        <axesHelper args={[2]} />
      </Canvas>
      
      {models.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-xl font-mono text-muted-foreground">
              This app demonstrates fetching & rendering<br />
              Google Earth 3D Tiles in ThreeJS
            </div>
            <div className="space-y-2 text-sm font-mono text-muted-foreground">
              <p>1. Get a <a href="https://developers.google.com/maps/documentation/tile/get-api-key" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google "Map Tiles"</a> API key</p>
              <p>2. Paste it in the settings top left</p>
              <p>3. Click <span className="text-primary">fetch tiles</span></p>
            </div>
            <a 
              href="https://github.com/OmarShehata/google-earth-as-gltf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-primary hover:underline font-mono"
            >
              Learn more
            </a>
          </div>
        </div>
      )}
    </div>
  );
};