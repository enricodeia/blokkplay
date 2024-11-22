document.addEventListener("DOMContentLoaded", function () {
    try {
        console.log("Preloader script started");

        let preLoaderWrap = document.querySelector(".pre_loader_wrap"),
            counter = document.querySelector("#counter");

        if (!preLoaderWrap) {
            console.error("Missing .pre_loader_wrap");
            return;
        }

        // GSAP MatchMedia for animations on different breakpoints
        const mm = gsap.matchMedia();

        // Preloader Animation: Minimal for all breakpoints
        const tl = gsap.timeline({
            onComplete: function () {
                console.log("Preloader animation completed");
                preLoaderWrap.style.display = "none"; // Hide preloader after animation
            }
        });

        // Animate the preloader counter
        tl.to({}, {
            duration: 1.5,
            onUpdate: function () {
                if (counter) {
                    let progress = Math.round(100 * this.progress());
                    counter.textContent = `${progress}%`;
                }
            }
        });

        // Fade out preloader
        tl.to(preLoaderWrap, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        // Desktop and Tablet Animations (width >= 768px)
        mm.add("(min-width: 768px)", () => {
            console.log("Running desktop animations");

            // Split text animation for h-h1
            let headerText = document.querySelector(".h-h1");
            if (headerText) {
                let splitText = new SplitType(".h-h1", { types: "words" });
                gsap.set(splitText.words, { opacity: 0 });

                gsap.to(splitText.words, {
                    opacity: 1,
                    duration: 1.2,
                    ease: "power1.out",
                    stagger: { amount: 0.5, from: "random" }
                });
            }
        });

        // Mobile Animations (width < 768px) - Disable h-h1 Animation
        mm.add("(max-width: 767px)", () => {
            console.log("Skipping h-h1 animation on mobile");

            // Ensure h-h1 is visible immediately without animation
            gsap.set(".h-h1", { opacity: 1 });
        });

        // Timeout fallback to hide preloader
        setTimeout(() => {
            if (preLoaderWrap.style.display !== "none") {
                console.warn("Preloader forced to hide after timeout");
                gsap.set(preLoaderWrap, { display: "none" });
            }
        }, 8000); // Reduce timeout to 8 seconds
    } catch (error) {
        console.error("Error in preloader script:", error);
        let preLoaderWrap = document.querySelector(".pre_loader_wrap");
        if (preLoaderWrap) gsap.set(preLoaderWrap, { display: "none" });
    }
});
