document.addEventListener("DOMContentLoaded", function() {
  
  // === Intro Heading on Scroll ===
  
  let elements = [...document.querySelectorAll(".h-h2, .h-h3")];
  let spans = [];

  elements.forEach(element => {
    let charArray = element.textContent.split("");  
    let htmlString = "";
    charArray.forEach(char => {
      htmlString += `<span style="opacity:0.1;">${char}</span>`;  
    });
    element.innerHTML = htmlString;  
  });

  spans = [...document.querySelectorAll(".h-h2 span, .h-h3 span")];  

  function revealSpans() {
    for (let i = 0; i < spans.length; i++) {
      let parentRect = spans[i].parentElement.getBoundingClientRect();
      
      if (parentRect.top < window.innerHeight * 0.9) {
        let { left, top } = spans[i].getBoundingClientRect();
        top = top - (window.innerHeight * 0.9);

        let opacityValue = 1 - ((top * 0.01) + (left * 0.001));
        opacityValue = opacityValue < 0.1 ? 0.1 : opacityValue > 1 ? 1 : opacityValue;
        spans[i].style.opacity = opacityValue.toFixed(3);
      } else {
        spans[i].style.opacity = 0.1;
      }
    }
  }

  window.addEventListener("scroll", revealSpans);
  revealSpans();  

  
  // === Flickering Eyebrow ===

  const eyebrowSections = document.querySelectorAll("[eyebrow_random]");

  eyebrowSections.forEach(section => {
    const eyebrowText = section.querySelector("[eyebrow_split]");

    if (!eyebrowText) {
      console.error("Element with attribute `eyebrow_split` not found.");
      return;
    }

    const text = eyebrowText.textContent;
    eyebrowText.innerHTML = text
      .split(/\s+/)
      .map(word => word.split("").map(char => `<span style="opacity: 0; display: inline-block;">${char}</span>`).join(""))
      .join(" ");

    const chars = eyebrowText.querySelectorAll("span");

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "top 30%",
        toggleActions: "play none none reverse"
      }
    })
    .fromTo(chars, 
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 0.1,
        stagger: { 
          each: 0.05,
          from: "random"
        },
        ease: "power1.inOut"
      }
    );
  });
});
