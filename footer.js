window.addEventListener('load', () => {
  // ==========================
  // Initial Setup
  // ==========================
  requestAnimationFrame(() => {
    gsap.set(".button-up_footer", { scale: 1 });
    gsap.set(".span_block_left, .span_block_right", { y: 20, autoAlpha: 0 });
  });

  // ==========================
  // Button Hover Animation
  // ==========================
  $(".button-up_footer").hover(
    function () {
      if (!gsap.isTweening(".button-up_footer")) {
        let tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 0.3, overwrite: "auto" } });
        tl.to(".button-up_footer", { scale: 0.9 })
          .to(".span_block_left", { y: 0, autoAlpha: 1, stagger: 0.05 }, "<")
          .to(".span_block_right", { y: 0, autoAlpha: 1, stagger: 0.05 }, "<0.3");
      }
    },
    function () {
      if (!gsap.isTweening(".button-up_footer")) {
        let tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 0.3, overwrite: "auto" } });
        tl.to(".button-up_footer", { scale: 1 })
          .to(".span_block_right", { y: 20, autoAlpha: 0, stagger: -0.05, clearProps: "y,autoAlpha" }, "<", "+=0.3")
          .to(".span_block_left", { y: 20, autoAlpha: 0, stagger: -0.05, clearProps: "y,autoAlpha" }, "<0.3");
      }
    }
  );

  // ==========================
  // Marquee Footer Reveal on Scroll
  // ==========================
  requestAnimationFrame(() => {
    gsap.fromTo(
      ".marquee_footer",
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
    ScrollTrigger.refresh();
  });
});
