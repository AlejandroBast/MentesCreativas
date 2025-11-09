import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Robot3D() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const meshRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<Record<string, THREE.Mesh>>({});
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationHandle = useRef<number | null>(null);

  // simple state for waving animation
  const [isWaving, setIsWaving] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setClearColor(0xf8fafc, 1);
    stage.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(3, 2.5, 3);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    // Grid
    scene.add(new THREE.GridHelper(6, 12, 0xcccccc, 0xeeeeee));

    // Build simple robot parts and keep references
    const robot = new THREE.Group();

    const mk = (geom: THREE.BufferGeometry, color: number, name: string, y: number, x = 0) => {
      const m = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color }));
      m.position.set(x, y, 0);
      m.name = name;
      partsRef.current[name] = m;
      robot.add(m);
    };

    mk(new THREE.BoxGeometry(1.2, 1.2, 0.6), 0x6b7280, "body", 1.0);
    mk(new THREE.BoxGeometry(0.6, 0.6, 0.5), 0x9ca3af, "head", 1.9);
    mk(new THREE.BoxGeometry(0.25, 0.9, 0.25), 0x4b5563, "leftArm", 1.05, -0.95);
    mk(new THREE.BoxGeometry(0.25, 0.9, 0.25), 0x4b5563, "rightArm", 1.05, 0.95);
    mk(new THREE.BoxGeometry(0.3, 0.9, 0.3), 0x374151, "leftLeg", 0.35, -0.3);
    mk(new THREE.BoxGeometry(0.3, 0.9, 0.3), 0x374151, "rightLeg", 0.35, 0.3);

    robot.position.y = 0;
    meshRef.current = robot;
    scene.add(robot);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.target.set(0, 1.0, 0);
    controls.update();

    // Raycaster for selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let highlighted: THREE.Mesh | null = null;

    const highlight = (mesh: THREE.Mesh | null) => {
      // restore previous
      if (highlighted && highlighted !== mesh) {
        (highlighted.material as THREE.Material).opacity = 1;
        (highlighted.material as THREE.Material).transparent = false;
      }
      if (mesh) {
        (mesh.material as THREE.MeshStandardMaterial).transparent = true;
        (mesh.material as THREE.MeshStandardMaterial).opacity = 0.7;
      }
      highlighted = mesh;
    };

    const onPointerMove = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(robot.children, false);
      if (hits.length > 0) {
        const m = hits[0].object as THREE.Mesh;
        highlight(m);
        // dispatch name so UI can show it
        window.dispatchEvent(new CustomEvent("robot3d-piece-selected", { detail: { name: m.name } }));
      } else {
        highlight(null);
        window.dispatchEvent(new CustomEvent("robot3d-piece-selected", { detail: { name: null } }));
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);

    // Simple waving animation (rightArm)
    let t = 0;
    const waveStep = () => {
      const rightArm = partsRef.current["rightArm"];
      if (rightArm) {
        // very basic oscillation
        rightArm.rotation.z = Math.sin(t) * 0.6;
      }
    };

    // Event handlers
    const onSetView = (ev: CustomEvent) => {
      const name = ev.detail as string;
      if (!cameraRef.current) return;
      const cam = cameraRef.current;
      if (name === "front") cam.position.set(0, 1.5, 4);
      else if (name === "side") cam.position.set(4, 1.2, 0);
      else if (name === "top") cam.position.set(0, 6, 0.01);
      else if (name === "perspective") cam.position.set(3, 2.5, 3);
      else if (name === "reset") {
        cam.position.set(3, 2.5, 3);
        // reset robot pose
        Object.values(partsRef.current).forEach((p) => p.rotation.set(0, 0, 0));
      }
      cam.lookAt(0, 0.8, 0);
      controls.update();
    };

    const onWaveToggle = () => setIsWaving((v) => !v);
    const onSpeed = (ev: CustomEvent) => setSpeed(Number(ev.detail ?? 1));
    const onPose = (ev: CustomEvent) => {
      const data = ev.detail as any;
      const pose = data?.pose as string;
      // applying pose interrupts waving
      setIsWaving(false);
      const left = partsRef.current["leftArm"];
      const right = partsRef.current["rightArm"];
      const head = partsRef.current["head"];
      if (!left || !right || !head) return;
      if (pose === "arms-up") {
        left.rotation.z = Math.PI / 2.2;
        right.rotation.z = -Math.PI / 2.2;
      } else if (pose === "arms-down") {
        left.rotation.z = 0;
        right.rotation.z = 0;
      } else if (pose === "head-left") {
        head.rotation.y = Math.PI / 6;
      } else if (pose === "head-right") {
        head.rotation.y = -Math.PI / 6;
      } else if (pose === "reset") {
        Object.values(partsRef.current).forEach((p) => p.rotation.set(0, 0, 0));
      }
    };

    window.addEventListener("robot3d-setview", onSetView as EventListener);
    window.addEventListener("robot3d-wave", onWaveToggle as EventListener);
    window.addEventListener("robot3d-speed", onSpeed as EventListener);
    window.addEventListener("robot3d-pose", onPose as EventListener);

    // Animation loop
    let running = true;
    const animate = () => {
      if (!running) return;
      controls.update();
      if (isWaving) {
        t += 0.04 * speed; // speed affects increment
        waveStep();
      }
      renderer.render(scene, camera);
      animationHandle.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);

    // cleanup
    return () => {
      running = false;
      if (animationHandle.current) cancelAnimationFrame(animationHandle.current);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("robot3d-setview", onSetView as EventListener);
      window.removeEventListener("robot3d-wave", onWaveToggle as EventListener);
      window.removeEventListener("robot3d-speed", onSpeed as EventListener);
      window.removeEventListener("robot3d-pose", onPose as EventListener);
      if (meshRef.current) {
        meshRef.current.traverse((c: any) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) {
            const mat = c.material as THREE.Material;
            if ((mat as any).dispose) (mat as any).dispose();
          }
        });
      }
      controls.dispose();
      renderer.dispose();
      ro.disconnect();
      try { stage.removeChild(renderer.domElement); } catch {}
    };
  }, [isWaving, speed]);

  return <div ref={stageRef} className="w-full h-[520px] border bg-white" aria-label="Visor Robot 3D" />;
}
