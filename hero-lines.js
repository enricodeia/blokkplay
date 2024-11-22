document.addEventListener('DOMContentLoaded', function () {
    console.log("Line animation script initialized");

    // Shared function to animate lines
    function animateLine(pathSelector, pathBlurSelector, delays) {
        const path = document.querySelector(pathSelector);
        const pathBlur = document.querySelector(pathBlurSelector);
        if (!path || !pathBlur) {
            console.error(`Missing elements for selectors: ${pathSelector}, ${pathBlurSelector}`);
            return;
        }

        const pathLength = path.getTotalLength();
        const dashLength = pathLength / 7; // Adjust dash size
        const randomDelay = () => delays[Math.floor(Math.random() * delays.length)];

        // Set initial strokeDasharray and strokeDashoffset
        [path, pathBlur].forEach(el => {
            el.style.strokeDasharray = `${dashLength} ${pathLength + dashLength}`;
            el.style.strokeDashoffset = 0;
        });

        // Animation function
        function animatePath() {
            gsap.fromTo([path, pathBlur], {
                strokeDashoffset: 0,
                opacity: 0
            }, {
                strokeDashoffset: -pathLength,
                opacity: 1,
                duration: 3,
                ease: "linear",
                onUpdate: () => {
                    const progress = gsap.getProperty(path, "strokeDashoffset") / -pathLength;
                    const opacity = Math.abs(Math.sin(Math.PI * progress));
                    path.style.opacity = opacity;
                    pathBlur.style.opacity = opacity;
                },
                onComplete: () => gsap.delayedCall(randomDelay(), animatePath)
            });
        }

        animatePath();
    }

    // Start animations for left and right lines
    animateLine("#left-line-top", "#left-line-blur", [4, 5, 6]);
    animateLine("#right-line-top", "#right-line-blur", [3, 5.5, 7]);
});
