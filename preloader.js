window.onload = function() {
  const tl = gsap.timeline();

  // Initialize SplitType with word-based split for .h-h1
  const h1Split = new SplitType('.h-h1', { types: 'words' });

  // Ensure text starts hidden
  gsap.set(h1Split.words, { opacity: 0 });
  gsap.set(".block_support", { opacity: 0, y: 20 }); // Start .block_support elements hidden and offset by 20px

  // Counter animation
  tl.to({}, {
    duration: 1.5,
    onUpdate: function() {
      document.querySelector('#counter').textContent = Math.round(this.progress() * 100) + '%';
    }
  });

  // Animate .loader_col_01 (both top_wrap and bottom_wrap)
  tl.to(".top_wrap .loader_col_01", {
    scaleY: 0,
    transformOrigin: "top center", // Mimic bottom_wrap animation
    stagger: { amount: 0.2, from: "center" },
    duration: 0.5,
    ease: "power3.out"
  }, "<");

  tl.to(".bottom_wrap .loader_col_01", {
    scaleY: 0,
    transformOrigin: "top center", // Matches top_wrap
    stagger: { amount: 0.2, from: "center" },
    duration: 0.5,
    ease: "power3.out"
  }, "<");

  // Fade-in main elements
  tl.to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo"], {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out"
  }, "+=0.5")
    .to("#line-left", { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "<")
    .to("#line-right", { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "<");

  // Fade-out pre-loader elements and animate .loader_col_02
  tl.to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo", "#line-left", "#line-right"], {
    opacity: 0,
    duration: 0.5,
    ease: "power4.out"
  }, "+=0.1");

  // Animate .loader_col_02 (top_wrap copies bottom_wrap)
  tl.to(".top_wrap .loader_col_02", {
    y: "100%", // Mimics bottom_wrap behavior
    transformOrigin: "top center",
    stagger: { amount: 0.2, from: "center" },
    duration: 0.6,
    ease: "power3.out"
  }, "<");

  tl.to(".bottom_wrap .loader_col_02", {
    y: "100%", // Matches top_wrap
    transformOrigin: "top center",
    stagger: { amount: 0.2, from: "center" },
    duration: 0.6,
    ease: "power3.out",
    onComplete: () => {
      gsap.set(".pre_loader_wrap", { display: "none" });
    }
  }, "<");

  // Flicker effect for .h-h1 (words)
  tl.to(h1Split.words, {
    opacity: 1,
    duration: 1.2,
    ease: "power1.out",
    stagger: { amount: 0.5, from: "random" }
  }, "<");

  // Staggered reveal for .block_support elements
  tl.to(".block_support", {
    opacity: 1,
    y: 0, // Move to final position
    duration: 0.8,
    ease: "power1.out",
    stagger: 0.3 // Stagger each line sequentially
  }, "<");

  // Spline triangle animation
  tl.from(".spline_triangle", {
    opacity: 0,
    y: 200,
    duration: 2,
    ease: "power4.inOut" // Smooth ease
  }, "<");

  // Button reveal animation
  tl.from("#shiny-cta", {
    opacity: 0,
    scale: 0.9,
    duration: 1.2,
    ease: "power2.out"
  }, "<");

  // Navbar animation
  tl.from(".nav", {
    y: -50,
    opacity: 0,
    duration: 0.75,
    ease: "power4.out"
  }, "+=0.01");

  // Arrow container animation
  tl.from(".arrow_container", {
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
  }, "+=0.2");
};
