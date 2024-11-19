// Pixel Grid Animation (Desktop only)
if (!isMobile()) {
  window.addEventListener("load", function() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.error('GSAP or ScrollTrigger is not loaded. Include the GSAP and ScrollTrigger scripts.');
      return;
    }
    
    gsap.registerPlugin(ScrollTrigger);

    function initPixelGrid() {
      const gridContainer = document.querySelector('.pixel_grid_top');
      if (!gridContainer) {
        console.error('.pixel_grid_top container not found. Make sure it exists in your HTML.');
        return;
      }

      // Calculate grid dimensions
      const boxSize = 300;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const cols = Math.ceil(viewportWidth / boxSize);
      const rows = Math.ceil(viewportHeight / boxSize);

      // Update grid template
      gridContainer.style.display = 'grid';
      gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      gridContainer.innerHTML = ""; // Clear previous grid items

      // Generate grid items
      for (let i = 0; i < cols * rows; i++) {
        const box = document.createElement('div');
        box.classList.add('pixel_box_top');
        gridContainer.appendChild(box);

        // Set default styles using GSAP
        gsap.set(box, { 
          scale: Math.floor(i / cols) > rows - 3 ? 1 : 0, 
          opacity: 1 
        });
      }

      // Apply animations to grid items (bottom to top)
      gsap.fromTo(
        '.pixel_box_top',
        { y: 50, scale: 0, opacity: 0 }, // Start state: Below initial position
        {
          y: 0, // Move to original position
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: '.section_divider_top',
            start: "top 100%",
            end: "top -100%",
            toggleActions: "restart none none reverse",
            scrub: true,
          },
          stagger: { amount: 2, from: "random", grid: "auto" }
        }
      );
    }

    // Initialize grid and listen for resize
    initPixelGrid();

    window.addEventListener("resize", () => {
      initPixelGrid();
      ScrollTrigger.refresh(); // Refresh ScrollTrigger after grid resize
    });
  });
}

// Detect mobile devices
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
