import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { checkWebGLSupport, WebGLFallback } from './WebGLErrorBoundary';
import { cleanupThreeJSResources } from '../../utils/performanceMonitor';
import { StaticBackground } from './StaticBackground';

interface BackgroundSceneProps {
  className?: string;
}

interface PerformanceSettings {
  particleCount: number;
  geometryCount: number;
  enableLighting: boolean;
  enablePostProcessing: boolean;
  maxFPS: number;
}

export const BackgroundScene: React.FC<BackgroundSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometriesRef = useRef<THREE.Mesh[]>([]);
  const lightsRef = useRef<THREE.Light[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings | null>(null);

  useEffect(() => {
    // Check WebGL support and determine performance settings
    const supported = checkWebGLSupport();
    setWebglSupported(supported);
    
    if (!supported || !mountRef.current) return;

    // Use simple default settings instead of performance monitor
    const settings = getSimplePerformanceSettings();
    setPerformanceSettings(settings);

    // Skip performance monitoring during initial load
    const unsubscribe = () => {};

    if (!settings) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // Renderer setup with production optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: settings.enablePostProcessing && !import.meta.env.PROD, 
      alpha: true,
      powerPreference: import.meta.env.PROD ? 'default' : 'high-performance',
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, import.meta.env.PROD ? 1 : (settings.enablePostProcessing ? 2 : 1)));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = settings.enableLighting && !import.meta.env.PROD;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Production optimizations
    if (import.meta.env.PROD) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1;
    }
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Initialize clock
    clockRef.current = new THREE.Clock();

    // Create lighting system
    if (settings.enableLighting) {
      createLightingSystem(scene);
    }

    // Create particle system
    createParticleSystem(scene, settings);

    // Create floating geometric shapes
    createFloatingGeometry(scene, settings);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Animation loop with performance throttling
    const animate = (currentTime: number) => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Throttle frame rate for performance
      if (currentTime - lastFrameTimeRef.current < 1000 / settings.maxFPS) {
        return;
      }
      lastFrameTimeRef.current = currentTime;
      
      const elapsedTime = clockRef.current?.getElapsedTime() || 0;
      
      // Animate particles with reduced complexity in production
      if (particlesRef.current) {
        const rotationSpeed = import.meta.env.PROD ? 0.02 : 0.05;
        particlesRef.current.rotation.x = elapsedTime * rotationSpeed;
        particlesRef.current.rotation.y = elapsedTime * (rotationSpeed * 2);
        
        // Reduced mouse interaction in production
        if (!import.meta.env.PROD) {
          const mouseInfluence = 0.2;
          particlesRef.current.rotation.x += mouseRef.current.y * mouseInfluence * 0.02;
          particlesRef.current.rotation.y += mouseRef.current.x * mouseInfluence * 0.02;
        }
        
        // Update particle colors less frequently in production
        if (!import.meta.env.PROD || Math.floor(elapsedTime * 10) % 3 === 0) {
          updateParticleColors(elapsedTime);
        }
      }
      
      // Animate geometric shapes with reduced frequency in production
      if (!import.meta.env.PROD || Math.floor(elapsedTime * 5) % 2 === 0) {
        animateGeometry(elapsedTime);
      }
      
      // Smooth camera movement (reduced in production)
      if (!import.meta.env.PROD) {
        animateCamera(elapsedTime);
      }
      
      // Update lighting
      if (settings.enableLighting && !import.meta.env.PROD) {
        updateLighting(elapsedTime);
      }
      
      renderer.render(scene, camera);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate(0);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      unsubscribe();
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Use utility function for proper cleanup
      if (particlesRef.current) {
        cleanupThreeJSResources(particlesRef.current);
        scene.remove(particlesRef.current);
      }
      
      // Dispose geometries
      geometriesRef.current.forEach(mesh => {
        cleanupThreeJSResources(mesh);
        scene.remove(mesh);
      });
      
      // Dispose lights
      lightsRef.current.forEach(light => {
        scene.remove(light);
      });
      
      renderer.dispose();
    };
  }, [performanceSettings]);

  // Simple performance settings based on device capabilities
  const getSimplePerformanceSettings = (): PerformanceSettings => {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const hasHighDPI = window.devicePixelRatio > 1.5;
    const isProduction = import.meta.env.PROD;
    
    // More conservative settings for production
    if (isProduction) {
      if (isMobile || isLowEnd) {
        return {
          particleCount: 300,
          geometryCount: 2,
          enableLighting: false,
          enablePostProcessing: false,
          maxFPS: 24,
        };
      } else {
        return {
          particleCount: 600,
          geometryCount: 3,
          enableLighting: false,
          enablePostProcessing: false,
          maxFPS: 30,
        };
      }
    }
    
    // Development settings (more permissive)
    if (isMobile || isLowEnd) {
      return {
        particleCount: 500,
        geometryCount: 3,
        enableLighting: false,
        enablePostProcessing: false,
        maxFPS: 30,
      };
    } else if (hasHighDPI) {
      return {
        particleCount: 1200,
        geometryCount: 6,
        enableLighting: true,
        enablePostProcessing: true,
        maxFPS: 60,
      };
    } else {
      return {
        particleCount: 1000,
        geometryCount: 5,
        enableLighting: true,
        enablePostProcessing: false,
        maxFPS: 60,
      };
    }
  };

  const createParticleSystem = (scene: THREE.Scene, settings: PerformanceSettings) => {
    const positions = new Float32Array(settings.particleCount * 3);
    const colors = new Float32Array(settings.particleCount * 3);
    const sizes = new Float32Array(settings.particleCount);

    // Create particles with random positions and colors
    for (let i = 0; i < settings.particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a larger sphere
      const radius = 25 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Enhanced color palette with more variety
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Purple tones
        colors[i3] = 0.5 + Math.random() * 0.5;     // R
        colors[i3 + 1] = 0.1 + Math.random() * 0.4; // G
        colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
      } else if (colorChoice < 0.66) {
        // Blue tones
        colors[i3] = 0.1 + Math.random() * 0.3;     // R
        colors[i3 + 1] = 0.3 + Math.random() * 0.5; // G
        colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
      } else {
        // Cyan/teal tones
        colors[i3] = 0.1 + Math.random() * 0.2;     // R
        colors[i3 + 1] = 0.6 + Math.random() * 0.4; // G
        colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B
      }
      
      // Variable particle sizes
      sizes[i] = Math.random() * 3 + 1;
    }

    // Create geometry and material
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    // Create particle system
    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);
  };

  const createFloatingGeometry = (scene: THREE.Scene, settings: PerformanceSettings) => {
    const geometries: THREE.Mesh[] = [];
    
    for (let i = 0; i < settings.geometryCount; i++) {
      let geometry: THREE.BufferGeometry;
      
      // Create different geometric shapes
      const shapeType = Math.floor(Math.random() * 4);
      switch (shapeType) {
        case 0:
          geometry = new THREE.SphereGeometry(0.5 + Math.random() * 1, 16, 16);
          break;
        case 1:
          geometry = new THREE.BoxGeometry(1 + Math.random(), 1 + Math.random(), 1 + Math.random());
          break;
        case 2:
          geometry = new THREE.OctahedronGeometry(0.8 + Math.random() * 0.7);
          break;
        default:
          geometry = new THREE.TetrahedronGeometry(0.8 + Math.random() * 0.7);
      }
      
      // Create material with color-shifting properties
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.7 + Math.random() * 0.3, 0.8, 0.6),
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
        shininess: 100,
        emissive: new THREE.Color().setHSL(0.7 + Math.random() * 0.3, 0.5, 0.1),
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Store initial position for animation
      mesh.userData = {
        initialPosition: mesh.position.clone(),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.5 + 0.2,
        floatRange: Math.random() * 3 + 1,
      };
      
      geometries.push(mesh);
      scene.add(mesh);
    }
    
    geometriesRef.current = geometries;
  };

  const createLightingSystem = (scene: THREE.Scene) => {
    const lights: THREE.Light[] = [];
    
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    lights.push(ambientLight);
    scene.add(ambientLight);
    
    // Directional light for main lighting
    const directionalLight = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    lights.push(directionalLight);
    scene.add(directionalLight);
    
    // Point lights for color accents
    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.6, 20);
    pointLight1.position.set(-10, 5, 10);
    lights.push(pointLight1);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.4, 15);
    pointLight2.position.set(10, -5, -10);
    lights.push(pointLight2);
    scene.add(pointLight2);
    
    lightsRef.current = lights;
  };

  const updateParticleColors = (elapsedTime: number) => {
    if (!particlesRef.current) return;
    
    const colors = particlesRef.current.geometry.attributes.color;
    const colorArray = colors.array as Float32Array;
    
    for (let i = 0; i < colorArray.length; i += 3) {
      const hue = (elapsedTime * 0.1 + i * 0.01) % 1;
      const color = new THREE.Color().setHSL(0.6 + hue * 0.4, 0.8, 0.6);
      
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }
    
    colors.needsUpdate = true;
  };

  const animateGeometry = (elapsedTime: number) => {
    geometriesRef.current.forEach((mesh, index) => {
      const userData = mesh.userData;
      
      // Rotation animation
      mesh.rotation.x += userData.rotationSpeed.x;
      mesh.rotation.y += userData.rotationSpeed.y;
      mesh.rotation.z += userData.rotationSpeed.z;
      
      // Floating animation
      const floatOffset = Math.sin(elapsedTime * userData.floatSpeed + index) * userData.floatRange;
      mesh.position.y = userData.initialPosition.y + floatOffset;
      
      // Subtle position drift
      mesh.position.x = userData.initialPosition.x + Math.sin(elapsedTime * 0.3 + index) * 2;
      mesh.position.z = userData.initialPosition.z + Math.cos(elapsedTime * 0.2 + index) * 2;
      
      // Color shifting for emissive material
      const material = mesh.material as THREE.MeshPhongMaterial;
      const hue = (elapsedTime * 0.2 + index * 0.1) % 1;
      material.emissive.setHSL(0.6 + hue * 0.4, 0.5, 0.1);
    });
  };

  const animateCamera = (elapsedTime: number) => {
    if (!cameraRef.current) return;
    
    const camera = cameraRef.current;
    
    // Smooth orbital movement
    const radius = 15;
    const speed = 0.1;
    
    camera.position.x = Math.sin(elapsedTime * speed) * radius * 0.3;
    camera.position.y = Math.cos(elapsedTime * speed * 0.7) * radius * 0.2;
    camera.position.z = 15 + Math.sin(elapsedTime * speed * 0.5) * 3;
    
    // Look at center with slight offset
    const lookAtTarget = new THREE.Vector3(
      Math.sin(elapsedTime * 0.05) * 2,
      Math.cos(elapsedTime * 0.03) * 1,
      0
    );
    camera.lookAt(lookAtTarget);
  };

  const updateLighting = (elapsedTime: number) => {
    if (lightsRef.current.length < 3) return;
    
    // Animate point lights
    const pointLight1 = lightsRef.current[2] as THREE.PointLight;
    const pointLight2 = lightsRef.current[3] as THREE.PointLight;
    
    // Orbital movement for point lights
    pointLight1.position.x = Math.sin(elapsedTime * 0.3) * 15;
    pointLight1.position.z = Math.cos(elapsedTime * 0.3) * 15;
    
    pointLight2.position.x = Math.cos(elapsedTime * 0.2) * 12;
    pointLight2.position.y = Math.sin(elapsedTime * 0.4) * 8;
    
    // Color shifting for lights
    const hue1 = (elapsedTime * 0.1) % 1;
    const hue2 = (elapsedTime * 0.15 + 0.5) % 1;
    
    pointLight1.color.setHSL(0.6 + hue1 * 0.4, 0.8, 0.6);
    pointLight2.color.setHSL(0.6 + hue2 * 0.4, 0.8, 0.6);
  };

  // Show loading state while checking WebGL support and performance settings
  if (webglSupported === null || performanceSettings === null) {
    return (
      <div className={`fixed inset-0 bg-gray-900 -z-10 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
      </div>
    );
  }

  // Show fallback if WebGL is not supported or if we're in production with low performance
  if (!webglSupported) {
    return <WebGLFallback />;
  }

  // Always use static background in production for maximum performance
  if (import.meta.env.PROD) {
    return <StaticBackground className={className} />;
  }

  // Use static background for mobile devices even in development
  if (window.innerWidth < 768) {
    return <StaticBackground className={className} />;
  }

  return (
    <div 
      ref={mountRef} 
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};