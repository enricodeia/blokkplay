document.addEventListener("DOMContentLoaded", function () {
    let e = [...document.querySelectorAll(".h-h2, .h-h3")],
        t = [];

    function n() {
        for (let e = 0; e < t.length; e++) {
            if (t[e].parentElement.getBoundingClientRect().top < 0.9 * window.innerHeight) {
                let { left: n, top: o } = t[e].getBoundingClientRect(),
                    l = 1 - (0.01 * (o -= 0.9 * window.innerHeight) + 0.001 * n);
                l = l < 0.1 ? 0.1 : l > 1 ? 1 : l;

                // Change color and opacity
                t[e].style.opacity = l.toFixed(3);
                t[e].style.color = `rgba(144, 108, 235, ${l.toFixed(3)})`;
            } else {
                t[e].style.opacity = 0.1;
                t[e].style.color = `rgba(144, 108, 235, 0.1)`;
            }
        }
    }

    e.forEach(e => {
        let t = e.textContent.split(""),
            n = "";
        t.forEach(e => {
            n += `<span style="opacity:0.1; color: rgba(144, 108, 235, 0.1);">${e}</span>`;
        });
        e.innerHTML = n;
    });

    t = [...document.querySelectorAll(".h-h2 span, .h-h3 span")];
    window.addEventListener("scroll", n);
    n();

    let o = document.querySelectorAll("[eyebrow_random]");
    o.forEach(e => {
        let t = e.querySelector("[eyebrow_split]");
        if (!t) {
            console.error("Element with attribute `eyebrow_split` not found.");
            return;
        }
        let n = t.textContent;
        t.innerHTML = n
            .split(/\s+/)
            .map(e =>
                e
                    .split("")
                    .map(
                        e =>
                            `<span style="opacity: 0; display: inline-block; color: rgba(144, 108, 235, 0);">${e}</span>`
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
                { opacity: 0, color: "rgba(144, 108, 235, 0)" },
                { opacity: 1, color: "#906ceb", duration: 0.1, stagger: { each: 0.05, from: "random" }, ease: "power1.inOut" }
            );
    });
});
