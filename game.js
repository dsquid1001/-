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

  camera.position.set(0, 7, 18);
  camera.lookAt(0, 1, 0);

  // =========================
  // レンダラー
  // =========================

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  game.appendChild(renderer.domElement);

  // =========================
  // 光
  // =========================

  const sunlight = new THREE.DirectionalLight(0xffffff, 2);
  sunlight.position.set(10, 20, 10);
  scene.add(sunlight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
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
  // 家を作る
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
  // 木を作る
  // =========================

  function createTree(x, z) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.7, 3, 8),
      new THREE.MeshStandardMaterial({
        color: 0x6b4226
      })
    );

    trunk.position.set(x, 1.5, z);
    scene.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 16, 16),
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
    new THREE.SphereGeometry(0.55, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffcc99
    })
  );

  head.position.y = 2.1;
  player.add(head);

  player.position.set(0, 0, 8);

  scene.add(player);

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
  // プレイヤー移動
  // =========================

  const moveSpeed = 0.15;

  function movePlayer(direction) {

    if (direction === "up") {
      player.position.z -= moveSpeed;
    }

    if (direction === "down") {
      player.position.z += moveSpeed;
    }

    if (direction === "left") {
      player.position.x -= moveSpeed;
    }

    if (direction === "right") {
      player.position.x += moveSpeed;
    }
  }

  function setupButton(id, direction) {

    const button = document.getElementById(id);

    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      movePlayer(direction);
    });

    button.addEventListener("pointerdown", () => {

      const interval = setInterval(() => {
        movePlayer(direction);
      }, 50);

      button.dataset.interval = interval;

    });

    button.addEventListener("pointerup", () => {

      if (button.dataset.interval) {
        clearInterval(Number(button.dataset.interval));
        delete button.dataset.interval;
      }

    });

    button.addEventListener("pointerleave", () => {

      if (button.dataset.interval) {
        clearInterval(Number(button.dataset.interval));
        delete button.dataset.interval;
      }

    });
  }

  setupButton("up", "up");
  setupButton("down", "down");
  setupButton("left", "left");
  setupButton("right", "right");

  // =========================
  // キーボード操作
  // =========================

  window.addEventListener("keydown", event => {

    if (event.key === "ArrowUp" || event.key === "w") {
      movePlayer("up");
    }

    if (event.key === "ArrowDown" || event.key === "s") {
      movePlayer("down");
    }

    if (event.key === "ArrowLeft" || event.key === "a") {
      movePlayer("left");
    }

    if (event.key === "ArrowRight" || event.key === "d") {
      movePlayer("right");
    }

  });

  // =========================
  // UI
  // =========================

  ui.innerHTML = `
    <h1>異世界人生シミュレーション</h1>
    <p>3D世界 起動成功！</p>
    <p>操作パッドで移動できます。</p>
  `;

  // =========================
  // 画面サイズ変更
  // =========================

  window.addEventListener("resize", () => {

    camera.aspect =
      window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  });

  // =========================
  // ゲームループ
  // =========================

  renderer.setAnimationLoop(() => {

    renderer.render(scene, camera);

  });

} catch (error) {

  console.error(error);

  ui.innerHTML = `
    <h1>3D起動エラー</h1>
    <p>ゲームの起動中にエラーが発生しました。</p>
    <p>${error.message}</p>
  `;

}
