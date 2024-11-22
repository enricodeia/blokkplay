document.addEventListener("DOMContentLoaded", function () {
    try {
        console.log("Preloader script started");

        let preLoaderWrap = document.querySelector(".pre_loader_wrap"),
            headerText = document.querySelector(".h-h1"),
            counter = document.querySelector("#counter");

        if (!preLoaderWrap) {
            console.error("Missing .pre_loader_wrap");
            return;
        }

        // GSAP MatchMedia for animations on different breakpoints
        const mm = gsap.matchMedia();

        // Preloader Timeline (shared across all breakpoints)
        const preloaderTimeline = gsap.timeline({
            onComplete: function () {
                console.log("Preloader animation completed");
                preLoaderWrap.style.display = "none"; // Hide preloader after animation
            }
        });

        // Counter Animation
        preloaderTimeline.to({}, {
            duration: 1.5,
            onUpdate: function () {
                if (counter) {
                    let progress = Math.round(100 * this.progress());
                    counter.textContent = `${progress}%`;
                }
            }
        });

        // Bottom Column Animation (no top columns)
        preloaderTimeline.to(".bottom_wrap .loader_col_01", {
            scaleY: 0,
            transformOrigin: "top center",
            stagger: { amount: 0.2, from: "center" },
            duration: 0.5,
            ease: "power3.out"
        })
        .to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo"], {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        }, "+=0.5")
        .to("#line-left", { x: 0, opacity: 0.7, duration: 0.6, ease: "power2.out" }, "<")
        .to("#line-right", { x: 0, opacity: 0.7, duration: 0.6, ease: "power2.out" }, "<")
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
        })
        .to(".bottom_wrap .loader_col_02", {
            y: "100%",
            transformOrigin: "top center",
            stagger: { amount: 0.2, from: "center" },
            duration: 0.6,
            ease: "power3.out"
        }, "<");

        // Desktop and Tablet Animations (width >= 768px)
        mm.add("(min-width: 768px)", () => {
            console.log("Running desktop animations");

            // Split text animation for h-h1
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
        }, 8000); // Reduced timeout to 8 seconds for better performance
    } catch (error) {
        console.error("Error in preloader script:", error);
        let preLoaderWrap = document.querySelector(".pre_loader_wrap");
        if (preLoaderWrap) gsap.set(preLoaderWrap, { display: "none" });
    }
});
