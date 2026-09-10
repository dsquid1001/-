import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

const ui = document.getElementById("ui");
const game = document.getElementById("game");

try {

  // =========================
  // シーン
  // =========================

  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x87ceeb);

  // =========================
  // カメラ
  // =========================

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // =========================
  // レンダラー
  // =========================

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  renderer.domElement.style.touchAction = "none";

  game.appendChild(renderer.domElement);

  // =========================
  // 光
  // =========================

  const sunlight = new THREE.DirectionalLight(
    0xffffff,
    2
  );

  sunlight.position.set(10, 20, 10);

  scene.add(sunlight);

  const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1
  );

  scene.add(ambientLight);

  // =========================
  // 地面
  // =========================

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: 0x4c9a45
    })
  );

  ground.rotation.x = -Math.PI / 2;

  scene.add(ground);

  // =========================
  // 家
  // =========================

  function createHouse(x, z) {

    const house = new THREE.Mesh(
      new THREE.BoxGeometry(6, 4, 6),
      new THREE.MeshStandardMaterial({
        color: 0xc98b5b
      })
    );

    house.position.set(x, 2, z);

    scene.add(house);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(4.5, 3, 4),
      new THREE.MeshStandardMaterial({
        color: 0x8b3a3a
      })
    );

    roof.position.set(x, 5.5, z);

    roof.rotation.y = Math.PI / 4;

    scene.add(roof);
  }

  createHouse(-10, -5);
  createHouse(10, -5);

  // =========================
  // 木
  // =========================

  function createTree(x, z) {

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.5,
        0.7,
        3,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x6b4226
      })
    );

    trunk.position.set(x, 1.5, z);

    scene.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(
        2.5,
        16,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0x267a35
      })
    );

    leaves.position.set(x, 4, z);

    scene.add(leaves);
  }

  createTree(-18, -15);
  createTree(-14, -12);
  createTree(18, -15);
  createTree(15, -10);
  createTree(-20, 5);
  createTree(20, 8);

  // =========================
  // プレイヤー
  // =========================

  const player = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.8, 0.8),
    new THREE.MeshStandardMaterial({
      color: 0x3366cc
    })
  );

  body.position.y = 0.9;

  player.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.55,
      16,
      16
    ),
    new THREE.MeshStandardMaterial({
      color: 0xffcc99
    })
  );

  head.position.y = 2.1;

  player.add(head);

  player.position.set(0, 0, 8);

  scene.add(player);

  // 一人称なので体を隠す

  body.visible = false;
  head.visible = false;

  // =========================
  // 視点設定
  // =========================

  let cameraYaw = 0;
  let cameraPitch = 0;

  const lookSpeed = 0.005;

  const maxPitch = Math.PI / 2.2;

  // =========================
  // 移動設定
  // =========================

  const moveSpeed = 0.12;

  // ジョイスティックの入力

  let joystickX = 0;
  let joystickY = 0;

  // =========================
  // 移動処理
  // =========================

  function movePlayer() {

    const inputX = joystickX;
    const inputY = joystickY;

    // 入力がほぼゼロなら何もしない

    if (
      Math.abs(inputX) < 0.01 &&
      Math.abs(inputY) < 0.01
    ) {
      return;
    }

    // プレイヤーの前方向

    const forward = new THREE.Vector3(
      0,
      0,
      -1
    );

    forward.applyQuaternion(
      player.quaternion
    );

    forward.y = 0;

    forward.normalize();

    // プレイヤーの右方向

    const right = new THREE.Vector3(
      1,
      0,
      0
    );

    right.applyQuaternion(
      player.quaternion
    );

    right.y = 0;

    right.normalize();

    // 前後

    player.position.add(
      forward.multiplyScalar(
        inputY * moveSpeed
      )
    );

    // 左右

    player.position.add(
      right.multiplyScalar(
        inputX * moveSpeed
      )
    );
  }

  // =========================
  // ジョイスティック
  // =========================

  const joystick = document.createElement("div");

  joystick.id = "joystick";

  joystick.style.position = "fixed";
  joystick.style.left = "25px";
  joystick.style.bottom = "25px";

  joystick.style.width = "170px";
  joystick.style.height = "170px";

  joystick.style.borderRadius = "50%";

  joystick.style.background =
    "rgba(0,0,0,0.30)";

  joystick.style.border =
    "3px solid rgba(255,255,255,0.75)";

  joystick.style.zIndex = "100";

  joystick.style.touchAction = "none";

  joystick.style.userSelect = "none";
  joystick.style.webkitUserSelect = "none";
  joystick.style.webkitTouchCallout = "none";

  game.appendChild(joystick);

  // =========================
  // ジョイスティックの中の円
  // =========================

  const joystickKnob =
    document.createElement("div");

  joystickKnob.id = "joystick-knob";

  joystickKnob.style.position = "absolute";

  joystickKnob.style.left = "50%";
  joystickKnob.style.top = "50%";

  joystickKnob.style.width = "70px";
  joystickKnob.style.height = "70px";

  joystickKnob.style.marginLeft = "-35px";
  joystickKnob.style.marginTop = "-35px";

  joystickKnob.style.borderRadius = "50%";

  joystickKnob.style.background =
    "rgba(255,255,255,0.65)";

  joystickKnob.style.border =
    "3px solid white";

  joystickKnob.style.boxSizing =
    "border-box";

  joystickKnob.style.touchAction = "none";

  joystickKnob.style.userSelect = "none";
  joystickKnob.style.webkitUserSelect = "none";
  joystickKnob.style.webkitTouchCallout = "none";

  joystick.appendChild(joystickKnob);

  // =========================
  // ジョイスティック計算
  // =========================

  const joystickRadius = 50;

  let joystickPointerId = null;

  function updateJoystick(
    clientX,
    clientY
  ) {

    const rect =
      joystick.getBoundingClientRect();

    const centerX =
      rect.left + rect.width / 2;

    const centerY =
      rect.top + rect.height / 2;

    let x =
      clientX - centerX;

    let y =
      clientY - centerY;

    // 移動可能範囲

    const distance =
      Math.sqrt(
        x * x + y * y
      );

    if (
      distance > joystickRadius
    ) {

      x =
        x / distance *
        joystickRadius;

      y =
        y / distance *
        joystickRadius;
    }

    // スティックを動かす

    joystickKnob.style.transform =
      `translate(${x}px, ${y}px)`;

    // 入力値

    joystickX =
      x / joystickRadius;

    // Yは画面上がマイナスなので反転

    joystickY =
      -y / joystickRadius;
  }

  function resetJoystick() {

    joystickPointerId = null;

    joystickX = 0;
    joystickY = 0;

    joystickKnob.style.transform =
      "translate(0px, 0px)";
  }

  // =========================
  // ジョイスティック操作
  // =========================

  joystick.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      joystickPointerId =
        event.pointerId;

      joystick.setPointerCapture(
        event.pointerId
      );

      updateJoystick(
        event.clientX,
        event.clientY
      );
    }
  );

  joystick.addEventListener(
    "pointermove",
    event => {

      if (
        event.pointerId !==
        joystickPointerId
      ) {
        return;
      }

      event.preventDefault();

      updateJoystick(
        event.clientX,
        event.clientY
      );
    }
  );

  joystick.addEventListener(
    "pointerup",
    event => {

      if (
        event.pointerId !==
        joystickPointerId
      ) {
        return;
      }

      resetJoystick();
    }
  );

  joystick.addEventListener(
    "pointercancel",
    event => {

      if (
        event.pointerId !==
        joystickPointerId
      ) {
        return;
      }

      resetJoystick();
    }
  );

  // =========================
  // 右側ドラッグで視点操作
  // =========================

  let lookPointerId = null;

  let lastTouchX = 0;
  let lastTouchY = 0;

  renderer.domElement.addEventListener(
    "pointerdown",
    event => {

      // 右半分だけ視点操作

      if (
        event.clientX <
        window.innerWidth / 2
      ) {
        return;
      }

      lookPointerId =
        event.pointerId;

      lastTouchX =
        event.clientX;

      lastTouchY =
        event.clientY;

      renderer.domElement.setPointerCapture(
        event.pointerId
      );
    }
  );

  renderer.domElement.addEventListener(
    "pointermove",
    event => {

      if (
        event.pointerId !==
        lookPointerId
      ) {
        return;
      }

      const deltaX =
        event.clientX -
        lastTouchX;

      const deltaY =
        event.clientY -
        lastTouchY;

      lastTouchX =
        event.clientX;

      lastTouchY =
        event.clientY;

      // 左右

      cameraYaw -=
        deltaX * lookSpeed;

      // 上下

      cameraPitch -=
        deltaY * lookSpeed;

      // 上下の限界

      cameraPitch =
        Math.max(
          -maxPitch,
          Math.min(
            maxPitch,
            cameraPitch
          )
        );

      // プレイヤーの向き

      player.rotation.y =
        cameraYaw;
    }
  );

  function stopLooking(event) {

    if (
      event.pointerId ===
      lookPointerId
    ) {

      lookPointerId = null;
    }
  }

  renderer.domElement.addEventListener(
    "pointerup",
    stopLooking
  );

  renderer.domElement.addEventListener(
    "pointercancel",
    stopLooking
  );

  // =========================
  // キーボード操作
  // =========================

  const keys = {};

  window.addEventListener(
    "keydown",
    event => {

      keys[event.key.toLowerCase()] =
        true;
    }
  );

  window.addEventListener(
    "keyup",
    event => {

      keys[event.key.toLowerCase()] =
        false;
    }
  );

  function updateKeyboard() {

    let x = 0;
    let y = 0;

    if (
      keys["w"] ||
      keys["arrowup"]
    ) {
      y += 1;
    }

    if (
      keys["s"] ||
      keys["arrowdown"]
    ) {
      y -= 1;
    }

    if (
      keys["a"] ||
      keys["arrowleft"]
    ) {
      x -= 1;
    }

    if (
      keys["d"] ||
      keys["arrowright"]
    ) {
      x += 1;
    }

    // キーボード入力がある場合

    if (
      x !== 0 ||
      y !== 0
    ) {

      const length =
        Math.sqrt(
          x * x + y * y
        );

      joystickX =
        x / length;

      joystickY =
        y / length;

    }
  }

  // =========================
  // UI
  // =========================

  ui.innerHTML = `
    <h1>異世界人生シミュレーション</h1>
    <p>一人称視点</p>
    <p>左：移動　右：視点</p>
  `;

  // =========================
  // カメラ更新
  // =========================

  function updateCamera() {

    const eyePosition =
      new THREE.Vector3(
        0,
        1.7,
        0
      );

    eyePosition.applyMatrix4(
      player.matrixWorld
    );

    camera.position.copy(
      eyePosition
    );

    const lookDirection =
      new THREE.Vector3(
        0,
        0,
        -1
      );

    const cameraRotation =
      new THREE.Euler(
        cameraPitch,
        cameraYaw,
        0,
        "YXZ"
      );

    lookDirection.applyEuler(
      cameraRotation
    );

    camera.lookAt(
      camera.position.clone().add(
        lookDirection
      )
    );
  }

  // =========================
  // 画面サイズ変更
  // =========================

  window.addEventListener(
    "resize",
    () => {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    }
  );

  // =========================
  // ゲームループ
  // =========================

  renderer.setAnimationLoop(() => {

    updateKeyboard();

    movePlayer();

    player.updateMatrixWorld(true);

    updateCamera();

    renderer.render(
      scene,
      camera
    );
  });

} catch (error) {

  console.error(error);

  ui.innerHTML = `
    <h1>3D起動エラー</h1>
    <p>ゲームの起動中にエラーが発生しました。</p>
    <p>${error.message}</p>
  `;
}
