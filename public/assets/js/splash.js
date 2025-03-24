// Scene setup
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create a 3D Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhongMaterial({ color: 0x00aaff, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Camera position
camera.position.z = 5;

// Set a background color
scene.background = new THREE.Color(0x1a1a3d); // Dark blue gradient-like background

// GSAP animations
gsap.to(sphere.rotation, {
  y: Math.PI * 2, // Full rotation
  duration: 10,
  repeat: -1, // Infinite loop
  ease: 'none',
});
gsap.to(sphere.scale, {
  x: 1.2,
  y: 1.2,
  z: 1.2,
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: 'power1.inOut',
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});