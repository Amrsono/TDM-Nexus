import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  activePhase: string;
  onPhaseSelect: (phaseId: string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ activePhase, onPhaseSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onPhaseSelectRef = useRef(onPhaseSelect);

  // Keep callback ref fresh to avoid re-triggering effect
  useEffect(() => {
    onPhaseSelectRef.current = onPhaseSelect;
  }, [onPhaseSelect]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b19, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 18, 25);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xbd00ff, 2, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 4. Central Core Mesh
    const coreGeometry = new THREE.IcosahedronGeometry(3, 1);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f2fe,
      emissive: 0x071530,
      wireframe: true,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Glowing core glow shield
    const shieldGeom = new THREE.SphereGeometry(3.2, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
    scene.add(shieldMesh);

    // 5. Phase Nodes configurations
    const phases = [
      { id: 'initiation', name: 'Initiation & BC', angle: 0, radius: 10, color: 0x00f5a0 },
      { id: 'analysis', name: 'Analysis & Design', angle: (Math.PI * 2) / 7, radius: 10, color: 0x00f2fe },
      { id: 'build', name: 'Build & Delivery', angle: ((Math.PI * 2) / 7) * 2, radius: 10, color: 0xbd00ff },
      { id: 'finances', name: 'Finances & Budget', angle: ((Math.PI * 2) / 7) * 3, radius: 10, color: 0xf59e0b },
      { id: 'testing', name: 'QA & Testing', angle: ((Math.PI * 2) / 7) * 4, radius: 10, color: 0xf43f5e },
      { id: 'governance', name: 'Governance', angle: ((Math.PI * 2) / 7) * 5, radius: 10, color: 0x60a5fa },
      { id: 'closure', name: 'Closure & Hypercare', angle: ((Math.PI * 2) / 7) * 6, radius: 10, color: 0xa855f7 },
    ];

    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeObjects: any[] = [];

    phases.forEach((p) => {
      // Calculate coordinates
      const x = Math.cos(p.angle) * p.radius;
      const z = Math.sin(p.angle) * p.radius;

      // Group container for each node system
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, 0, z);

      // Sphere node mesh
      const sphereGeom = new THREE.SphereGeometry(0.9, 16, 16);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.5,
        shininess: 100,
      });
      const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
      // Attach metadata for raycasting
      sphereMesh.userData = { phaseId: p.id, name: p.name, baseColor: p.color };
      nodeGroup.add(sphereMesh);
      nodeMeshes.push(sphereMesh);

      // Torus ring around node for design aesthetics
      const ringGeom = new THREE.TorusGeometry(1.3, 0.05, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: p.color,
        transparent: true,
        opacity: 0.4,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);

      nodesGroup.add(nodeGroup);
      nodeObjects.push({ group: nodeGroup, data: p, ring: ringMesh, sphere: sphereMesh });
    });

    // 6. Orbital Connectors (glowing ring)
    const orbitGeom = new THREE.RingGeometry(9.9, 10.1, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const orbitMesh = new THREE.Mesh(orbitGeom, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2;
    scene.add(orbitMesh);

    // 7. Particle System (Stars / Data Packets)
    const particleCount = 250;
    const particlesGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Outer sphere distribution
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = THREE.MathUtils.randFloat(8, 40);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4; // flatten slightly
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Random cyan/purple color mix
      const isCyan = Math.random() > 0.5;
      colors[i * 3] = isCyan ? 0.0 : 0.74; // R
      colors[i * 3 + 1] = isCyan ? 0.95 : 0.0; // G
      colors[i * 3 + 2] = isCyan ? 1.0 : 1.0; // B
    }

    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture (using a soft circle generated on canvas)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.6,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const particleSystem = new THREE.Points(particlesGeom, particlesMaterial);
    scene.add(particleSystem);

    // 8. Animation & Camera Controls
    let targetCameraPos = new THREE.Vector3(0, 18, 25);
    let targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const updateCameraFocus = (phaseId: string) => {
      const activeObj = nodeObjects.find((o) => o.data.id === phaseId);
      if (activeObj) {
        // Position camera to look directly at the selected node from a nice angle
        const nodePos = new THREE.Vector3();
        activeObj.group.getWorldPosition(nodePos);

        // Position camera offset relative to the node
        targetCameraPos.copy(nodePos).add(new THREE.Vector3(0, 4, 8));
        targetLookAt.copy(nodePos);
      } else {
        // Reset to default overview
        targetCameraPos.set(0, 18, 25);
        targetLookAt.set(0, 0, 0);
      }
    };

    // Initialize camera position based on initial active phase
    updateCameraFocus(activePhase);

    // 9. Raycasting Interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let hoveredNode: THREE.Mesh | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        if (hoveredNode !== mesh) {
          if (hoveredNode) {
            // Restore previous
            const baseColor = hoveredNode.userData.baseColor;
            (hoveredNode.material as THREE.MeshPhongMaterial).color.setHex(baseColor);
            (hoveredNode.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.5;
            hoveredNode.scale.set(1, 1, 1);
          }
          hoveredNode = mesh;
          // Highlight hovered
          (mesh.material as THREE.MeshPhongMaterial).color.setHex(0xffffff);
          (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.9;
          mesh.scale.set(1.3, 1.3, 1.3);
          document.body.style.cursor = 'pointer';
        }
      } else {
        if (hoveredNode) {
          const baseColor = hoveredNode.userData.baseColor;
          (hoveredNode.material as THREE.MeshPhongMaterial).color.setHex(baseColor);
          (hoveredNode.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.5;
          hoveredNode.scale.set(1, 1, 1);
          hoveredNode = null;
          document.body.style.cursor = 'default';
        }
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        const phaseId = mesh.userData.phaseId;
        onPhaseSelectRef.current(phaseId);
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Watch for activePhase changes to update target camera position
    const intervalId = setInterval(() => {
      // Use internal tracking to align with React prop changes
      // React state triggers a re-render of this component, but since we have a single canvas,
      // we can listen to activePhase via ref or triggers. We handle prop-sync below in a separate watch.
    }, 100);

    // 10. Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 11. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate core slowly
      coreMesh.rotation.y = elapsedTime * 0.15;
      coreMesh.rotation.x = elapsedTime * 0.08;
      shieldMesh.rotation.y = -elapsedTime * 0.05;

      // Rotate nodes rings slightly
      nodeObjects.forEach((obj, idx) => {
        obj.ring.rotation.z = elapsedTime * 0.4 + idx;
        
        // Bounce nodes gently
        const bounce = Math.sin(elapsedTime * 1.5 + idx * 0.5) * 0.05;
        obj.group.position.y = bounce;

        // Pulse the active node ring size
        if (obj.data.id === activePhase) {
          const pulse = 1.3 + Math.sin(elapsedTime * 5) * 0.15;
          obj.ring.scale.set(pulse, pulse, pulse);
          (obj.sphere.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.8 + Math.sin(elapsedTime * 5) * 0.2;
        } else {
          obj.ring.scale.set(1, 1, 1);
          if (hoveredNode !== obj.sphere) {
            (obj.sphere.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.5;
          }
        }
      });

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.02;

      // Smooth camera movement (Lerp)
      camera.position.lerp(targetCameraPos, 0.05);
      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // Store references on container to react to updates
    (containerRef.current as any)._updateCamera = updateCameraFocus;

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && containerRef.current) {
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('click', handleClick);
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Sync React prop changes to Three.js camera position
  useEffect(() => {
    if (containerRef.current && (containerRef.current as any)._updateCamera) {
      (containerRef.current as any)._updateCamera(activePhase);
    }
  }, [activePhase]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />;
};
