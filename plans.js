document.addEventListener("DOMContentLoaded", function () {
    // Select all elements with the ID #button
    let buttons = document.querySelectorAll("#button");

    buttons.forEach(button => {
        // Prevent long-press menu but keep buttons clickable
        button.addEventListener("contextmenu", e => e.preventDefault());
        button.addEventListener("touchstart", e => {
            // Prevent default only for long-press without breaking click
            if (e.touches.length > 1) e.preventDefault();
        });

        // Set initial states for button text animations
        gsap.set(button.querySelectorAll(".button_text_in .button_block.is--in"), {
            y: 0,
            opacity: 1
        });

        gsap.set(button.querySelectorAll(".button_text_out .button_block.is--out"), {
            y: 20,
            opacity: 0
        });

        // Add hover (mouseenter) animation
        button.addEventListener("mouseenter", () => {
            if (!gsap.isTweening(button)) {
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
                    backgroundColor: "#7742ff",
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });

        // Add mouseleave animation
        button.addEventListener("mouseleave", () => {
            if (!gsap.isTweening(button)) {
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
            }
        });
    });

    // Match media for max-width 767px
    gsap.matchMedia().add("(max-width: 767px)", () => {
        // Define percentage values for animations
        let startLeft = 305;
        let centerStart = 325;
        let centerVisible = centerStart + 5;
        let centerEnd = centerVisible + 5;
        let rightStart = centerEnd + 20;
        let rightVisible = rightStart + 5;
        let rightEnd = rightVisible + 5;

        // Scroll-triggered timeline for cards
        gsap.timeline({
            scrollTrigger: {
                trigger: "[cards-mobile]",
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        })
        .fromTo(".card.is--left", { opacity: 1, display: "block" }, { opacity: 1, ease: "none" }, "300%")
        .to(".card.is--left", {
            opacity: 0,
            ease: "none",
            onComplete: () => $(".card.is--left").css("display", "none"),
            onReverseComplete: () => $(".card.is--left").css("display", "block")
        }, `${centerStart}%`)
        .fromTo(".card.is--center", { opacity: 0, display: "none" }, {
            opacity: 1,
            ease: "none",
            onStart: () => $(".card.is--center").css("display", "block")
        }, `${centerVisible}%`)
        .to(".card.is--center", { opacity: 1, ease: "none" }, `${centerEnd}%`)
        .to(".card.is--center", {
            opacity: 0,
            ease: "none",
            onComplete: () => $(".card.is--center").css("display", "none"),
            onReverseComplete: () => $(".card.is--center").css("display", "block")
        }, `${rightStart}%`)
        .fromTo(".card.is--right", { opacity: 0, display: "none" }, {
            opacity: 1,
            ease: "none",
            onStart: () => $(".card.is--right").css("display", "block")
        }, `${rightVisible}%`)
        .to(".card.is--right", { opacity: 1, ease: "none" }, `${rightEnd}%`);
    });
});
