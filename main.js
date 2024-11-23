// Unified Script File for Multiple Canvas Animations and Effects

document.addEventListener("DOMContentLoaded", function() {
  // ==============================
  // Three.js Dots Animation (Interactive Grid Effect)
  // ==============================
  (function () {
    if (typeof THREE === "undefined") {
      console.error("Three.js is not loaded. Please include Three.js in your HTML.");
      return;
    }

    const DOT_SIZE = 1;
    const GAP = 50;
    const INTERACT_RADIUS = 400;
    const BASE_COLOR = { r: 90, g: 90, b: 90 };
    const BRIGHT_COLOR = { r: 133, g: 100, b: 250 };
    const WHITE_COLOR = { r: 200, g: 200, b: 200 };

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
    bgGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(generateGrid(window.innerWidth, window.innerHeight, GAP), 3)
    );
    const bgMaterial = new THREE.PointsMaterial({
      color: `rgb(${BASE_COLOR.r},${BASE_COLOR.g},${BASE_COLOR.b})`,
      size: DOT_SIZE,
      sizeAttenuation: false,
      transparent: true,
    });
    const backgroundPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(backgroundPoints);

    const interactiveGeometry = new THREE.BufferGeometry();
    interactiveGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(generateGrid(window.innerWidth, window.innerHeight, GAP), 3)
    );

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
          float size = mix(${DOT_SIZE.toFixed(1)}, 16.0, 1.0 - smoothstep(0.0, u_interactionRadius, distance));
          size *= 1.0 + 0.3 * sin(u_time * 2.0 + distance * 0.02);
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
          vec3 centerColor = vec3(${BRIGHT_COLOR.r / 255.0}, ${BRIGHT_COLOR.g / 255.0}, ${BRIGHT_COLOR.b / 255.0});
          vec3 outerColor = vec3(${WHITE_COLOR.r / 255.0}, ${WHITE_COLOR.g / 255.0}, ${WHITE_COLOR.b / 255.0});
          vec3 color = mix(centerColor, outerColor, normalizedDistance);
          color = pow(color, vec3(1.2));
          float alpha = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - vec2(0.5)));
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    });

    const interactivePoints = new THREE.Points(interactiveGeometry, interactiveMaterial);
    scene.add(interactivePoints);

    let targetMouse = new THREE.Vector2(-2000, -2000);
    const delayFactor = 0.05;
    const intensityFadeSpeed = 2.0;
    const clock = new THREE.Clock();
    let targetIntensity = 0.0;
    let lastMouseMove = Date.now();

    // Resize handler
    function resizeScene() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update camera
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();

      // Update renderer size
      renderer.setSize(width, height);

      // Update grid positions
      const newPositions = generateGrid(width, height, GAP);
      backgroundPoints.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(newPositions, 3)
      );
      backgroundPoints.geometry.attributes.position.needsUpdate = true;
      interactivePoints.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(newPositions, 3)
      );
      interactivePoints.geometry.attributes.position.needsUpdate = true;
    }

    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX - window.innerWidth / 2;
      const mouseY = -(e.clientY - window.innerHeight / 2);
      targetMouse.set(mouseX, mouseY);
      targetIntensity = 1.0;
      lastMouseMove = Date.now();
    });

    document.getElementById("dots-canvas").addEventListener("mouseleave", () => {
      targetIntensity = 0.0;
    });

    function update(delta) {
      const now = Date.now();
      if (now - lastMouseMove > 1500) {
        interactiveMaterial.uniforms.u_interactionRadius.value +=
          (DOT_SIZE * 50 - interactiveMaterial.uniforms.u_interactionRadius.value) * Math.min(0.5 * delta, 1.0);
      } else {
        interactiveMaterial.uniforms.u_interactionRadius.value +=
          (INTERACT_RADIUS - interactiveMaterial.uniforms.u_interactionRadius.value) * Math.min(0.5 * delta, 1.0);
      }

      interactiveMaterial.uniforms.u_mouse.value.lerp(targetMouse, delayFactor);
      interactiveMaterial.uniforms.u_intensity.value +=
        (targetIntensity - interactiveMaterial.uniforms.u_intensity.value) * Math.min(intensityFadeSpeed * delta, 1.0);
    }

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      interactiveMaterial.uniforms.u_time.value += delta;
      update(delta);
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", resizeScene);
    resizeScene(); // Initial resize
    animate(); // Start animation loop
  })();

  // ==============================
  // Line Animation Script
  // ==============================
  (function () {
    function animateLine(selector1, selector2, delays) {
      let line1 = document.querySelector(selector1);
      let line2 = document.querySelector(selector2);
      if (!line1 || !line2) {
        console.error(`Missing elements for selectors: ${selector1}, ${selector2}`);
        return;
      }
      let totalLength = line1.getTotalLength();
      let segmentLength = totalLength / 7;
      let randomDelay = () => delays[Math.floor(Math.random() * delays.length)];
      [line1, line2].forEach(line => {
        line.style.strokeDasharray = `${segmentLength} ${totalLength + segmentLength}`;
        line.style.strokeDashoffset = 0;
      });
      function animate() {
        gsap.fromTo(
          [line1, line2],
          { strokeDashoffset: 0, opacity: 0 },
          {
            strokeDashoffset: -totalLength,
            opacity: 1,
            duration: 3,
            ease: "linear",
            onUpdate() {
              let progress = -(gsap.getProperty(line1, "strokeDashoffset") / totalLength);
              let opacityValue = Math.abs(Math.sin(Math.PI * progress));
              line1.style.opacity = opacityValue;
              line2.style.opacity = opacityValue;
            },
            onComplete: () => gsap.delayedCall(randomDelay(), animate)
          }
        );
      }
      animate();
    }
    console.log("Line animation script initialized");
    animateLine("#left-line-top", "#left-line-blur", [4, 5, 6]);
    animateLine("#right-line-top", "#right-line-blur", [3, 5.5, 7]);
  })();

  // ==============================
  // Pixel Grid Animation for Non-Mobile
  // ==============================
  (function () {
    if (isMobile()) return;

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger is not loaded. Include the GSAP and ScrollTrigger scripts.");
      return;
    }

    function createPixelGrid() {
      const gridContainer = document.querySelector(".pixel_grid_top");
      if (!gridContainer) {
        console.error(".pixel_grid_top container not found. Make sure it exists in your HTML.");
        return;
      }
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cols = Math.ceil(width / 300);
      const rows = Math.ceil(height / 300);

      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      gridContainer.innerHTML = "";

      for (let i = 0; i < cols * rows; i++) {
        const pixelBox = document.createElement("div");
        pixelBox.classList.add("pixel_box_top");
        gridContainer.appendChild(pixelBox);
        gsap.set(pixelBox, {
          scale: Math.floor(i / cols) > rows - 3 ? 1 : 0,
          opacity: 1,
        });
      }

      gsap.fromTo(
        ".pixel_box_top",
        { y: 50, scale: 0, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".section_divider_top",
            start: "top 100%",
            end: "top -100%",
            toggleActions: "restart none none reverse",
            scrub: true,
          },
          stagger: {
            amount: 2,
            from: "random",
            grid: "auto",
          },
        }
      );
    }

    gsap.registerPlugin(ScrollTrigger);
    createPixelGrid();
    window.addEventListener("resize", () => {
      createPixelGrid();
      ScrollTrigger.refresh();
    });
  })();

  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
});
