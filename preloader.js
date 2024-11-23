document.addEventListener("DOMContentLoaded", function () {
    try {
      console.log("Preloader script started");

      // Select preloader elements
      let preLoaderWrap = document.querySelector(".pre_loader_wrap");
      let headerH1 = document.querySelector(".h-h1");
      let counter = document.querySelector("#counter");

      if (!preLoaderWrap) {
        console.error("Missing .pre_loader_wrap");
        return;
      }

      // Initialize GSAP MatchMedia
      let matchMedia = gsap.matchMedia();

      // GSAP Timeline for preloader animations
      let preloaderTimeline = gsap.timeline({
        onComplete: function () {
          console.log("Preloader animation completed");
          preLoaderWrap.style.display = "none";
        },
      });

      // Counter animation
      preloaderTimeline.to({}, {
        duration: 1.5,
        onUpdate: function () {
          if (counter) {
            let progress = Math.round(100 * this.progress());
            counter.textContent = `${progress}%`;
          }
        },
      });

      // Fade-in elements
      preloaderTimeline
        .to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo"], {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, "+=0.5")
        .to("#line-left", { x: 0, opacity: 0.7, duration: 0.6, ease: "power2.out" }, "<")
        .to("#line-right", { x: 0, opacity: 0.7, duration: 0.6, ease: "power2.out" }, "<");

      // Fade-out elements
      preloaderTimeline
        .to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo", "#line-left", "#line-right"], {
          opacity: 0,
          duration: 0.5,
          ease: "power4.out"
        }, "+=0.1")
        .to(".top_wrap .loader_col_02", {
          y: "-100%",
          transformOrigin: "bottom center",
          stagger: { amount: 0.2, from: "center" },
          duration: 0.6,
          ease: "power3.out"
        }, "<")
        .to(".bottom_wrap .loader_col_02", {
          y: "100%",
          transformOrigin: "top center",
          stagger: { amount: 0.2, from: "center" },
          duration: 0.6,
          ease: "power3.out"
        }, "<");

      // Add desktop-specific animations
      matchMedia.add("(min-width: 768px)", () => {
        console.log("Running desktop animations");

        if (headerH1) {
          // Ensure .h-h1 starts visible without additional effects
          gsap.set(headerH1, { opacity: 1 });
        }
      });

      // Add mobile-specific animations
      matchMedia.add("(max-width: 767px)", () => {
        console.log("Skipping additional animations on mobile");

        // Ensure .h-h1 is visible on mobile without animations
        gsap.set(".h-h1", { opacity: 1 });
      });

      // Fallback timeout to hide preloader if animations fail
      setTimeout(() => {
        if (preLoaderWrap.style.display !== "none") {
          console.warn("Preloader forced to hide after timeout");
          gsap.set(preLoaderWrap, { display: "none" });
        }
      }, 8000);
    } catch (error) {
      console.error("Error in preloader script:", error);

      // Fallback in case of errors
      let preLoaderWrap = document.querySelector(".pre_loader_wrap");
      if (preLoaderWrap) {
        gsap.set(preLoaderWrap, { display: "none" });
      }
    }
  });
