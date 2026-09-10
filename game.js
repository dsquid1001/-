import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

const ui = document.getElementById("ui");

try {

  // ====================
  // シーン
  // ====================

  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x87ceeb);


  // ====================
  // カメラ
  // ====================

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 8, 18);
  camera.lookAt(0, 0, 0);


  // ====================
  // 描画
  // ====================

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

  document.getElementById("game").appendChild(
    renderer.domElement
  );


  // ====================
  // 光
  // ====================

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


  // ====================
  // 地面
  // ====================

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: 0x4c9a45
    })
  );

  ground.rotation.x = -Math.PI / 2;

  scene.add(ground);


  // ====================
  // 家を作る
  // ====================

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


  // ====================
  // 木を作る
  // ====================

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


  // ====================
  // プレイヤー
  // ====================

  const player = new THREE.Group();


  // 体

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.8, 0.8),
    new THREE.MeshStandardMaterial({
      color: 0x3366cc
    })
  );

  body.position.y = 0.9;

  player.add(body);


  // 頭

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffcc99
    })
  );

  head.position.y = 2.1;

  player.add(head);


  // プレイヤーの初期位置

  player.position.set(0, 0, 8);

  scene.add(player);


  // ====================
  // 起動成功
  // ====================

  ui.innerHTML = `
    <h1>異世界人生シミュレーション</h1>
    <p>3D世界 起動成功！</p>
  `;


  // ====================
  // 画面サイズ変更
  // ====================

  window.addEventListener("resize", () => {

    camera.aspect =
      window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  });


  // ====================
  // ゲームループ
  // ====================

  renderer.setAnimationLoop(() => {

    renderer.render(scene, camera);

  });


} catch (error) {

  console.error(error);

  ui.innerHTML = `
    <h1>3D起動エラー</h1>
    <p>Three.jsを読み込めませんでした。</p>
    <p>${error.message}</p>
  `;

}
