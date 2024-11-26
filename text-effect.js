document.addEventListener("DOMContentLoaded", function () {
  // Existing opacity animation
  let e = [...document.querySelectorAll(".h-h2, .h-h3")],
    t = [];
  function n() {
    for (let e = 0; e < t.length; e++) {
      if (t[e].parentElement.getBoundingClientRect().top < 0.9 * window.innerHeight) {
        let { left: n, top: o } = t[e].getBoundingClientRect(),
          l = 1 - (0.01 * (o -= 0.9 * window.innerHeight) + 0.001 * n);
        l = l < 0.1 ? 0.1 : l > 1 ? 1 : l;
        t[e].style.opacity = l.toFixed(3);
      } else t[e].style.opacity = 0.1;
    }
  }
  e.forEach((e) => {
    let t = e.textContent.split(""),
      n = "";
    t.forEach((e) => {
      n += `<span style="opacity:0.1;">${e}</span>`;
    });
    e.innerHTML = n;
  });
  t = [...document.querySelectorAll(".h-h2 span, .h-h3 span")];
  window.addEventListener("scroll", n);
  n();

  // Existing eyebrow random animation
  let o = document.querySelectorAll("[eyebrow_random]");
  o.forEach((e) => {
    let t = e.querySelector("[eyebrow_split]");
    if (!t) {
      console.error("Element with attribute `eyebrow_split` not found.");
      return;
    }
    let n = t.textContent;
    t.innerHTML = n
      .split(/\s+/)
      .map((e) =>
        e
          .split("")
          .map(
            (e) =>
              `<span style="opacity: 0; display: inline-block;">${e}</span>`
          )
          .join("")
      )
      .join(" ");
    let o = t.querySelectorAll("span");
    gsap
      .timeline({
        scrollTrigger: {
          trigger: e,
          start: "top 70%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      })
      .fromTo(
        o,
        { opacity: 0 },
        { opacity: 1, duration: 0.1, stagger: { each: 0.05, from: "random" }, ease: "power1.inOut" }
      );
  });

  // New .number_games_wrp animation
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".number_games_wrp",
      start: "top 90%", // Trigger when .number_games_wrp reaches 10% from the bottom
      toggleActions: "play reverse play reverse", // Enable forward and reverse animation
    },
  });

  tl.from(".number_games_wrp .number_block", {
    y: 500, // Moves each block from y: 500
    ease: "power4.out", // Smooth easing for entry
    stagger: { each: 0.15 }, // Sequentially animates each block
  });
});
