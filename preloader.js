document.addEventListener("DOMContentLoaded", function () {
    try {
        console.log("Preloader script started");

        // Create lightweight preloader dynamically
        const preloader = document.createElement("div");
        preloader.className = "preloader-overlay";
        preloader.innerHTML = `
            <div class="loading-text-wrap">
                <span id="counter">0%</span>
                <span class="loading-text">Loading...</span>
            </div>
        `;
        document.body.appendChild(preloader);

        // Initial styles for the preloader
        gsap.set(preloader, { visibility: "visible" });
        gsap.set("#counter", { opacity: 1 });
        gsap.set(".loading-text", { opacity: 1 });

        // GSAP Timeline for animations
        const tl = gsap.timeline({
            onComplete: function () {
                console.log("Preloader animation completed");
                preloader.remove(); // Remove preloader from DOM after animation
            }
        });

        // Animate the counter
        let counter = document.querySelector("#counter");
        tl.to({}, {
            duration: 1.5,
            onUpdate: function () {
                if (counter) {
                    let progress = Math.round(100 * this.progress());
                    counter.textContent = `${progress}%`;
                }
            }
        });

        // Fade out the preloader smoothly
        tl.to(preloader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        // Timeout fallback to remove preloader
        setTimeout(() => {
            if (preloader && preloader.style.opacity !== "0") {
                console.warn("Preloader forced to hide after timeout");
                gsap.set(preloader, { display: "none" });
            }
        }, 10000); // 10 seconds fallback
    } catch (error) {
        console.error("Error in preloader script:", error);
        let preloader = document.querySelector(".preloader-overlay");
        if (preloader) preloader.remove(); // Ensure preloader is removed on error
    }
});

