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

        // Hide preloader elements initially
        gsap.set(preLoaderWrap, { visibility: "visible" });
        if (headerText) {
            let splitText = new SplitType(".h-h1", { types: "words" });
            gsap.set(splitText.words, { opacity: 0 });
        }
        gsap.set(".block_support", { opacity: 0, y: 20 });

        let tl = gsap.timeline();

        // Smoothly animate counter
        tl.to({}, {
            duration: 1.5,
            onUpdate: function () {
                if (counter) {
                    let progress = Math.round(100 * this.progress());
                    counter.textContent = progress + "%";
                }
            }
        });

        // Smooth animations for preloader elements
        tl.to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo"], { opacity: 1, duration: 0.3, ease: "power2.out" }, "+=0.5")
            .to("#line-left", { x: 0, opacity: 0.7, duration: 0.6, ease: "power2.out" }, "<")
            .to("#line-right", { x: 0, opacity: 0.7, duration: 0.6, ease: "power2.out" }, "<")
            .to(["#counter", ".loading_text", ".blokkplay_logo", ".lottie_logo", "#line-left", "#line-right"], { opacity: 0, duration: 0.5, ease: "power4.out" }, "+=0.1")
            .to(".top_wrap .loader_col_02", { y: "-100%", transformOrigin: "bottom center", stagger: { amount: 0.2, from: "center" }, duration: 0.6, ease: "power3.out" })
            .to(".bottom_wrap .loader_col_02", { y: "100%", transformOrigin: "top center", stagger: { amount: 0.2, from: "center" }, duration: 0.6, ease: "power3.out", onComplete: function () {
                console.log("Preloader animation completed");
                gsap.set(".pre_loader_wrap", { display: "none" });
            } }, "<");

        if (headerText) {
            let splitText = new SplitType(".h-h1", { types: "words" });
            tl.to(splitText.words, { opacity: 1, duration: 1.2, ease: "power1.out", stagger: { amount: 0.5, from: "random" } }, "<");
        }

        // Additional animations
        tl.to(".block_support", { opacity: 1, y: 0, duration: 0.8, ease: "power1.out", stagger: 0.3 }, "<")
            .from(".spline_triangle", { opacity: 0, y: 200, duration: 2, ease: "power4.inOut" }, "<")
            .from("#shiny-cta", { opacity: 0, scale: 0.9, duration: 1.2, ease: "power2.out" }, "<")
            .from(".nav", { y: -50, opacity: 0, duration: 0.75, ease: "power4.out" }, "+=0.01")
            .from(".arrow_container", { opacity: 0, duration: 1.2, ease: "power4.out" }, "+=0.2");

        // Force animation start after load
        window.addEventListener("load", () => {
            console.log("Window loaded: Refreshing GSAP layout");
            ScrollTrigger.refresh(); // Ensure layout calculations are up-to-date
            tl.play(); // Start the timeline if paused
        });

        // Timeout fallback
        setTimeout(() => {
            if (preLoaderWrap.style.display !== "none") {
                console.warn("Preloader forced to hide after timeout");
                gsap.set(preLoaderWrap, { display: "none" });
            }
        }, 10000);
    } catch (error) {
        console.error("Error in preloader script:", error);
        let preLoaderWrap = document.querySelector(".pre_loader_wrap");
        if (preLoaderWrap) gsap.set(preLoaderWrap, { display: "none" });
    }
});
