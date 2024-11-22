document.addEventListener("DOMContentLoaded", function () {
  // Create a timeline
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  // Helper function for viewport checks
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Initialize SplitType only for desktop and tablet
  let h1Split;
  if (!isMobile()) {
    h1Split = new SplitType(".h-h1", { types: "words" });
    gsap.set(h1Split.words, { opacity: 0 }); // Hide words initially
    gsap.set(".block_support", { opacity: 0, y: 20 }); // Hide and offset support text
  }

  // Set initial styles for the triangle
  gsap.set(".spline_triangle", { opacity: 0, y: 200 });

  // Preloader Animation
  tl.to({}, {
    duration: 1.5,
    onUpdate: function () {
      document.querySelector("#counter").textContent =
        Math.round(this.progress() * 100) + "%";
    },
  });

  // Desktop/Tablet Preloader Columns Animation
  if (!isMobile()) {
    tl.to(".top_wrap .loader_col_02", {
      y: "-100%",
      transformOrigin: "bottom center",
      stagger: { amount: 0.2, from: "center" },
      duration: 0.6,
    });

    tl.to(
      ".bottom_wrap .loader_col_02",
      {
        y: "100%",
        transformOrigin: "top center",
        stagger: { amount: 0.2, from: "center" },
        duration: 0.6,
        onComplete: () => {
          gsap.set(".pre_loader_wrap", { display: "none" });
        },
      },
      "<"
    );
  } else {
    // For mobile, hide preloader without animation
    gsap.set(".pre_loader_wrap", { display: "none" });
  }

  // Triangle Animation (For all devices)
  tl.from(".spline_triangle", {
    opacity: 0,
    y: 200,
    duration: 2,
    ease: "power4.inOut",
  });

  // Desktop/Tablet Animations
  if (!isMobile()) {
    // Flicker effect for words
    tl.to(
      h1Split.words,
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.out",
        stagger: { amount: 0.5, from: "random" },
      },
      "<"
    );

    // Staggered reveal for .block_support
    tl.to(
      ".block_support",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.3,
      },
      "<"
    );

    // Button animation
    tl.from(
      "#shiny-cta",
      {
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
      },
      "<"
    );

    // Navbar reveal
    tl.from(
      ".nav",
      {
        y: -50,
        opacity: 0,
        duration: 0.75,
      },
      "+=0.1"
    );

    // Arrow container reveal
    tl.from(
      ".arrow_container",
      {
        opacity: 0,
        duration: 1.2,
      },
      "+=0.2"
    );
  }
});
