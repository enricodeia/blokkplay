document.addEventListener("DOMContentLoaded", function () {
    // Initialize SplitType for text splitting
    const textSelectors = ['#eyebrow_01', '#title_01', '#paragraph_01',
                           '#eyebrow_02', '#title_02', '#paragraph_02',
                           '#eyebrow_03', '#title_03', '#paragraph_03'];
    
    textSelectors.forEach(selector => {
      new SplitType(selector, { types: 'words, chars', tagName: 'span' });
    });

    // Define timing ranges for desktop and mobile
    const stepTimings = {
      desktop: [
        { start: "8%", end: "25%" },   // Step 1 for Desktop
        { start: "28%", end: "49%" },  // Step 2 for Desktop
        { start: "50%", end: "70%" }   // Step 3 for Desktop
      ],
      mobile: [
        { start: "6%", end: "25%" },   // Step 1 for Mobile
        { start: "32%", end: "48%" },  // Step 2 for Mobile
        { start: "50%", end: "80%" }  // Step 3 for Mobile
      ]
    };

    // Function to animate each step
    function animateStepContent(stepIndex, timing) {
      const arrowId = `#arrow_0${stepIndex}`;
      const eyebrowId = `#eyebrow_0${stepIndex}`;
      const titleId = `#title_0${stepIndex}`;
      const paragraphId = `#paragraph_0${stepIndex}`;

      gsap.timeline({
        scrollTrigger: {
          trigger: "#stepper",
          start: `${timing.start}`,
          end: `${timing.end}`,
          scrub: true,
          toggleActions: "play none none reverse"
        }
      })
      // Arrow animation
      .fromTo(arrowId, { opacity: 0, rotation: 45 }, { opacity: 1, rotation: 0, duration: 0.5, ease: "power2.out" }, 0)
      // Text animations
      .fromTo(`${eyebrowId} .word`, { opacity: 0, blur: 10 }, { opacity: 1, blur: 0, stagger: 0.1, duration: 0.4 }, 0)
      .fromTo(`${titleId} .word`, { opacity: 0, blur: 10 }, { opacity: 1, blur: 0, stagger: 0.1, duration: 0.4 }, 0.1)
      .fromTo(`${paragraphId} .char`, { opacity: 0, blur: 10 }, { opacity: 1, blur: 0, stagger: 0.05, duration: 0.4 }, 0.2)
      // Fade out everything for transition to the next step
      .to([arrowId, eyebrowId, titleId, paragraphId], { opacity: 0, duration: 0.5 }, `+=${(parseFloat(timing.end) - parseFloat(timing.start)) / 2}%`);
    }

    // Setup GSAP matchMedia
    let mm = gsap.matchMedia();

    // Desktop version (min-width: 768px)
    mm.add("(min-width: 768px)", () => {
      stepTimings.desktop.forEach((timing, index) => {
        animateStepContent(index + 1, timing); // Animate steps 1, 2, 3 for Desktop
      });
    });

    // Mobile version (max-width: 767px)
    mm.add("(max-width: 767px)", () => {
      stepTimings.mobile.forEach((timing, index) => {
        animateStepContent(index + 1, timing); // Animate steps 1, 2, 3 for Mobile
      });
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  });
