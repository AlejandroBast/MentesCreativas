import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Robot3D() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const meshRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

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
    sceneRef.current = scene;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    // Floor reference
    const grid = new THREE.GridHelper(6, 12, 0xcccccc, 0xeeeeee);
    scene.add(grid);

    // Simple robot built from primitives
    const robot = new THREE.Group();
    // body
    const bodyGeom = new THREE.BoxGeometry(1.2, 1.2, 0.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x6b7280 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 1.0;
    robot.add(body);
    // head
    const headGeom = new THREE.BoxGeometry(0.6, 0.6, 0.5);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.set(0, 1.9, 0);
    robot.add(head);
    // left arm
    const armGeom = new THREE.BoxGeometry(0.25, 0.9, 0.25);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x4b5563 });
    const leftArm = new THREE.Mesh(armGeom, armMat);
    leftArm.position.set(-0.95, 1.05, 0);
    robot.add(leftArm);
    // right arm
    const rightArm = leftArm.clone();
    rightArm.position.x = 0.95;
    robot.add(rightArm);
    // legs
    const legGeom = new THREE.BoxGeometry(0.3, 0.9, 0.3);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
    const leftLeg = new THREE.Mesh(legGeom, legMat);
    leftLeg.position.set(-0.3, 0.35, 0);
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.3;
    robot.add(leftLeg);
    robot.add(rightLeg);

    robot.position.y = 0;
    meshRef.current = robot;
    scene.add(robot);

    // Controls: rotate, pan, zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.target.set(0, 1.0, 0);
    controls.update();

    // Predefined views handler
    const onSetView = (ev: CustomEvent) => {
      const name = ev.detail as string;
      if (!cameraRef.current) return;
      const cam = cameraRef.current;
      if (name === "front") {
        cam.position.set(0, 1.5, 4);
      } else if (name === "side") {
        cam.position.set(4, 1.2, 0);
      } else if (name === "top") {
        cam.position.set(0, 6, 0.01);
      } else if (name === "perspective") {
        cam.position.set(3, 2.5, 3);
      }
      cam.lookAt(0, 0.8, 0);
      controls.update();
    };
    window.addEventListener("robot3d-setview", onSetView as EventListener);

    // Animation loop
    let running = true;
    const animate = () => {
      if (!running) return;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const onResize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);

    // Cleanup
    return () => {
      running = false;
      if (meshRef.current) {
        meshRef.current.traverse((c: any) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
      }
      controls.dispose();
      window.removeEventListener("robot3d-setview", onSetView as EventListener);
      renderer.dispose();
      ro.disconnect();
      stage.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={stageRef} className="w-full h-[520px] border bg-white" aria-label="Visor Robot 3D" />
  );
}
