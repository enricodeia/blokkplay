window.addEventListener("DOMContentLoaded", function () {
    // Initialize GSAP matchMedia for responsive breakpoints
    const mm = gsap.matchMedia();

    // Set initial styles for all elements
    const initialStates = () => {
      gsap.set([".stepper_01", ".stepper_02", ".stepper_03"], { opacity: 0.2 });
      gsap.set([".pyramid_01", ".pyramid_02", ".pyramid_03"], { opacity: 0 });
      gsap.set([".select_container_01", ".select_container_02", ".select_container_03"], { opacity: 0 });
      gsap.set(".line_on", { clipPath: "inset(0 100% 0 0)" }); // Hide the line initially
    };

    initialStates();

    // Function to create scroll-triggered animations
    const createAnimations = (isMobile) => {
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#stepper",
          start: "top top",
          end: isMobile ? "+=700%" : "+=700%",
          scrub: isMobile ? 1 : 1.5,
          pin: isMobile ? false : ".sticky_track_product",
          pinSpacing: !isMobile,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Shared animation logic for all breakpoints
      scrollTimeline
        .to(".line_on", { clipPath: "inset(0 83% 0 0)", duration: 1.5, ease: "power3.out" })
        .to(".stepper_01, .pyramid_01", { opacity: 1, stagger: 0.3, duration: isMobile ? 0.5 : 0.7, ease: "power3.out" }, 0.5)
        .to(".select_container_01", { opacity: 1, duration: isMobile ? 0.5 : 0.8 }, 0.5)
        .to(".line_on", { clipPath: "inset(0 50% 0 0)", duration: 1.5, ease: "expo.out" }, 1.5)
        .to([".stepper_01", ".pyramid_01"], { opacity: 0.3, duration: isMobile ? 0.5 : 0.7 }, 1.5)
        .to([".stepper_02", ".pyramid_02"], { opacity: 1, stagger: 0.3, duration: isMobile ? 0.5 : 0.7, ease: "power3.out" }, 1.7)
        .to(".select_container_02", { opacity: 1, duration: isMobile ? 0.5 : 0.8 }, 1.7)
        .to(".line_on", { clipPath: "inset(0 17% 0 0)", duration: 1.5, ease: "expo.out" }, 3)
        .to([".stepper_02", ".pyramid_02"], { opacity: 0.3, duration: isMobile ? 0.5 : 0.7 }, 3)
        .to([".stepper_03", ".pyramid_03"], { opacity: 1, stagger: 0.3, duration: isMobile ? 0.5 : 0.7, ease: "power3.out" }, 3.2)
        .to(".select_container_03", { opacity: 1, duration: isMobile ? 0.5 : 0.8 }, 3.2)
        .to(".line_on", { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power3.out" }, 4.5);

      ScrollTrigger.refresh();
    };

    // Define breakpoints for desktop and mobile
    mm.add("(min-width: 768px)", () => createAnimations(false)); // Desktop and tablet
    mm.add("(max-width: 767px)", () => createAnimations(true)); // Mobile
  });
