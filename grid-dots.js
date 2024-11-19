// Detect mobile devices
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Dots Grid Background Animation (Desktop only)
if (!isMobile()) {
  document.addEventListener("DOMContentLoaded", function() {
   
    if (typeof THREE !== 'undefined') {
      const DOT_SIZE = 1, MAX_DOT_SIZE = 16, GAP = 50, INTERACT_RADIUS = 400;
      const ORANGE_COLOR = { r: 255, g: 165, b: 0 }, GREY_COLOR = { r: 169, g: 169, b: 169 }, BASE_COLOR = { r: 90, g: 90, b: 90 };
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1000, 1000);
      camera.position.z = 1;
      const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('dots-canvas-404'), antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      function generateGrid(width, height, gap) {
        const positions = [];
        for (let x = -width / 2; x <= width / 2; x += gap) {
          for (let y = -height / 2; y <= height / 2; y += gap) {
            positions.push(x, y, 0);
          }
        }
        return new Float32Array(positions);
      }

      const bgGeometry = new THREE.BufferGeometry();
      bgGeometry.setAttribute('position', new THREE.Float32BufferAttribute(generateGrid(window.innerWidth, window.innerHeight, GAP), 3));
      const bgMaterial = new THREE.PointsMaterial({ color: `rgb(${BASE_COLOR.r},${BASE_COLOR.g},${BASE_COLOR.b})`, size: DOT_SIZE, sizeAttenuation: false, transparent: true });
      const backgroundPoints = new THREE.Points(bgGeometry, bgMaterial);
      scene.add(backgroundPoints);

      const interactiveGeometry = new THREE.BufferGeometry();
      interactiveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(generateGrid(window.innerWidth, window.innerHeight, GAP), 3));

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
          uniform float u_time;
          uniform float u_interactionRadius;
          varying float v_distance;
          void main() {
            vec2 pos = position.xy;
            float distance = length(pos - u_mouse);
            v_distance = distance;
            float size = mix(${DOT_SIZE.toFixed(1)}, ${MAX_DOT_SIZE.toFixed(1)}, 1.0 - smoothstep(0.0, u_interactionRadius, distance));
            float pulsate = 1.0 + 0.3 * sin(u_time * 2.0 + distance * 0.02);
            size *= pulsate;
            gl_PointSize = size;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision mediump float;
          varying float v_distance;
          uniform vec2 u_mouse;
          uniform float u_interactionRadius;
          uniform float u_intensity;
          void main() {
            float normalizedDistance = smoothstep(0.0, u_interactionRadius, v_distance);
            vec3 centerColor = vec3(${ORANGE_COLOR.r / 255.0}, ${ORANGE_COLOR.g / 255.0}, ${ORANGE_COLOR.b / 255.0});
            vec3 outerColor = vec3(${GREY_COLOR.r / 255.0}, ${GREY_COLOR.g / 255.0}, ${GREY_COLOR.b / 255.0});
            vec3 color = mix(centerColor, outerColor, normalizedDistance);
            color = pow(color, vec3(1.2));
            color += vec3(0.5) * u_intensity * (1.0 - normalizedDistance);
            float alpha = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - vec2(0.5)));
            alpha *= u_intensity;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      });

      const interactivePoints = new THREE.Points(interactiveGeometry, interactiveMaterial);
      scene.add(interactivePoints);

      let targetMouse = new THREE.Vector2(-2000, -2000), currentMouse = new THREE.Vector2(-2000, -2000);
      const delayFactor = 0.05, intensityFadeSpeed = 2.0, clock = new THREE.Clock();
      let targetIntensity = 0.0;
      let idleTimeout;

      function update(delta) {
        currentMouse.lerp(targetMouse, delayFactor);
        interactiveMaterial.uniforms.u_mouse.value.copy(currentMouse);
        interactiveMaterial.uniforms.u_intensity.value += (targetIntensity - interactiveMaterial.uniforms.u_intensity.value) * Math.min(intensityFadeSpeed * delta, 1.0);
      }

      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        interactiveMaterial.uniforms.u_time.value += delta;
        update(delta);
        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener('resize', () => {
        camera.left = window.innerWidth / -2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / -2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        const newPositions = generateGrid(window.innerWidth, window.innerHeight, GAP);
        backgroundPoints.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        backgroundPoints.geometry.attributes.position.needsUpdate = true;
        interactivePoints.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        interactivePoints.geometry.attributes.position.needsUpdate = true;
      });

      document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = -(e.clientY - window.innerHeight / 2);
        targetMouse.set(mouseX, mouseY);
        targetIntensity = 1.0;

        // Reset idle timer when mouse moves
        clearTimeout(idleTimeout);
        gsap.to(interactivePoints.scale, {
          duration: 1.5,
          x: 1,
          y: 1,
          z: 1,
          ease: "power4.out"
        });

        // Restart idle timeout
        idleTimeout = setTimeout(() => {
          gsap.to(interactivePoints.scale, {
            duration: 1.5,
            x: 0.8,
            y: 0.8,
            z: 0.8,
            ease: "power4.out"
          });
        }, 3000); // Wait 3 seconds before scaling down
      });

      document.getElementById('dots-canvas-404').addEventListener('mouseleave', () => {
        targetIntensity = 0.0;
      });
    } else {
      console.error('Three.js is not loaded. Please include Three.js in your HTML.');
    }
  });
}
