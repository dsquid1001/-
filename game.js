const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById("game").appendChild(renderer.domElement);


// ====================
// 光
// ====================

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(10, 20, 10);
scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);


// ====================
// 地面
// ====================

const groundGeometry = new THREE.PlaneGeometry(100, 100);

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x4c9a45
});

const ground = new THREE.Mesh(
  groundGeometry,
  groundMaterial
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// ====================
// 家
// ====================

function createHouse(x, z) {

  const houseGeometry = new THREE.BoxGeometry(6, 4, 6);

  const houseMaterial = new THREE.MeshStandardMaterial({
    color: 0xc98b5b
  });

  const house = new THREE.Mesh(
    houseGeometry,
    houseMaterial
  );

  house.position.set(x, 2, z);

  scene.add(house);


  // 屋根

  const roofGeometry = new THREE.ConeGeometry(4.5, 3, 4);

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b3a3a
  });

  const roof = new THREE.Mesh(
    roofGeometry,
    roofMaterial
  );

  roof.position.set(x, 5.5, z);

  roof.rotation.y = Math.PI / 4;

  scene.add(roof);
}

createHouse(-10, -5);
createHouse(10, -5);


// ====================
// 木
// ====================

function createTree(x, z) {

  const trunkGeometry = new THREE.CylinderGeometry(
    0.5,
    0.7,
    3,
    8
  );

  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b4226
  });

  const trunk = new THREE.Mesh(
    trunkGeometry,
    trunkMaterial
  );

  trunk.position.set(x, 1.5, z);

  scene.add(trunk);


  const leavesGeometry = new THREE.SphereGeometry(2.5, 16, 16);

  const leavesMaterial = new THREE.MeshStandardMaterial({
    color: 0x267a35
  });

  const leaves = new THREE.Mesh(
    leavesGeometry,
    leavesMaterial
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
// カメラ
// ====================

camera.position.set(0, 12, 22);

camera.lookAt(0, 0, 0);


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

function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
