const isMobile = window.innerWidth <= 768; // Define a breakpoint for mobile

// Initialize the Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the grey dots
const gridMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.05 });
const gridGeometry = new THREE.BufferGeometry();
const gridVertices = [];

// Populate the grid
const gridSize = 50;
for (let x = -gridSize; x <= gridSize; x++) {
  for (let y = -gridSize; y <= gridSize; y++) {
    gridVertices.push(x, y, 0);
  }
}

gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
const greyDots = new THREE.Points(gridGeometry, gridMaterial);
scene.add(greyDots);

camera.position.z = 5;

// If not on mobile, enable colored dots and interaction
if (!isMobile) {
  const colorMaterial = new THREE.PointsMaterial({ size: 0.1 });
  const colorGeometry = new THREE.BufferGeometry();

  const colorVertices = [];
  for (let i = 0; i < gridVertices.length; i += 3) {
    colorVertices.push(
      gridVertices[i] + Math.random() * 0.1,
      gridVertices[i + 1] + Math.random() * 0.1,
      gridVertices[i + 2]
    );
  }

  colorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(colorVertices, 3));
  colorMaterial.vertexColors = true;

  const coloredDots = new THREE.Points(colorGeometry, colorMaterial);
  scene.add(coloredDots);

  document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    colorMaterial.color.setRGB(1 + mouseX * 0.5, 1 + mouseY * 0.5, 0.5);
  });
}

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
