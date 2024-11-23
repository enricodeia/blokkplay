document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const TOTAL_SHAPES = 100;
  const SHAPE_SIZE = 5;
  const SHAPE_TYPES = ['circle', 'square', 'triangle', 'x'];
  const SHAPE_COLOR = { r: 255, g: 255, b: 255 };
  const BG_COLOR = '#7D63F4';
  let mouseX = canvas.width / 2, mouseY = canvas.height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const shapes = Array.from({ length: TOTAL_SHAPES }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
    size: SHAPE_SIZE,
    opacity: Math.random() * 0.5 + 0.3,
    speed: Math.random() * 1 + 0.5
  }));

  function drawShape(shape) {
    ctx.strokeStyle = `rgba(${SHAPE_COLOR.r},${SHAPE_COLOR.g},${SHAPE_COLOR.b},${shape.opacity})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (shape.type === 'circle') {
      ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
    } else if (shape.type === 'square') {
      ctx.rect(shape.x - shape.size, shape.y - shape.size, shape.size * 2, shape.size * 2);
    } else if (shape.type === 'triangle') {
      ctx.moveTo(shape.x, shape.y - shape.size);
      ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
      ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
      ctx.closePath();
    } else if (shape.type === 'x') {
      ctx.moveTo(shape.x - shape.size, shape.y - shape.size);
      ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
      ctx.moveTo(shape.x + shape.size, shape.y - shape.size);
      ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
    }
    ctx.stroke();
  }

  function animate() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
      shape.y -= shape.speed;
      if (shape.y < 0) shape.y = canvas.height;
      shape.x += (mouseX - canvas.width / 2) * 0.0005 * shape.speed;
      shape.y += (mouseY - canvas.height / 2) * 0.0005 * shape.speed;
      drawShape(shape);
    });
    requestAnimationFrame(animate);
  }

  animate();
});


// ==============================
// Bento Container on Hover
// ==============================
$(".inner_bento_container").each(function () {
  const $this = $(this);
  let scaleValue;

  // Define scaling values for different bento classes
  if ($this.hasClass("is--bento_01") || $this.hasClass("is--bento_02") || $this.hasClass("is--bento_05")) {
    scaleValue = 0.98;  // Subtle scale for wider bento containers
  } else {
    scaleValue = 0.95;  // Slightly larger scale-down for other containers
  }

  // Smooth scale effect on mouse enter
  $this.on("mouseenter", function () {
    gsap.to(this, {
      scale: scaleValue,       // Apply the specific scale value
      duration: 0.3,           // Duration of scale-down
      ease: "power1.out",      // Smooth easing for entry
      transformOrigin: "center center",
      overwrite: "auto"
    });
  });

  // Smooth scale back to original on mouse leave
  $this.on("mouseleave", function () {
    gsap.to(this, {
      scale: 1,                 // Reset scale
      duration: 0.5,            // Slightly longer duration for smoothness
      ease: "power1.inOut",     // Smooth easing for exit
      overwrite: "auto"
    });
  });
});


// ==============================
// Bento Card on Hover
// ==============================
$(".bento_03").hover(
  function() {
    // Mouse Enter Animation
    gsap.to(".blokkplay_card_wrap", { 
      rotation: 12, 
      scale: 1.2, 
      x: -30, 
      ease: "power4.out", 
      duration: 0.5 
    });
    gsap.to(".blurry_bento", { 
      scale: 2, 
      ease: "power4.out", 
      duration: 0.5 
    });
  },
  function() {
    // Mouse Leave Animation (Reverses)
    gsap.to(".blokkplay_card_wrap", { 
      rotation: 0, 
      scale: 1, 
      x: 0, 
      ease: "power4.out", 
      duration: 0.5 
    });
    gsap.to(".blurry_bento", { 
      scale: 1, 
      ease: "power4.out", 
      duration: 0.5 
    });
  }
);


// ==============================
// Bento Radar Animation
// ==============================
document.addEventListener("DOMContentLoaded", function() {
  const radarDuration = 6.8; // Full radar rotation time
  const blockAnimationDuration = radarDuration / 2; // Blocks animate for 3 seconds
  const fadeInDuration = 0.6; // Each block takes 0.6s to fade in
  const staggerDelay = 0.2; // Delay between block fade-ins
  const fadeOutDuration = 0.6; // Smooth fade-out duration for all blocks
  const pauseDuration = blockAnimationDuration - (fadeInDuration * 4 + staggerDelay * 3 + fadeOutDuration); // Pause to fill the timing gap

  // Radar rotation for `.radar_anim`
  gsap.to(".radar_anim", {
    rotation: 360,
    duration: radarDuration,
    ease: "linear",
    repeat: -1 // Infinite loop
  });

  // Radar block animation linked to radar timing
  const blockTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0 }); // Matches radar's infinite loop
  blockTimeline
    .to({}, { duration: radarDuration / 2 }) // Wait for the first half of the radar rotation (blocks invisible)
    // Fade in blocks sequentially
    .to(".radar_block.is--01", { opacity: 1, duration: fadeInDuration, ease: "power2.out" })
    .to(".radar_block.is--02", { opacity: 1, duration: fadeInDuration, ease: "power2.out" }, `-=${staggerDelay}`)
    .to(".radar_block.is--03", { opacity: 1, duration: fadeInDuration, ease: "power2.out" }, `-=${staggerDelay}`)
    .to(".radar_block.is--04", { opacity: 1, duration: fadeInDuration, ease: "power2.out" }, `-=${staggerDelay}`)
    // Pause when all blocks are fully visible
    .to({}, { duration: pauseDuration })
    // Fade out all blocks together smoothly
    .to(".radar_block", { opacity: 0, duration: fadeOutDuration, ease: "power2.in" });
});
