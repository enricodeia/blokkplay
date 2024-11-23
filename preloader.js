window.onload = function () {
    const preLoaderWrap = document.querySelector(".pre_loader_wrap");
    const counter = document.querySelector("#counter");
    const h1Split = new SplitType('.h-h1', { types: 'words' });

    // Ensure text and other elements start hidden
    gsap.set(h1Split.words, { opacity: 0 });
    gsap.set(".pre_loader_wrap", { display: "block" });

    // GSAP Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        console.log("Preloader animation completed");
        gsap.set(preLoaderWrap, { display: "none" });
      }
    });

    // Counter animation
    tl.to({}, {
      duration: 1.5,
      onUpdate: function () {
        if (counter) {
          counter.textContent = Math.round(this.progress() * 100) + '%';
        }
      }
    });

    // Loader columns animation
    tl.to(".top_wrap .loader_col_01", {
      scaleY: 0,
      transformOrigin: "bottom center",
      stagger: { amount: 0.2, from: "center" },
      duration: 0.5,
      ease: "power3.out"
    }, "<");

    tl.to(".bottom_wrap .loader_col_01", {
      scaleY: 0,
      transformOrigin: "top center",
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

    // Fade-out pre-loader elements and animate loader column 02
    tl.to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo", "#line-left", "#line-right"], {
      opacity: 0,
      duration: 0.5,
      ease: "power4.out"
    }, "+=0.1");

    tl.to(".top_wrap .loader_col_02", {
      y: "-100%",
      transformOrigin: "bottom center",
      stagger: { amount: 0.2, from: "center" },
      duration: 0.6,
      ease: "power3.out"
    }, "<");

    tl.to(".bottom_wrap .loader_col_02", {
      y: "100%",
      transformOrigin: "top center",
      stagger: { amount: 0.2, from: "center" },
      duration: 0.6,
      ease: "power3.out"
    }, "<");

    // Navbar animation
    tl.from(".nav", {
      y: -50,
      opacity: 0,
      duration: 0.75,
      ease: "power4.out"
    }, "+=0.01");

    // Arrow container animation after nav animation
    tl.from(".arrow_container", {
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    }, "+=0.2");
  };
