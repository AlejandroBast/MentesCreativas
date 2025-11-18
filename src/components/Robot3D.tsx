import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

type MovementDir = "forward" | "back" | "left" | "right";
type PoseName = "arms-up" | "arms-down" | "head-left" | "head-right" | "reset";

type MovementState = Record<MovementDir, number>;
type WalkPattern = "circle" | "figure8";

type AccessoryAnim = {
  group: THREE.Object3D;
  baseScale: THREE.Vector3;
  current: number;
  target: number;
};

type Projectile = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  ttl: number;
  alive: boolean;
  spin: number;
};

const WALK_SWING = 0.65;
const ROBOT_BASE_HEIGHT = 1.05;

export default function Robot3D() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<Record<string, THREE.Object3D>>({});
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationHandle = useRef<number | null>(null);
  const moveBounds = useRef<{ x: [number, number]; z: [number, number] }>({ x: [-3, 3], z: [-3, 3] });
  const moveStep = useRef(0.25);
  const movementRef = useRef<MovementState>({ forward: 0, back: 0, left: 0, right: 0 });
  const velocityRef = useRef(new THREE.Vector3());
  const rotationTargets = useRef<Record<string, THREE.Euler>>({});
  const saluteState = useRef({ active: false, elapsed: 0, duration: 2.2 });
  const waveState = useRef({ active: false, phase: 0 });
  const walkState = useRef({ phase: 0 });
  const autoWalkRef = useRef<{ active: boolean; angle: number; speed: number; magnitude: number; pattern: WalkPattern }>({
    active: false,
    angle: 0,
    speed: 0.5,
    magnitude: 0.4,
    pattern: "figure8",
  });
  const accessoryStateRef = useRef<Record<string, AccessoryAnim>>({});
  const projectileGroupRef = useRef<THREE.Group | null>(null);
  const projectilesRef = useRef<Projectile[]>([]);
  const gameRef = useRef({ active: false, score: 0, spawnTimer: 1.2, interval: 1.4 });
  const lifeRef = useRef({ value: 5, max: 5 });
  const gamepadIdx = useRef<number | null>(null);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);
  const blinkRef = useRef({ timer: 0, next: 2.5, phase: 0, active: false });
  const composerRef = useRef<EffectComposer | null>(null);
  const outlinePassRef = useRef<OutlinePass | null>(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    const getClear = () => (document.documentElement.classList.contains("dark") ? 0x030712 : 0xf8fafc);
    renderer.setClearColor(getClear(), 1);
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f172a, 18, 40);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = new RoomEnvironment();
    const envTex = pmrem.fromScene(env).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(48, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(3.5, 2.4, 3.4);
    camera.lookAt(0, 2.1, 0);
    cameraRef.current = camera;

    const hemi = new THREE.HemisphereLight(0xc7d2fe, 0x0f172a, 0.5);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(5, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    scene.add(keyLight);
    const rimLight = new THREE.SpotLight(0x60a5fa, 0.6, 15, Math.PI / 5);
    rimLight.position.set(-4, 5, -4);
    rimLight.target.position.set(0, 1, 0);
    rimLight.castShadow = true;
    scene.add(rimLight);
    scene.add(rimLight.target);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const grid = new THREE.PolarGridHelper(5.5, 16, 6, 64, 0x1e293b, 0x94a3b8);
    grid.position.y = 0.002;
    scene.add(grid);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 2.0, 0);
    controls.update();

    partsRef.current = {};
    rotationTargets.current = {};
    const { robot, palette } = buildRobot(partsRef.current, rotationTargets.current);
    robot.castShadow = true;
    robot.position.y = ROBOT_BASE_HEIGHT;
    robotRef.current = robot;
    scene.add(robot);
    accessoryStateRef.current = buildAccessories(robot, partsRef.current, palette);

    const projectileGroup = new THREE.Group();
    projectileGroup.name = "projectiles";
    scene.add(projectileGroup);
    projectileGroupRef.current = projectileGroup;
    projectilesRef.current = [];

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const projectileRaycaster = new THREE.Raycaster();
    let highlighted: THREE.Mesh | null = null;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), scene, camera);
    outlinePass.edgeStrength = 2.5;
    outlinePass.edgeGlow = 0.7;
    outlinePass.visibleEdgeColor.set(0x38bdf8);
    outlinePass.hiddenEdgeColor.set(0x0ea5e9);
    composer.addPass(outlinePass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), 0.6, 0.2, 0.85);
    composer.addPass(bloomPass);
    composerRef.current = composer;
    outlinePassRef.current = outlinePass;

    const restoreMaterial = (mesh: THREE.Mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mesh.userData.baseEmissive instanceof THREE.Color) {
        mat.emissive.copy(mesh.userData.baseEmissive);
      }
      if (typeof mesh.userData.baseEmissiveIntensity === "number") {
        mat.emissiveIntensity = mesh.userData.baseEmissiveIntensity;
      }
      mat.opacity = mesh.userData.baseOpacity ?? 1;
      mat.transparent = mesh.userData.baseOpacity !== undefined ? mesh.userData.baseOpacity < 1 : mat.transparent;
    };

    const highlight = (mesh: THREE.Mesh | null) => {
      if (highlighted && highlighted !== mesh) restoreMaterial(highlighted);
      if (mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mesh.userData.baseEmissive) {
          mesh.userData.baseEmissive = mat.emissive.clone();
          mesh.userData.baseEmissiveIntensity = mat.emissiveIntensity;
          mesh.userData.baseOpacity = mat.opacity;
        }
        mat.emissive.setHex(0x38bdf8);
        mat.emissiveIntensity = 0.9;
        mat.opacity = 1;
        mat.transparent = false;
      }
      highlighted = mesh;
      if (outlinePassRef.current) outlinePassRef.current.selectedObjects = mesh ? [mesh] : [];
    };

    const onPointerMove = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(robot.children, true);
      if (hits.length > 0) {
        const hitMesh = hits.find((h) => h.object instanceof THREE.Mesh)?.object as THREE.Mesh | undefined;
        if (hitMesh) {
          highlight(hitMesh);
          window.dispatchEvent(new CustomEvent("robot3d-piece-selected", { detail: { name: hitMesh.name || hitMesh.parent?.name } }));
          return;
        }
      }
      highlight(null);
      window.dispatchEvent(new CustomEvent("robot3d-piece-selected", { detail: { name: null } }));
    };
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    const onPointerDown = (ev: PointerEvent) => {
      if (!gameRef.current.active || !projectileGroupRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      projectileRaycaster.setFromCamera(pointer, camera);
      const hits = projectileRaycaster.intersectObjects(projectileGroupRef.current.children, true);
      if (hits.length === 0) return;
      const hit = hits.find((h) => h.object instanceof THREE.Mesh);
      if (!hit) return;
      const proj = projectilesRef.current.find((p) => p.mesh === hit.object);
      if (proj) {
        destroyProjectile(proj, true);
        projectilesRef.current = projectilesRef.current.filter((p) => p.alive);
      }
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    const updateRotationTarget = (name: string, euler?: THREE.Euler) => {
      if (euler) rotationTargets.current[name] = euler;
      else delete rotationTargets.current[name];
    };

    const applyPose = (pose: PoseName) => {
      if (pose === "reset") {
        rotationTargets.current = {};
        Object.entries(partsRef.current).forEach(([name, obj]) => {
          if (name.endsWith("Pivot")) obj.rotation.set(0, 0, 0);
        });
        waveState.current.active = false;
        saluteState.current.active = false;
        return;
      }
      if (pose === "arms-up") {
        updateRotationTarget("leftArmPivot", new THREE.Euler(-Math.PI / 1.8, 0, 0));
        updateRotationTarget("rightArmPivot", new THREE.Euler(-Math.PI / 1.8, 0, 0));
      } else if (pose === "arms-down") {
        updateRotationTarget("leftArmPivot");
        updateRotationTarget("rightArmPivot");
      } else if (pose === "head-left") {
        updateRotationTarget("headPivot", new THREE.Euler(0, Math.PI / 6, 0));
      } else if (pose === "head-right") {
        updateRotationTarget("headPivot", new THREE.Euler(0, -Math.PI / 6, 0));
      }
    };

    const triggerSalute = () => {
      saluteState.current.active = true;
      saluteState.current.elapsed = 0;
      waveState.current.active = false;
    };

    const toggleWave = () => {
      waveState.current.active = !waveState.current.active;
      if (!waveState.current.active && partsRef.current.rightForearmPivot) {
        partsRef.current.rightForearmPivot.rotation.set(0, 0, 0);
      }
    };

    const translateRobot = (dir: MovementDir) => {
      if (!robotRef.current) return;
      const dirVec = new THREE.Vector3();
      const step = moveStep.current * speedRef.current;
      if (dir === "forward") dirVec.set(0, 0, -step);
      if (dir === "back") dirVec.set(0, 0, step);
      if (dir === "left") dirVec.set(-step, 0, 0);
      if (dir === "right") dirVec.set(step, 0, 0);
      robotRef.current.position.add(dirVec);
      clampToBounds();
    };

    const setMovementState = (dir: MovementDir, active: boolean) => {
      movementRef.current[dir] = active ? 1 : 0;
      if (active) autoWalkRef.current.active = false;
    };

    const clampToBounds = () => {
      if (!robotRef.current) return;
      const b = moveBounds.current;
      robotRef.current.position.x = Math.max(b.x[0], Math.min(b.x[1], robotRef.current.position.x));
      robotRef.current.position.z = Math.max(b.z[0], Math.min(b.z[1], robotRef.current.position.z));
    };

    const dispatchScore = () => {
      window.dispatchEvent(new CustomEvent("robot3d-game-score", { detail: { score: gameRef.current.score } }));
    };

    const dispatchLife = () => {
      window.dispatchEvent(
        new CustomEvent("robot3d-life", { detail: { value: lifeRef.current.value, max: lifeRef.current.max } })
      );
    };

    const destroyProjectile = (projectile: Projectile, award = false, damage = false) => {
      if (!projectile.alive) return;
      projectile.alive = false;
      projectileGroupRef.current?.remove(projectile.mesh);
      if (projectile.mesh.geometry) projectile.mesh.geometry.dispose();
      const mat = projectile.mesh.material as THREE.Material;
      if ((mat as any)?.dispose) (mat as any).dispose();
      if (award) {
        gameRef.current.score += 1;
        dispatchScore();
      }
      if (damage) {
        lifeRef.current.value = Math.max(0, lifeRef.current.value - 1);
        dispatchLife();
        if (lifeRef.current.value <= 0) {
          handleGameOver();
        }
      }
    };

    const clearProjectiles = () => {
      projectilesRef.current.forEach((p) => destroyProjectile(p));
      projectilesRef.current = [];
    };

    const handleGameOver = () => {
      if (!gameRef.current.active) return;
      gameRef.current.active = false;
      clearProjectiles();
      window.dispatchEvent(new CustomEvent("robot3d-game-over", { detail: { score: gameRef.current.score } }));
    };

    const spawnProjectile = () => {
      if (!projectileGroupRef.current) return;
      const geometry = new THREE.DodecahedronGeometry(0.22, 0);
      const material = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xffb347,
        emissiveIntensity: 1.3,
        roughness: 0.3,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      const radius = 4.5 + Math.random() * 1.2;
      const angle = Math.random() * Math.PI * 2;
      const height = 1 + Math.random() * 1.5;
      mesh.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      const target = new THREE.Vector3(0, 1 + Math.random() * 0.5, 0);
      const velocity = target.clone().sub(mesh.position).normalize().multiplyScalar(1.4 + Math.random() * 0.8);
      projectileGroupRef.current.add(mesh);
      projectilesRef.current.push({ mesh, velocity, ttl: 6, alive: true, spin: (Math.random() - 0.5) * 4 });
    };

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.repeat) return;
      const key = ev.key.toLowerCase();
      if (key === "arrowup" || key === "w") setMovementState("forward", true);
      else if (key === "arrowdown" || key === "s") setMovementState("back", true);
      else if (key === "arrowleft" || key === "a") setMovementState("left", true);
      else if (key === "arrowright" || key === "d") setMovementState("right", true);
    };

    const onKeyUp = (ev: KeyboardEvent) => {
      const key = ev.key.toLowerCase();
      if (key === "arrowup" || key === "w") setMovementState("forward", false);
      else if (key === "arrowdown" || key === "s") setMovementState("back", false);
      else if (key === "arrowleft" || key === "a") setMovementState("left", false);
      else if (key === "arrowright" || key === "d") setMovementState("right", false);
    };

    const onMoveEvent = (ev: CustomEvent) => {
      const detail = ev.detail as { dir?: MovementDir; state?: "start" | "stop" };
      if (!detail?.dir) return;
      if (detail.state) {
        setMovementState(detail.dir, detail.state === "start");
      } else {
        translateRobot(detail.dir);
      }
    };

    const onSetView = (ev: CustomEvent) => {
      const view = (ev.detail as string) ?? "perspective";
      if (!cameraRef.current) return;
      const cam = cameraRef.current;
      if (view === "front") cam.position.set(0, 1.5, 4.5);
      else if (view === "side") cam.position.set(4.5, 1.2, 0);
      else if (view === "top") cam.position.set(0, 6, 0.01);
      else if (view === "perspective") cam.position.set(3.5, 2.4, 3.4);
      else if (view === "reset") {
        cam.position.set(3.5, 2.4, 3.4);
        applyPose("reset");
      }
      cam.lookAt(0, 2.1, 0);
      controls.update();
    };

    const onPose = (ev: CustomEvent) => {
      const pose = (ev.detail as { pose?: PoseName })?.pose;
      if (!pose) return;
      applyPose(pose);
    };

    const onWave = () => toggleWave();
    const onSpeed = (ev: CustomEvent) => {
      const value = Number(ev.detail ?? 1) || 1;
      setSpeed(Math.max(0.2, Math.min(3, value)));
    };
    const onAction = (ev: CustomEvent) => {
      const action = (ev.detail as { action?: string })?.action;
      if (action === "salute") triggerSalute();
      if (action === "wave:start") waveState.current.active = true;
      if (action === "wave:stop") waveState.current.active = false;
    };

    const onSalute = () => triggerSalute();
    const onAccessory = (ev: CustomEvent) => {
      const detail = ev.detail as { name?: string; enabled?: boolean };
      if (!detail?.name || !(detail.name in accessoryStateRef.current)) return;
      accessoryStateRef.current[detail.name].target = detail.enabled ? 1 : 0;
    };
    const onWalkCommand = (ev: CustomEvent) => {
      const detail = ev.detail as { mode?: "start" | "stop"; pattern?: WalkPattern };
      if (detail?.mode === "start") {
        autoWalkRef.current = {
          ...autoWalkRef.current,
          active: true,
          angle: 0,
          pattern: detail.pattern ?? "figure8",
          speed: detail.pattern === "circle" ? 0.45 : 0.6,
          magnitude: detail.pattern === "circle" ? 0.45 : 0.35,
        };
        movementRef.current = { forward: 0, back: 0, left: 0, right: 0 } as MovementState;
      } else {
        autoWalkRef.current.active = false;
        velocityRef.current.set(0, 0, 0);
      }
    };

    const onGameEvent = (ev: CustomEvent) => {
      const detail = ev.detail as { action?: "start" | "stop" };
      if (detail?.action === "start") {
        gameRef.current.active = true;
        gameRef.current.score = 0;
        gameRef.current.spawnTimer = 0.4;
        clearProjectiles();
        lifeRef.current.value = lifeRef.current.max;
        dispatchScore();
        dispatchLife();
      } else if (detail?.action === "stop") {
        gameRef.current.active = false;
        clearProjectiles();
        dispatchScore();
        dispatchLife();
      }
    };

    const onTheme = () => {
      renderer.setClearColor(getClear(), 1);
      const dark = document.documentElement.classList.contains("dark");
      if (outlinePassRef.current) {
        outlinePassRef.current.visibleEdgeColor.set(dark ? 0x22d3ee : 0x0ea5e9);
        outlinePassRef.current.hiddenEdgeColor.set(dark ? 0x06b6d4 : 0x38bdf8);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("robot3d-move", onMoveEvent as EventListener);
    window.addEventListener("robot3d-setview", onSetView as EventListener);
    window.addEventListener("robot3d-pose", onPose as EventListener);
    window.addEventListener("robot3d-wave", onWave as EventListener);
    window.addEventListener("robot3d-speed", onSpeed as EventListener);
    window.addEventListener("robot3d-action", onAction as EventListener);
    window.addEventListener("robot3d-salute", onSalute as EventListener);
    window.addEventListener("robot3d-accessory", onAccessory as EventListener);
    window.addEventListener("robot3d-walk", onWalkCommand as EventListener);
    window.addEventListener("robot3d-game", onGameEvent as EventListener);
    document.addEventListener("theme:changed", onTheme as EventListener);

    const onGamepadConnected = (ev: GamepadEvent) => {
      if (gamepadIdx.current === null) gamepadIdx.current = ev.gamepad.index;
    };
    const onGamepadDisconnected = (ev: GamepadEvent) => {
      if (gamepadIdx.current === ev.gamepad.index) {
        gamepadIdx.current = null;
        movementRef.current = { forward: 0, back: 0, left: 0, right: 0 } as MovementState;
      }
    };
    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    const pollGamepad = () => {
      if (gamepadIdx.current === null) return;
      const pads = navigator.getGamepads?.();
      if (!pads) return;
      const pad = pads[gamepadIdx.current];
      if (!pad) return;
      const dead = 0.2;
      const [lx, ly] = pad.axes;
      movementRef.current.forward = ly < -dead ? 1 : 0;
      movementRef.current.back = ly > dead ? 1 : 0;
      movementRef.current.left = lx < -dead ? 1 : 0;
      movementRef.current.right = lx > dead ? 1 : 0;
      if (pad.buttons[0]?.pressed) triggerSalute();
      if (pad.buttons[1]?.pressed) waveState.current.active = true;
      if (!pad.buttons[1]?.pressed) waveState.current.active = false;
    };

    const clock = new THREE.Clock();

    const updateMovement = (delta: number) => {
      if (!robotRef.current) return;
      const input = movementRef.current;
      const dir = new THREE.Vector3(input.right - input.left, 0, input.back - input.forward);
      let intensity = 0;
      if (dir.lengthSq() > 0) {
        dir.normalize();
        intensity = 1;
      } else if (autoWalkRef.current.active) {
        autoWalkRef.current.angle += delta * autoWalkRef.current.speed;
        const ang = autoWalkRef.current.angle;
        if (autoWalkRef.current.pattern === "figure8") {
          dir.set(Math.sin(ang), 0, Math.sin(ang * 0.5));
        } else {
          dir.set(Math.sin(ang), 0, Math.cos(ang));
        }
        if (dir.lengthSq() > 0) dir.normalize();
        intensity = autoWalkRef.current.magnitude;
      }
      const accel = 3 * speedRef.current;
      velocityRef.current.x = THREE.MathUtils.damp(velocityRef.current.x, dir.x * accel * intensity, 6, delta);
      velocityRef.current.z = THREE.MathUtils.damp(velocityRef.current.z, dir.z * accel * intensity, 6, delta);
      robotRef.current.position.addScaledVector(velocityRef.current, delta);
      clampToBounds();
    };

    const updateWalkCycle = (delta: number) => {
      const speedMagnitude = velocityRef.current.length();
      const moving = speedMagnitude > 0.05;
      if (!moving) {
        walkState.current.phase = THREE.MathUtils.damp(walkState.current.phase, 0, 5, delta);
      } else {
        walkState.current.phase += delta * (6 + speedMagnitude * 3);
      }
      const swing = moving ? Math.sin(walkState.current.phase) * WALK_SWING : 0;
      const opposite = moving ? Math.sin(walkState.current.phase + Math.PI) * WALK_SWING : 0;
      const legs = [
        { name: "leftLegPivot", value: swing },
        { name: "rightLegPivot", value: opposite },
        { name: "leftArmPivot", value: opposite * 0.6 },
        { name: "rightArmPivot", value: swing * 0.6 },
      ];
      legs.forEach(({ name, value }) => {
        if (rotationTargets.current[name]) return;
        const part = partsRef.current[name];
        if (!part) return;
        part.rotation.x = THREE.MathUtils.damp(part.rotation.x, value, 10, delta);
      });

      if (robotRef.current) {
        const bob = moving ? Math.max(0, Math.sin(walkState.current.phase)) * 0.06 : 0;
        const targetY = ROBOT_BASE_HEIGHT + bob;
        robotRef.current.position.y = THREE.MathUtils.damp(robotRef.current.position.y, targetY, 6, delta);
      }

      const torso = partsRef.current.body as THREE.Mesh | undefined;
      if (torso) {
        const baseY = torso.userData.baseY ?? 1.2;
        const target = baseY + (moving ? Math.sin(walkState.current.phase + Math.PI / 2) * 0.05 : 0);
        torso.position.y = THREE.MathUtils.damp(torso.position.y, target, 8, delta);
      }

      const headPivot = partsRef.current.headPivot;
      if (headPivot && !rotationTargets.current.headPivot) {
        const targetYaw = moving ? Math.sin(walkState.current.phase) * 0.18 : 0;
        headPivot.rotation.y = THREE.MathUtils.damp(headPivot.rotation.y, targetYaw, 6, delta);
      }
    };

    const updateWave = (delta: number) => {
      if (!waveState.current.active) return;
      const rightArm = partsRef.current.rightArmPivot;
      const rightForearm = partsRef.current.rightForearmPivot;
      if (!rightArm || !rightForearm) return;
      waveState.current.phase += delta * 4 * speedRef.current;
      const shoulderTarget = -Math.PI / 2.6;
      rightArm.rotation.x = THREE.MathUtils.damp(rightArm.rotation.x, shoulderTarget, 12, delta);
      rightForearm.rotation.z = Math.sin(waveState.current.phase) * 0.5;
    };

    const updateSalute = (delta: number) => {
      if (!saluteState.current.active) return;
      saluteState.current.elapsed += delta;
      const t = Math.min(1, saluteState.current.elapsed / saluteState.current.duration);
      const easeOut = 1 - (1 - t) * (1 - t);
      const arm = partsRef.current.rightArmPivot;
      const forearm = partsRef.current.rightForearmPivot;
      if (arm && forearm) {
        const target = -Math.PI / 2.4;
        arm.rotation.x = THREE.MathUtils.damp(arm.rotation.x, target * easeOut, 12, delta);
        forearm.rotation.z = THREE.MathUtils.damp(forearm.rotation.z, Math.PI / 2 * easeOut, 12, delta);
      }
      if (t >= 1) saluteState.current.active = false;
    };

    const updatePoses = (delta: number) => {
      Object.entries(rotationTargets.current).forEach(([name, target]) => {
        const part = partsRef.current[name];
        if (!part || !target) return;
        part.rotation.x = THREE.MathUtils.damp(part.rotation.x, target.x, 8, delta);
        part.rotation.y = THREE.MathUtils.damp(part.rotation.y, target.y, 8, delta);
        part.rotation.z = THREE.MathUtils.damp(part.rotation.z, target.z, 8, delta);
      });
    };

    const updateAccessories = (delta: number) => {
      const elapsed = clock.getElapsedTime();
      Object.values(accessoryStateRef.current).forEach((entry) => {
        entry.current = THREE.MathUtils.damp(entry.current, entry.target, 10, delta);
        const s = THREE.MathUtils.clamp(entry.current, 0, 1);
        entry.group.visible = s > 0.02;
        entry.group.scale.set(entry.baseScale.x * s, entry.baseScale.y * s, entry.baseScale.z * s);
        const fxType = entry.group.userData?.fxType as string | undefined;
        if (!fxType || s <= 0) return;
        if (fxType === "wings") {
          const panels = (entry.group.userData.fxPanels as THREE.Object3D[]) || [];
          panels.forEach((panel, idx) => {
            const baseRot = panel.userData?.baseRotationZ ?? 0;
            panel.rotation.z = baseRot + Math.sin(elapsed * 2 + idx) * 0.15 * s;
          });
          const leds = (entry.group.userData.fxLeds as THREE.Mesh[]) || [];
          leds.forEach((led, idx) => {
            const mat = led.material as THREE.MeshStandardMaterial;
            if (!mat) return;
            mat.emissiveIntensity = 1.2 + Math.sin(elapsed * 6 + idx) * 0.6 * s;
          });
          const thrusters = (entry.group.userData.fxThrusters as THREE.Mesh[]) || [];
          thrusters.forEach((flame, idx) => {
            flame.visible = true;
            const mat = flame.material as THREE.MeshStandardMaterial;
            const pulse = 0.8 + Math.sin(elapsed * 9 + idx) * 0.2;
            flame.scale.set(1, pulse * s, 1);
            if (mat) {
              mat.opacity = 0.4 + 0.4 * pulse * s;
              mat.emissiveIntensity = 1.8 + pulse;
            }
          });
        } else if (fxType === "boosters") {
          const flames = (entry.group.userData.fxFlames as THREE.Mesh[]) || [];
          flames.forEach((flame, idx) => {
            const mat = flame.material as THREE.MeshStandardMaterial;
            const base = flame.userData?.baseScale as THREE.Vector3 | undefined;
            const pulse = 0.9 + Math.sin(elapsed * 8 + idx) * 0.2;
            if (base) flame.scale.set(base.x, base.y * pulse * (0.7 + 0.3 * s), base.z);
            if (mat) {
              mat.opacity = 0.35 + 0.45 * s;
              mat.emissiveIntensity = 2 + Math.sin(elapsed * 12 + idx) * 0.5 * s;
            }
          });
          const halos = (entry.group.userData.fxHalos as THREE.Mesh[]) || [];
          halos.forEach((halo, idx) => {
            halo.rotation.z = elapsed * (idx % 2 === 0 ? 0.8 : -0.6);
          });
        } else if (fxType === "shield") {
          const glow = entry.group.userData.fxGlow as THREE.Mesh | undefined;
          const ripple = entry.group.userData.fxRipple as THREE.Mesh | undefined;
          const rings = (entry.group.userData.fxRings as THREE.Mesh[]) || [];
          if (glow) {
            const mat = glow.material as THREE.MeshStandardMaterial;
            if (mat) mat.opacity = 0.15 + 0.25 * s;
          }
          if (ripple) {
            const mat = ripple.material as THREE.MeshStandardMaterial;
            const rippleScale = 1 + Math.sin(elapsed * 3) * 0.08 * s;
            ripple.scale.setScalar(rippleScale);
            if (mat) mat.opacity = 0.2 + 0.25 * (1 - rippleScale + s * 0.2);
          }
          rings.forEach((ring, idx) => {
            ring.rotation.z += delta * (idx % 2 === 0 ? 0.9 : -0.7);
          });
        }
      });
    };

    const updateBlink = (delta: number) => {
      blinkRef.current.timer += delta;
      const eyeL = partsRef.current.eyeLeft as THREE.Mesh | undefined;
      const eyeR = partsRef.current.eyeRight as THREE.Mesh | undefined;
      const chest = partsRef.current.chest as THREE.Mesh | undefined;
      if (!blinkRef.current.active && blinkRef.current.timer >= blinkRef.current.next) {
        blinkRef.current.active = true;
        blinkRef.current.phase = 0;
        blinkRef.current.timer = 0;
        blinkRef.current.next = 2 + Math.random() * 3;
      }
      if (blinkRef.current.active) {
        blinkRef.current.phase += delta * 8;
        const v = 1 - Math.abs(Math.sin(Math.min(blinkRef.current.phase, Math.PI)));
        const s = Math.max(0.2, v);
        if (eyeL && eyeR) {
          eyeL.scale.y = s;
          eyeR.scale.y = s;
        }
        if (blinkRef.current.phase >= Math.PI) {
          blinkRef.current.active = false;
          if (eyeL && eyeR) {
            eyeL.scale.y = 1;
            eyeR.scale.y = 1;
          }
        }
      }
      if (chest) {
        const mat = chest.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.3 + Math.sin(clock.getElapsedTime() * 3) * 0.4;
      }
    };

    const updateProjectiles = (delta: number) => {
      if (!projectileGroupRef.current) return;
      const state = gameRef.current;
      if (!state.active) return;
      state.spawnTimer -= delta;
      if (state.spawnTimer <= 0) {
        spawnProjectile();
        state.spawnTimer = state.interval * (0.7 + Math.random() * 0.8);
      }
      projectilesRef.current = projectilesRef.current.filter((proj) => {
        if (!proj.alive) return false;
        proj.ttl -= delta;
        if (proj.ttl <= 0) {
          destroyProjectile(proj);
          return false;
        }
        proj.mesh.position.addScaledVector(proj.velocity, delta);
        proj.mesh.rotation.x += proj.spin * delta;
        proj.mesh.rotation.y += proj.spin * 0.4 * delta;
        const robotPos = robotRef.current?.position ?? new THREE.Vector3(0, ROBOT_BASE_HEIGHT, 0);
        if (proj.mesh.position.distanceTo(robotPos) < 0.6) {
          destroyProjectile(proj, false, true);
          return false;
        }
        return proj.alive;
      });
    };

    let running = true;
    const animate = () => {
      if (!running) return;
      const delta = clock.getDelta();
      pollGamepad();
      controls.update();
      updateMovement(delta);
      updateWalkCycle(delta);
      updateWave(delta);
      updateSalute(delta);
      updatePoses(delta);
      updateAccessories(delta);
      updateProjectiles(delta);
      updateBlink(delta);
      if (composerRef.current) composerRef.current.render();
      else renderer.render(scene, camera);
      animationHandle.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composerRef.current?.setSize(w, h);
      outlinePassRef.current?.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);

    return () => {
      running = false;
      if (animationHandle.current) cancelAnimationFrame(animationHandle.current);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("robot3d-move", onMoveEvent as EventListener);
      window.removeEventListener("robot3d-setview", onSetView as EventListener);
      window.removeEventListener("robot3d-pose", onPose as EventListener);
      window.removeEventListener("robot3d-wave", onWave as EventListener);
      window.removeEventListener("robot3d-speed", onSpeed as EventListener);
      window.removeEventListener("robot3d-action", onAction as EventListener);
      window.removeEventListener("robot3d-salute", onSalute as EventListener);
      window.removeEventListener("robot3d-accessory", onAccessory as EventListener);
      window.removeEventListener("robot3d-walk", onWalkCommand as EventListener);
      window.removeEventListener("robot3d-game", onGameEvent as EventListener);
      document.removeEventListener("theme:changed", onTheme as EventListener);
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      if (robotRef.current) {
        robotRef.current.traverse((c: any) => {
          if (c.geometry) c.geometry.dispose();
          if (Array.isArray(c.material)) c.material.forEach((m: THREE.Material) => m.dispose());
          else if (c.material) (c.material as THREE.Material).dispose();
        });
      }
      projectilesRef.current.forEach((p) => destroyProjectile(p));
      projectilesRef.current = [];
      projectileGroupRef.current = null;
      controls.dispose();
      renderer.dispose();
      composerRef.current = null;
      outlinePassRef.current = null;
      pmrem.dispose();
      ro.disconnect();
      try {
        stage.removeChild(renderer.domElement);
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="w-full h-[520px] border bg-slate-100 dark:bg-slate-900 transition-colors"
      aria-label="Visor Robot 3D"
    />
  );
}

type MaterialPalette = {
  paint: THREE.MeshPhysicalMaterial;
  darkMetal: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  chrome: THREE.MeshStandardMaterial;
  light: THREE.MeshStandardMaterial;
};

function buildRobot(parts: Record<string, THREE.Object3D>, targets: Record<string, THREE.Euler>) {
  const robot = new THREE.Group();
  const palette: MaterialPalette = {
    paint: new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.5 }),
    accent: new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.3, roughness: 0.35 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9, roughness: 0.15 }),
    light: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x7dd3fc, emissiveIntensity: 1.5, roughness: 0.1 }),
  };

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 0.9), palette.paint.clone());
  torso.name = "body";
  torso.position.y = 1.2;
  torso.userData.baseY = torso.position.y;
  torso.castShadow = true;
  robot.add(torso);
  parts.body = torso;

  const chestPanel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.08), palette.light.clone());
  chestPanel.position.set(0, 0.1, 0.5);
  torso.add(chestPanel);
  parts.chest = chestPanel;

  const headPivot = new THREE.Group();
  headPivot.name = "headPivot";
  headPivot.position.set(0, 2.2, 0);
  robot.add(headPivot);
  parts.headPivot = headPivot;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.75), palette.chrome.clone());
  head.name = "head";
  head.castShadow = true;
  headPivot.add(head);
  parts.head = head;

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.28, 0.05), palette.light.clone());
  visor.position.set(0, 0.1, 0.4);
  head.add(visor);
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), palette.light.clone());
  eyeLeft.position.set(-0.2, 0.08, 0.39);
  head.add(eyeLeft);
  const eyeRight = eyeLeft.clone();
  eyeRight.position.x = 0.2;
  head.add(eyeRight);

  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 14, 32, Math.PI), palette.darkMetal.clone());
  mouth.rotation.x = Math.PI / 2;
  mouth.position.set(0, -0.18, 0.35);
  head.add(mouth);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16), palette.darkMetal.clone());
  antenna.position.set(0, 0.6, 0);
  headPivot.add(antenna);
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), palette.accent.clone());
  antennaTip.position.set(0, 0.95, 0);
  headPivot.add(antennaTip);

  const hip = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 24), palette.darkMetal.clone());
  hip.position.y = 0.65;
  hip.rotation.x = Math.PI / 2;
  robot.add(hip);

  const addJointSphere = (radius = 0.18, material = palette.accent.clone()) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), material);
    sphere.castShadow = true;
    return sphere;
  };

  const buildArm = (side: "left" | "right") => {
    const sign = side === "left" ? -1 : 1;
    const pivot = new THREE.Group();
    pivot.name = `${side}ArmPivot`;
    pivot.position.set(0.9 * sign, 1.65, 0);
    robot.add(pivot);
    parts[`${side}ArmPivot`] = pivot;
    targets[`${side}ArmPivot`] = new THREE.Euler(0, 0, 0);

    const shoulder = addJointSphere();
    pivot.add(shoulder);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.95, 24), palette.paint.clone());
    upperArm.name = `${side}UpperArm`;
    upperArm.position.y = -0.55;
    upperArm.castShadow = true;
    pivot.add(upperArm);

    const forePivot = new THREE.Group();
    forePivot.name = `${side}ForearmPivot`;
    forePivot.position.y = -1.05;
    pivot.add(forePivot);
    parts[`${side}ForearmPivot`] = forePivot;

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.8, 24), palette.paint.clone());
    forearm.name = `${side}Forearm`;
    forearm.position.y = -0.4;
    forearm.castShadow = true;
    forePivot.add(forearm);

    const wrist = addJointSphere(0.14, palette.chrome.clone());
    wrist.position.y = -0.85;
    forePivot.add(wrist);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), palette.darkMetal.clone());
    hand.name = `${side}Hand`;
    hand.position.y = -1.05;
    forePivot.add(hand);
  };

  const buildLeg = (side: "left" | "right") => {
    const sign = side === "left" ? -1 : 1;
    const pivot = new THREE.Group();
    pivot.name = `${side}LegPivot`;
    pivot.position.set(0.4 * sign, 0.9, 0);
    robot.add(pivot);
    parts[`${side}LegPivot`] = pivot;
    targets[`${side}LegPivot`] = new THREE.Euler(0, 0, 0);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 1.1, 24), palette.paint.clone());
    thigh.name = `${side}Thigh`;
    thigh.position.y = -0.55;
    thigh.castShadow = true;
    pivot.add(thigh);

    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), palette.accent.clone());
    knee.position.y = -1.1;
    pivot.add(knee);

    const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.9, 24), palette.paint.clone());
    calf.name = `${side}Calf`;
    calf.position.y = -1.5;
    calf.castShadow = true;
    pivot.add(calf);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.18, 0.8), palette.darkMetal.clone());
    foot.name = `${side}Foot`;
    foot.position.set(0, -1.95, 0.15);
    foot.castShadow = true;
    foot.receiveShadow = true;
    pivot.add(foot);
  };

  buildArm("left");
  buildArm("right");
  buildLeg("left");
  buildLeg("right");

  const spineCables = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, 1.6, -0.35),
    new THREE.Vector3(0.15, 1.2, -0.4),
    new THREE.Vector3(0.05, 0.9, -0.45),
  ]);
  const tubeGeom = new THREE.TubeGeometry(spineCables, 32, 0.04, 8, false);
  const tube = new THREE.Mesh(tubeGeom, palette.accent.clone());
  robot.add(tube);

  return { robot, palette };
}

