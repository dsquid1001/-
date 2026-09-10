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

  // 一人称なので自分の体は見せない
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

  function movePlayer(direction) {

    // プレイヤーが向いている方向
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

    if (direction === "up") {

      player.position.add(
        forward.clone().multiplyScalar(
          moveSpeed
        )
      );

    }

    if (direction === "down") {

      player.position.add(
        forward.clone().multiplyScalar(
          -moveSpeed
        )
      );

    }

    if (direction === "left") {

      player.position.add(
        right.clone().multiplyScalar(
          -moveSpeed
        )
      );

    }

    if (direction === "right") {

      player.position.add(
        right.clone().multiplyScalar(
          moveSpeed
        )
      );

    }
  }

  // =========================
  // 操作パッド
  // =========================

  const pad = document.createElement("div");

  pad.id = "control-pad";

  pad.innerHTML = `
    <button id="up">▲</button>
    <button id="left">◀</button>
    <button id="down">▼</button>
    <button id="right">▶</button>
  `;

  pad.style.position = "fixed";
  pad.style.left = "25px";
  pad.style.bottom = "25px";
  pad.style.width = "150px";
  pad.style.height = "150px";
  pad.style.zIndex = "100";

  game.appendChild(pad);

  const buttons = pad.querySelectorAll("button");

  buttons.forEach(button => {

    button.style.position = "absolute";
    button.style.width = "55px";
    button.style.height = "55px";
    button.style.fontSize = "25px";
    button.style.borderRadius = "50%";
    button.style.border = "2px solid white";
    button.style.background = "rgba(0,0,0,0.55)";
    button.style.color = "white";

    // iPadの文字選択を防止
    button.style.userSelect = "none";
    button.style.webkitUserSelect = "none";
    button.style.webkitTouchCallout = "none";
    button.style.webkitTapHighlightColor = "transparent";

    // タッチ操作をゲーム側で処理
    button.style.touchAction = "none";

  });

  pad.querySelector("#up").style.left = "47px";
  pad.querySelector("#up").style.top = "0";

  pad.querySelector("#left").style.left = "0";
  pad.querySelector("#left").style.top = "47px";

  pad.querySelector("#down").style.left = "47px";
  pad.querySelector("#down").style.top = "94px";

  pad.querySelector("#right").style.left = "94px";
  pad.querySelector("#right").style.top = "47px";

  // =========================
  // ボタン長押し
  // =========================

  function setupButton(id, direction) {

    const button = document.getElementById(id);

    let timer = null;

    button.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        movePlayer(direction);

        timer = setInterval(() => {

          movePlayer(direction);

        }, 50);

      }
    );

    function stopMoving() {

      if (timer !== null) {

        clearInterval(timer);
        timer = null;

      }

    }

    button.addEventListener(
      "pointerup",
      stopMoving
    );

    button.addEventListener(
      "pointercancel",
      stopMoving
    );

    button.addEventListener(
      "pointerleave",
      stopMoving
    );

  }

  setupButton("up", "up");
  setupButton("down", "down");
  setupButton("left", "left");
  setupButton("right", "right");

  // =========================
  // 右側ドラッグで視点操作
  // =========================

  let lookPointerId = null;

  let lastTouchX = 0;
  let lastTouchY = 0;

  renderer.domElement.addEventListener(
    "pointerdown",
    event => {

      // 画面右半分だけ視点操作
      if (
        event.clientX <
        window.innerWidth / 2
      ) {
        return;
      }

      lookPointerId = event.pointerId;

      lastTouchX = event.clientX;
      lastTouchY = event.clientY;

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
        event.clientX - lastTouchX;

      const deltaY =
        event.clientY - lastTouchY;

      lastTouchX = event.clientX;
      lastTouchY = event.clientY;

      // 左右を見る
      cameraYaw -=
        deltaX * lookSpeed;

      // 上下を見る
      cameraPitch -=
        deltaY * lookSpeed;

      // 上下の視点制限
      cameraPitch = Math.max(
        -maxPitch,
        Math.min(
          maxPitch,
          cameraPitch
        )
      );

      // プレイヤーの向きも変更
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

  window.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "ArrowUp" ||
        event.key === "w"
      ) {

        movePlayer("up");

      }

      if (
        event.key === "ArrowDown" ||
        event.key === "s"
      ) {

        movePlayer("down");

      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "a"
      ) {

        movePlayer("left");

      }

      if (
        event.key === "ArrowRight" ||
        event.key === "d"
      ) {

        movePlayer("right");

      }

    }
  );

  // =========================
  // UI
  // =========================

  ui.innerHTML = `
    <h1>異世界人生シミュレーション</h1>
    <p>一人称視点</p>
    <p>左：移動　右：視点</p>
  `;

  // =========================
  // カメラ
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

    // カメラの向き
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
