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

  // ==============================
  // Hero Button Effect
  // ==============================
  (function () {
    const mm = gsap.matchMedia();

    // Button hover animations for desktop and tablet (non-mobile)
    mm.add("(min-width: 769px)", () => {
      const btn = document.querySelector(".button_wrap");

      // Ensure the element exists
      if (!btn) {
        console.warn("Element '.button_wrap' not found. Skipping hover animations.");
        return;
      }

      // Add hover animations
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 0.9,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // Infinite background animation
      gsap.to(".button_wrap", {
        backgroundPosition: "100% 100%",
        repeat: -1,
        duration: 10,
        ease: "linear",
      });
    });

    // Behavior for mobile (animations disabled)
    mm.add("(max-width: 768px)", () => {
      console.log("Button animations disabled for mobile.");
    });
  })();

  // ==============================
  // Stagger Links on Hover 01
  // ==============================
  (function () {
    let splitText;

    function runSplit() {
      splitText = new SplitType("[stagger-link]", {
        types: "words, chars"
      });
    }

    runSplit();

    // Store window width for resize detection
    let windowWidth = window.innerWidth;

    // Reinitialize SplitType on window resize
    window.addEventListener("resize", function () {
      if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;
        splitText.revert();
        runSplit();
      }
    });

    // Select all elements with `stagger-link`
    const staggerLinks = document.querySelectorAll("[stagger-link]");

    staggerLinks.forEach((link) => {
      // Select the characters within `stagger-link-text`
      const letters = link.querySelectorAll("[stagger-link-text] .char");

      // Hover in animation (mouseenter)
      link.addEventListener("mouseenter", function () {
        gsap.to(letters, {
          yPercent: -100,
          duration: 0.5,
          ease: "power4.inOut",
          stagger: { each: 0.03, from: "start" }, // Stagger the animation from start
          overwrite: true
        });
      });

      // Hover out animation (mouseleave)
      link.addEventListener("mouseleave", function () {
        gsap.to(letters, {
          yPercent: 0,
          duration: 0.4,
          ease: "power4.inOut",
          stagger: { each: 0.03, from: "random" }, // Stagger the animation randomly
          overwrite: true
        });
      });
    });
  })();
});