function buildAccessories(
  robot: THREE.Group,
  parts: Record<string, THREE.Object3D>,
  palette: MaterialPalette
): Record<string, AccessoryAnim> {
  const states: Record<string, AccessoryAnim> = {};
  const register = (group: THREE.Object3D, name: string, parent?: THREE.Object3D) => {
    group.name = name;
    const base = group.scale.clone();
    group.visible = false;
    group.scale.set(0.01, 0.01, 0.01);
    (parent ?? robot).add(group);
    states[name] = { group, baseScale: base, current: 0, target: 0 };
  };

  const tagFx = (group: THREE.Object3D, data: Record<string, unknown>) => {
    group.userData = { ...(group.userData || {}), ...data };
  };

  // Wings: articulated aerofoil with LED strips and plasma tips
  const wings = new THREE.Group();
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.quadraticCurveTo(0.5, 0.35, 1.4, 0.15);
  wingShape.lineTo(1.5, 0);
  wingShape.quadraticCurveTo(0.8, -0.35, 0, -0.05);
  const wingGeom = new THREE.ExtrudeGeometry(wingShape, {
    steps: 1,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.035,
    bevelSegments: 2,
  });
  const wingPanels: THREE.Object3D[] = [];
  const wingLeds: THREE.Mesh[] = [];
  const wingThrusters: THREE.Mesh[] = [];
  [ -1, 1 ].forEach((sign) => {
    const wingRoot = new THREE.Group();
    wingRoot.position.set(sign * 0.95, 1.05, -0.18);
    wingRoot.rotation.y = sign * Math.PI * 0.32;
    const panel = new THREE.Mesh(wingGeom, palette.chrome.clone());
    panel.scale.set(1, 1, sign);
    panel.material.metalness = 0.9;
    panel.material.roughness = 0.1;
    panel.material.emissive = new THREE.Color(0x1d4ed8);
    panel.material.emissiveIntensity = 0.2;
    panel.rotation.y = sign * Math.PI * 0.08;
    panel.position.set(0, 0.05, 0);
    panel.userData.baseRotationZ = 0;
    wingPanels.push(panel);
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 16), palette.darkMetal.clone());
    strut.rotation.z = Math.PI / 2;
    strut.position.set(sign * 0.25, -0.05, -0.05);
    const led = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.04, 0.04), palette.light.clone());
    led.position.set(sign * 0.2, 0.1, 0.12);
    (led.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.2;
    const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.12, 0.4, 16), palette.accent.clone());
    thruster.rotation.z = Math.PI / 2;
    thruster.position.set(sign * 0.95, 0.02, -0.15);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 16), palette.light.clone());
    flame.position.copy(thruster.position).setZ(thruster.position.z - 0.25);
    flame.material.emissiveIntensity = 2.8;
    flame.material.transparent = true;
    flame.material.opacity = 0.75;
    wingThrusters.push(flame);
    wingRoot.add(panel, strut, led, thruster, flame);
    wings.add(wingRoot);
    wingLeds.push(led);
  });
  tagFx(wings, { fxType: "wings", fxPanels: wingPanels, fxLeds: wingLeds, fxThrusters: wingThrusters });
  register(wings, "wings", parts.body || robot);

  // Boosters: multi-stage pods with dynamic plasma exhaust
  const boosters = new THREE.Group();
  const podBodyGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.9, 24, 1, true);
  const podNoseGeom = new THREE.ConeGeometry(0.18, 0.35, 24);
  const podTailGeom = new THREE.ConeGeometry(0.12, 0.28, 20);
  const boosterFlames: THREE.Mesh[] = [];
  const boosterRings: THREE.Mesh[] = [];
  [ -0.42, 0.42 ].forEach((x, idx) => {
    const podGroup = new THREE.Group();
    podGroup.position.set(x, 0.95, -0.72);
    podGroup.rotation.z = Math.PI / 2;
    const body = new THREE.Mesh(podBodyGeom, palette.darkMetal.clone());
    body.material.metalness = 0.7;
    const nose = new THREE.Mesh(podNoseGeom, palette.paint.clone());
    nose.position.y = 0.5;
    const tail = new THREE.Mesh(podTailGeom, palette.accent.clone());
    tail.position.y = -0.45;
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.04, 10, 24), palette.chrome.clone());
    const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 12), palette.accent.clone());
    vent.position.set(0, 0.2, 0.18);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.75, 16), palette.light.clone());
    flame.position.y = -0.95;
    flame.material.emissiveIntensity = 2.5;
    flame.material.transparent = true;
    flame.material.opacity = 0.7;
    flame.userData.baseScale = flame.scale.clone();
    boosterFlames.push(flame);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.015, 8, 48), palette.light.clone());
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.9;
    halo.material.emissiveIntensity = 1.8;
    boosterRings.push(halo);
    podGroup.add(body, nose, tail, collar, vent, flame, halo);
    boosters.add(podGroup);
    if (idx === 0) {
      const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 12), palette.darkMetal.clone());
      manifold.rotation.x = Math.PI / 2;
      manifold.position.set(0, 0.95, -0.62);
      boosters.add(manifold);
    }
  });
  tagFx(boosters, { fxType: "boosters", fxFlames: boosterFlames, fxHalos: boosterRings });
  register(boosters, "boosters", robot);

  // Shield: layered discs with animated ripples and orbiting arcs
  const shield = new THREE.Group();
  const discMat = palette.light.clone();
  discMat.transparent = true;
  discMat.opacity = 0.45;
  discMat.side = THREE.DoubleSide;
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.1, 64), discMat);
  disc.position.set(0, 1.2, 0.95);
  disc.rotation.x = -Math.PI / 2;
  const glowPlane = new THREE.Mesh(new THREE.CircleGeometry(1.6, 48), palette.light.clone());
  glowPlane.material.opacity = 0.2;
  glowPlane.material.transparent = true;
  glowPlane.rotation.copy(disc.rotation);
  glowPlane.position.copy(disc.position);
  const ripple = new THREE.Mesh(new THREE.RingGeometry(0.55, 1.25, 48, 1), palette.light.clone());
  ripple.rotation.copy(disc.rotation);
  ripple.position.copy(disc.position);
  ripple.material.opacity = 0.35;
  ripple.material.transparent = true;
  const ringCount = 3;
  const orbitingRings: THREE.Mesh[] = [];
  for (let i = 0; i < ringCount; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4 + i * 0.25, 0.02, 12, 64, Math.PI * 0.8), palette.accent.clone());
    ring.rotation.set(Math.PI / 2, 0, i * Math.PI / 3);
    ring.position.copy(disc.position).add(new THREE.Vector3(0, 0.05 * i, 0));
    ring.material.emissiveIntensity = 1.2;
    orbitingRings.push(ring);
    shield.add(ring);
  }
  shield.add(glowPlane, disc, ripple);
  tagFx(shield, { fxType: "shield", fxGlow: glowPlane, fxRipple: ripple, fxRings: orbitingRings });
  register(shield, "shield", robot);

  return states;
}
