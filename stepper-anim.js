 document.addEventListener("DOMContentLoaded", function () {
    // **SplitType Setup per Text Stepper**
    const textSelectors = [
      "#eyebrow_01", "#title_01", "#paragraph_01",
      "#eyebrow_02", "#title_02", "#paragraph_02",
      "#eyebrow_03", "#title_03", "#paragraph_03"
    ];

    textSelectors.forEach(selector => {
      new SplitType(selector, { types: "words, chars", tagName: "span" });
    });

    // **Timing Ranges per Animazioni Responsive**
    const stepTimings = {
      desktop: [
        { start: "8%", end: "25%" },  // Step 1 per Desktop
        { start: "28%", end: "49%" }, // Step 2 per Desktop
        { start: "50%", end: "70%" }  // Step 3 per Desktop
      ],
      mobile: [
        { start: "10%", end: "35%" }, // Step 1 per Mobile
        { start: "36%", end: "55%" }, // Step 2 per Mobile
        { start: "56%", end: "80%" }  // Step 3 per Mobile
      ]
    };

    // Funzione per animare il contenuto di ogni step
    const animateStepContent = (stepIndex, timing) => {
      const arrowId = `#arrow_0${stepIndex}`;
      const eyebrowId = `#eyebrow_0${stepIndex}`;
      const titleId = `#title_0${stepIndex}`;
      const paragraphId = `#paragraph_0${stepIndex}`;

      gsap.timeline({
        scrollTrigger: {
          trigger: "#stepper",
          start: timing.start,
          end: timing.end,
          scrub: true,
          toggleActions: "play none none reverse"
        }
      })
        .fromTo(arrowId, { opacity: 0, rotation: 45 }, { opacity: 1, rotation: 0, duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(`${eyebrowId} .word`, { opacity: 0, blur: 10 }, { opacity: 1, blur: 0, stagger: 0.1, duration: 0.4 }, 0)
        .fromTo(`${titleId} .word`, { opacity: 0, blur: 10 }, { opacity: 1, blur: 0, stagger: 0.1, duration: 0.4 }, 0.1)
        .fromTo(`${paragraphId} .char`, { opacity: 0, blur: 10 }, { opacity: 1, blur: 0, stagger: 0.05, duration: 0.4 }, 0.2)
        .to([arrowId, eyebrowId, titleId, paragraphId], { opacity: 0, duration: 0.5 }, "+=0.5");
    };

    // **Setup GSAP MatchMedia per Breakpoint Responsive**
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      stepTimings.desktop.forEach((timing, index) => {
        animateStepContent(index + 1, timing);
      });
    });

    mm.add("(max-width: 767px)", () => {
      stepTimings.mobile.forEach((timing, index) => {
        animateStepContent(index + 1, timing);
      });
    });

    // **Animazioni dello Stepper e Linea**
    const setInitialStates = () => {
      gsap.set([".stepper_01", ".stepper_02", ".stepper_03"], { opacity: 0.2 });
      gsap.set([".pyramid_01", ".pyramid_02", ".pyramid_03"], { opacity: 0 });
      gsap.set([".select_container_01", ".select_container_02", ".select_container_03"], { opacity: 0 });
      gsap.set(".line_on", { clipPath: "inset(0 100% 0 0)" });
    };

    setInitialStates();

    const createStepperAnimations = (isMobile) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#stepper",
          start: "top top",
          end: "+=700%",
          scrub: isMobile ? 1 : 1.5,
          pin: isMobile ? false : ".sticky_track_product",
          pinSpacing: !isMobile,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to(".line_on", { clipPath: "inset(0 83% 0 0)", duration: 1.5, ease: "power3.out" })
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

    mm.add("(min-width: 768px)", () => createStepperAnimations(false));
    mm.add("(max-width: 767px)", () => createStepperAnimations(true));

    // **Rinfresca GSAP ScrollTrigger**
    ScrollTrigger.refresh();
  });