// ==============================
  // Stagger Links on Hover 02
  // ==============================
  (function () {
    const menuButton = document.querySelector('.menu');

    if (menuButton) {
      // Set initial states
      gsap.set(".menu", { backgroundColor: "rgba(45, 57, 72, 0.8)" });
      gsap.set(".text_close_wrap", { opacity: 0, scale: 0.7 });

      // Hover animations for `.menu`
      menuButton.addEventListener("mouseenter", () => {
        if (menuButton.getAttribute("data-menu-state") === "hover") {
          gsap.to(".menu", {
            scale: 0.95,
            backgroundColor: "rgba(213, 220, 237, 1)",
            duration: 0.3,
            ease: "power2.out"
          });

          gsap.to(".menu_text.is--in .letter_menu", {
            y: -20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power4.out"
          });

          gsap.fromTo(".menu_text.is--out .letter_menu",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power4.out", delay: 0.15 }
          );
        }
      });

      // Reset hover animations on mouseleave
      menuButton.addEventListener("mouseleave", () => {
        if (menuButton.getAttribute("data-menu-state") === "hover") {
          gsap.to(".menu", {
            scale: 1,
            backgroundColor: "rgba(45, 57, 72, 0.8)",
            duration: 0.3,
            ease: "power2.out"
          });

          gsap.to(".menu_text.is--in .letter_menu", {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: "power4.out"
          });

          gsap.to(".menu_text.is--out .letter_menu", {
            y: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power4.out"
          });
        }
      });

      // Click event for `.menu` to trigger text animations and state change
      menuButton.addEventListener("click", () => {
        if (menuButton.getAttribute("data-menu-state") === "hover") {
          // Switch to "click" state and hide `.text_menu_wrap`
          menuButton.setAttribute("data-menu-state", "click");

          // Fade out `.text_menu_wrap` and change background color to rgba(0, 0, 0, 0.1)
          gsap.to(".menu", { backgroundColor: "rgba(0, 0, 0, 0.1)", duration: 0.5, ease: "power2.out" });
          gsap.to(".text_menu_wrap", { opacity: 0, duration: 0.3 });

          // Scale and fade in `.text_close_wrap`
          gsap.fromTo(".text_close_wrap",
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power4.out", delay: 0.1 }
          );

        } else {
          closeMenuAnimation();
        }
      });

      // Function to close the menu animation
      function closeMenuAnimation() {
        // Reset to "hover" state with a 0.9s delay for returning animations
        menuButton.setAttribute("data-menu-state", "hover");

        // Fade back `.menu` background to initial color, fade out `.text_close_wrap`, and scale down
        gsap.to(".menu", { backgroundColor: "rgba(45, 57, 72, 0.8)", duration: 0.5, ease: "power2.out" });
        gsap.to(".text_close_wrap", { opacity: 0, scale: 0.7, duration: 0.3 });

        // Fade back in `.text_menu_wrap` after 0.9s delay
        gsap.to(".text_menu_wrap", { opacity: 1, duration: 0.3, delay: 0.9 });

        // Reset `.menu_text` elements for hover state
        gsap.to(".menu_text.is--in .letter_menu", {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: "power4.out",
          delay: 0.9
        });
        gsap.to(".menu_text.is--out .letter_menu", {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power4.out",
          delay: 0.9
        });
      }

      // Add click event listeners to all `.link_container` elements
      document.querySelectorAll('.link_container').forEach(link => {
        link.addEventListener("click", () => {
          if (menuButton.getAttribute("data-menu-state") === "click") {
            // Trigger the same close animation as when clicking `.menu`
            closeMenuAnimation();
          }
        });
      });
    }
  })();

  // ==============================
  // Menu Trigger Animation
  // ==============================
  (function () {
    const rowDuration = 0.3;
    const h1Duration = 0.4;
    const decoMenuDuration = 0.5;
    const socialBlockDuration = 0.5;
    const splineWrapDuration = 1;
    const btnBlockDuration = 0.4;

    const menuTimeline = gsap.timeline({ paused: true, reversed: true });

    menuTimeline
      .set(".overlay_menu", { display: "block", visibility: "visible" })
      .fromTo(".menu_row", 
        { x: "-100%" }, 
        { x: "0%", duration: rowDuration, ease: "power4.out", stagger: { amount: 0.2, from: "random" } }
      )
      .from(".h-h1[data-stagger-menu]", 
        { y: 100, opacity: 0, duration: h1Duration, stagger: 0.1, ease: "power4.out" }
      )
      .from(".paragraph[data-deco-menu]", 
        { y: -100, opacity: 0, duration: decoMenuDuration, ease: "power4.out" }, "<")
      .fromTo(".social_block", 
        { opacity: 0, scale: 0.1 }, { opacity: 1, scale: 1, duration: socialBlockDuration, stagger: 0.2, ease: "power4.out" }, "<")
      .fromTo(".menu_spline_wrap", 
        { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: splineWrapDuration, ease: "power4.out" }, "<")
      .from(".btn_block", 
        { opacity: 0, y: 30, duration: btnBlockDuration, stagger: 0.3, ease: "power4.out" }, "<")
      .from(".button_divider_wrap", 
        { opacity: 0, duration: btnBlockDuration, stagger: 0.2, ease: "power4.out" }, "<");

    $(".menu").on("click", function () {
      if (menuTimeline.reversed()) {
        gsap.set(".overlay_menu", { display: "block" });
        menuTimeline.play();
      } else {
        menuTimeline.reverse().then(() => {
          gsap.set(".overlay_menu", { display: "none" });
        });
      }
    });

    $(".link_container").on("click", function () {
      if (!menuTimeline.reversed()) {
        menuTimeline.reverse().then(() => {
          gsap.set(".overlay_menu", { display: "none" });
        });
      }
    });
  })();

  // ==============================
  // Plans Button Animation
  // ==============================
  (function () {
    document.addEventListener("DOMContentLoaded", function() {
      const buttons = document.querySelectorAll('#button');

      buttons.forEach(button => {
        gsap.set(button.querySelectorAll(".button_text_in .button_block.is--in"), { y: 0, opacity: 1 });
        gsap.set(button.querySelectorAll(".button_text_out .button_block.is--out"), { y: 20, opacity: 0 });

        button.addEventListener("mouseenter", () => {
          gsap.to(button.querySelectorAll(".button_text_in .button_block.is--in"), {
            y: -20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.2,
            ease: "power4.out"
          });

          gsap.to(button.querySelectorAll(".button_text_out .button_block.is--out"), {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.2,
            ease: "power4.out"
          });

          gsap.to(button, {
            backgroundColor: "#964EFF",
            duration: 0.4,
            ease: "power2.out"
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button.querySelectorAll(".button_text_in .button_block.is--in"), {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.2,
            ease: "power4.out"
          });

          gsap.to(button.querySelectorAll(".button_text_out .button_block.is--out"), {
            y: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.2,
            ease: "power4.out"
          });

          gsap.to(button, {
            backgroundColor: "#2f2f2f",
            duration: 0.4,
            ease: "power2.out"
          });
        });
      });
    });
  })();

  // ==============================
  // Footer Button UP on Hover
  // ==============================
  (function () {
    gsap.set(".button-up_footer", { scale: 1 });
    gsap.set(".span_block_left, .span_block_right", { y: 20, autoAlpha: 0 });

    $(".button-up_footer").hover(
      function() {
        if (!gsap.isTweening(".button-up_footer")) {
          let tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 0.3, overwrite: "auto" } });
          tl.to(".button-up_footer", { scale: 0.9 })
            .to(".span_block_left", { y: 0, autoAlpha: 1, stagger: 0.05 }, "<")
            .to(".span_block_right", { y: 0, autoAlpha: 1, stagger: 0.05 }, "<0.3");
        }
      },
      function() {
        if (!gsap.isTweening(".button-up_footer")) {
          let tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 0.3, overwrite: "auto" } });
          tl.to(".button-up_footer", { scale: 1 })
            .to(".span_block_right", { y: 20, autoAlpha: 0, stagger: -0.05, clearProps: "y,autoAlpha" }, "<", "+=0.3")
            .to(".span_block_left", { y: 20, autoAlpha: 0, stagger: -0.05, clearProps: "y,autoAlpha" }, "<0.3");
        }
      }
    );
  })();

  // ==============================
  // Marquee Footer Reveal on Scroll
  // ==============================
  (function () {
    gsap.fromTo(".marquee_footer", 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: '[footer-marquee="true"]',
          start: "top 70%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        }
      }
    );
  })();
});
