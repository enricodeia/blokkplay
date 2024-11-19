window.onload = function () {
  // Re-split the text every time to reset animations on page refresh
  const splitTitle = new SplitType('.h-h1', { types: 'words' });

  // Create isolated GSAP timeline for preloader animations
  const tl = gsap.timeline({
    onComplete: () => {
      // Restore scrolling once preloader finishes
      document.body.style.overflow = '';
    }
  });

  // Prevent scrolling while the preloader is running
  document.body.style.overflow = 'hidden';

  // Counter animation (1.5 seconds)
  tl.to({}, {
    duration: 1.5,
    onUpdate: function () {
      const counterElem = document.querySelector('#counter');
      if (counterElem) {
        counterElem.textContent = Math.round(this.progress() * 100) + '%';
      }
    }
  });

  // Animate .loader_col_01 (staggered from center, shared logic)
  const sharedAnimation = {
    scaleY: 0,
    stagger: { amount: 0.2, from: 'center' },
    duration: 0.5,
    ease: 'power3.out',
  };

  tl.to('.top_wrap .loader_col_01', {
    ...sharedAnimation,
    transformOrigin: 'bottom center',
  }, "<");

  tl.to('.bottom_wrap .loader_col_01', {
    ...sharedAnimation,
    transformOrigin: 'top center',
  }, "<");

  // Fade-in for specified elements
  tl.to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo"], {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out",
  }, "+=0.5")
    .to(".line_left", { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "<")
    .to(".line_right", { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "<");

  // Fade-out elements and animate .loader_col_02 (apply shared animation logic)
  tl.to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo", ".line_left", ".line_right"], {
    opacity: 0,
    duration: 0.5,
    ease: "power4.out",
  }, "+=0.1");

  tl.to('.top_wrap .loader_col_02', {
    y: '-100%',
    stagger: { amount: 0.2, from: 'center' },
    duration: 0.6,
    ease: 'power3.out',
  }, "<");

  tl.to('.bottom_wrap .loader_col_02', {
    y: '100%',
    stagger: { amount: 0.2, from: 'center' },
    duration: 0.6,
    ease: 'power3.out',
    onComplete: () => {
      // Hide preloader without layout shift
      gsap.set('.pre_loader_wrap', { visibility: 'hidden', opacity: 0 });
    }
  }, "<");

  // Title animation for .h-h1
  tl.from(splitTitle.words, {
    opacity: 0,
    y: 20,
    duration: 1.2,
    stagger: { amount: 0.4, from: 'center' },
    ease: 'power3.out',
  }, "<");
};
