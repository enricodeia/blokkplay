// Unified Script File for Multiple Canvas Animations and Effects

document.addEventListener("DOMContentLoaded", function() {

  // ==================== SplitText Initialization ====================
  let splitText;
  function runSplit() {
    splitText = new SplitType("[stagger-link]", {
      types: "words, chars" // Split the text into words and characters
    });
  }
  runSplit();

  // Reinitialize SplitType on Window Resize
  let windowWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    if (windowWidth !== window.innerWidth) {
      windowWidth = window.innerWidth;
      splitText.revert();
      runSplit();
    }
  });

  // ==================== Hover Animation for Stagger Links ====================
  const staggerLinks = document.querySelectorAll("[stagger-link]");
  staggerLinks.forEach((link) => {
    const letters = link.querySelectorAll("[stagger-link-text] .char");
    link.addEventListener("mouseenter", () => {
      gsap.to(letters, {
        yPercent: -100,
        duration: 0.5,
        ease: "power4.inOut",
        stagger: { each: 0.03, from: "start" },
        overwrite: "auto"
      });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(letters, {
        yPercent: 0,
        duration: 0.4,
        ease: "power4.inOut",
        stagger: { each: 0.03, from: "random" },
        overwrite: "auto"
      });
    });
  });

  // ==================== Menu Button Hover and Click Animations ====================
  const menuButton = document.querySelector('.menu');
  if (menuButton) {
    const menuState = {
      HOVER: "hover",
      CLICK: "click"
    };

    gsap.set(".menu", { backgroundColor: "rgba(45, 57, 72, 0.8)" });
    gsap.set(".text_close_wrap", { opacity: 0, scale: 0.7 });

    menuButton.addEventListener("mouseenter", () => {
      if (menuButton.getAttribute("data-menu-state") === menuState.HOVER) {
        gsap.to(".menu", {
          scale: 0.95,
          backgroundColor: "rgba(213, 220, 237, 1)",
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(".menu_text.is--in .letter_menu", {
          y: -20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power4.out"
        });
        gsap.fromTo(".menu_text.is--out .letter_menu",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power4.out", delay: 0.15 }
        );
      }
    });

    menuButton.addEventListener("mouseleave", () => {
      if (menuButton.getAttribute("data-menu-state") === menuState.HOVER) {
        gsap.to(".menu", {
          scale: 1,
          backgroundColor: "rgba(45, 57, 72, 0.8)",
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(".menu_text.is--in .letter_menu", {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: "power4.out"
        });
        gsap.to(".menu_text.is--out .letter_menu", {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power4.out"
        });
      }
    });

    menuButton.addEventListener("click", () => {
      if (menuButton.getAttribute("data-menu-state") === menuState.HOVER) {
        menuButton.setAttribute("data-menu-state", menuState.CLICK);
        gsap.to(".menu", { backgroundColor: "rgba(0, 0, 0, 0.1)", duration: 0.5, ease: "power2.out" });
        gsap.to(".text_menu_wrap", { opacity: 0, duration: 0.3 });
        gsap.fromTo(".text_close_wrap",
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power4.out", delay: 0.1 }
        );
      } else {
        closeMenuAnimation();
      }
    });

    function closeMenuAnimation() {
      menuButton.setAttribute("data-menu-state", menuState.HOVER);
      gsap.to(".menu", { backgroundColor: "rgba(45, 57, 72, 0.8)", duration: 0.5, ease: "power2.out" });
      gsap.to(".text_close_wrap", { opacity: 0, scale: 0.7, duration: 0.3 });
      gsap.to(".text_menu_wrap", { opacity: 1, duration: 0.3, delay: 0.9 });
      gsap.to(".menu_text.is--in .letter_menu", {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.6,
        ease: "power4.out",
        delay: 0.9
      });
      gsap.to(".menu_text.is--out .letter_menu", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power4.out",
        delay: 0.9
      });
    }

    document.querySelectorAll('.link_container').forEach(link => {
      link.addEventListener("click", () => {
        if (menuButton.getAttribute("data-menu-state") === menuState.CLICK) {
          closeMenuAnimation();
        }
      });
    });
  }

  // ==================== Menu Trigger Animation ====================
  const menuTimeline = gsap.timeline({ paused: true, reversed: true });
  menuTimeline
    .set(".overlay_menu", { display: "block", visibility: "visible" })
    .fromTo(".menu_row", 
      { x: "-100%" }, 
      { x: "0%", duration: 0.3, ease: "power4.out", stagger: { amount: 0.2, from: "random" } }
    )
    .from(".h-h1[data-stagger-menu]", 
      { y: 100, opacity: 0, duration: 0.4, stagger: 0.1, ease: "power4.out" }
    )
    .from(".paragraph[data-deco-menu]", 
      { y: -100, opacity: 0, duration: 0.5, ease: "power4.out" }, "<")
    .fromTo(".social_block", 
      { opacity: 0, scale: 0.1 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.2, ease: "power4.out" }, "<")
    .fromTo(".menu_spline_wrap", 
      { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "<")
    .from(".btn_block", 
      { opacity: 0, y: 30, duration: 0.4, stagger: 0.3, ease: "power4.out" }, "<")
    .from(".button_divider_wrap", 
      { opacity: 0, duration: 0.4, stagger: 0.2, ease: "power4.out" }, "<");

  document.querySelector(".menu").addEventListener("click", function () {
    if (menuTimeline.reversed()) {
      gsap.set(".overlay_menu", { display: "block" });
      menuTimeline.play();
    } else {
      menuTimeline.reverse().then(() => {
        gsap.set(".overlay_menu", { display: "none" });
      });
    }
  });

  document.querySelectorAll(".link_container").forEach(link => {
    link.addEventListener("click", function () {
      if (!menuTimeline.reversed()) {
        menuTimeline.reverse().then(() => {
          gsap.set(".overlay_menu", { display: "none" });
        });
      }
    });
  });
});

