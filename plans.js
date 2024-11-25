// ==========================
// Script 1: Plans Button Animation
// ==========================
document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll('#button');

  buttons.forEach(button => {
    gsap.set(button.querySelectorAll(".button_text_in .button_block.is--in"), { y: 0, opacity: 1 });
    gsap.set(button.querySelectorAll(".button_text_out .button_block.is--out"), { y: 20, opacity: 0 });

    button.addEventListener("mouseenter", () => {
      gsap.to(button.querySelectorAll(".button_text_in .button_block.is--in"), {
        y: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: "power4.out"
      });

      gsap.to(button.querySelectorAll(".button_text_out .button_block.is--out"), {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.2,
        ease: "power4.out"
      });

      gsap.to(button, {
        backgroundColor: "#964EFF",
        duration: 0.4,
        ease: "power2.out"
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button.querySelectorAll(".button_text_in .button_block.is--in"), {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.2,
        ease: "power4.out"
      });

      gsap.to(button.querySelectorAll(".button_text_out .button_block.is--out"), {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: "power4.out"
      });

      gsap.to(button, {
        backgroundColor: "#2f2f2f",
        duration: 0.4,
        ease: "power2.out"
      });
    });
  });
});

// ==========================
// Script 2: Cards Reveal Animation on Mobile
// ==========================
gsap.matchMedia().add("(max-width: 767px)", () => {
  const wastedScroll = 300;
  const revealDuration = 5;
  const holdDuration = 20;
  const gapBetweenCards = 5;
  const totalScroll = 300 - wastedScroll;

  const startLeft = wastedScroll;
  const holdLeft = startLeft + revealDuration;
  const endLeft = holdLeft + holdDuration;

  const startCenter = endLeft + gapBetweenCards;
  const holdCenter = startCenter + revealDuration;
  const endCenter = holdCenter + holdDuration;

  const startRight = endCenter + gapBetweenCards;
  const holdRight = startRight + revealDuration;
  const endRight = holdRight + holdDuration;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "[cards-mobile]",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    }
  });

  tl
    .fromTo(".card.is--left", { opacity: 1, display: "block" }, { opacity: 1, ease: "none" }, `${startLeft}%`)
    .to(".card.is--left", { opacity: 0, ease: "none", onComplete: () => $(".card.is--left").css("display", "none"), onReverseComplete: () => $(".card.is--left").css("display", "block") }, `${endLeft}%`)
    .fromTo(".card.is--center", { opacity: 0, display: "none" }, { opacity: 1, ease: "none", onStart: () => $(".card.is--center").css("display", "block") }, `${startCenter}%`)
    .to(".card.is--center", { opacity: 1, ease: "none" }, `${holdCenter}%`)
    .to(".card.is--center", { opacity: 0, ease: "none", onComplete: () => $(".card.is--center").css("display", "none"), onReverseComplete: () => $(".card.is--center").css("display", "block") }, `${endCenter}%`)
    .fromTo(".card.is--right", { opacity: 0, display: "none" }, { opacity: 1, ease: "none", onStart: () => $(".card.is--right").css("display", "block") }, `${startRight}%`)
    .to(".card.is--right", { opacity: 1, ease: "none" }, `${holdRight}%`);
});
