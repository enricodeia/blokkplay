window.onload = function () {
  if (typeof THREE === "undefined") {
    console.error("Three.js is not loaded. Please include Three.js in your HTML.");
    return;
  }

  const DOT_SIZE = 1, GAP = 75, INTERACT_RADIUS = 300;
  const BASE_COLOR = { r: 90, g: 90, b: 90 };
  const BRIGHT_COLOR = { r: 133, g: 100, b: 250 };
  const WHITE_COLOR = { r: 200, g: 200, b: 200 };

  // Create the scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    -1000,
    1000
  );
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("dots-canvas"),
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Precompute the grid positions
  const positions = [];
  for (let x = -window.innerWidth / 2; x <= window.innerWidth / 2; x += GAP) {
    for (let y = -window.innerHeight / 2; y <= window.innerHeight / 2; y += GAP) {
      positions.push(x, y, 0);
    }
  }
  const gridPositions = new Float32Array(positions);

  // Create the background points
  const bgGeometry = new THREE.BufferGeometry();
  bgGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3));
  const bgMaterial = new THREE.PointsMaterial({
    color: `rgb(${BASE_COLOR.r},${BASE_COLOR.g},${BASE_COLOR.b})`,
    size: DOT_SIZE,
    sizeAttenuation: false,
    transparent: true,
  });
  const backgroundPoints = new THREE.Points(bgGeometry, bgMaterial);
  scene.add(backgroundPoints);

  // Create the interactive points
  const interactiveMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_mouse: { value: new THREE.Vector2(-2000, -2000) },
      u_time: { value: 0.0 },
      u_interactionRadius: { value: INTERACT_RADIUS },
      u_intensity: { value: 0.0 },
    },
    vertexShader: `
      precision mediump float;
      uniform vec2 u_mouse;
      uniform float u_interactionRadius;
      varying float v_distance;
      void main() {
        vec2 pos = position.xy;
        float distance = length(pos - u_mouse);
        v_distance = distance;
        float size = mix(${DOT_SIZE}, 10.0, 1.0 - smoothstep(0.0, u_interactionRadius, distance));
        gl_PointSize = size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying float v_distance;
      uniform float u_interactionRadius;
      void main() {
        float alpha = 1.0 - smoothstep(0.4, 0.6, length(gl_PointCoord - vec2(0.5)));
        gl_FragColor = vec4(vec3(1.0), alpha);
      }
    `,
    transparent: true,
  });

  const interactiveGeometry = new THREE.BufferGeometry();
  interactiveGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3));
  const interactivePoints = new THREE.Points(interactiveGeometry, interactiveMaterial);
  scene.add(interactivePoints);

  // Interaction variables
  let mousePosition = new THREE.Vector2(-2000, -2000);
  let lastMouseMove = Date.now();

  // Resize handler
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });

  // Mouse interaction
  document.addEventListener("mousemove", (e) => {
    mousePosition.set(e.clientX - window.innerWidth / 2, -(e.clientY - window.innerHeight / 2));
    interactiveMaterial.uniforms.u_mouse.value = mousePosition;
    lastMouseMove = Date.now();
  });

  // Animation loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    interactiveMaterial.uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  }
  animate();
};
