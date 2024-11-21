window.addEventListener('load', function () {
  try {
    const preloaderTimeline = gsap.timeline();

    // Safeguard: Ensure required elements are present
    const counter = document.querySelector('#counter');
    const splitTextContainer = document.querySelector('.h-h1');
    const splitText = splitTextContainer ? new SplitType('.h-h1', { types: 'words' }) : null;

    // Handle missing elements gracefully
    if (splitText) {
      gsap.set(splitText.words, { opacity: 0 });
    }
    gsap.set('.block_support', { opacity: 0, y: 20 });

    // Counter animation (with safeguard if #counter is missing)
    preloaderTimeline.to(
      {},
      {
        duration: 1.5,
        onUpdate: function () {
          if (counter) {
            const progress = Math.round(100 * this.progress());
            counter.textContent = progress + '%';
          }
        },
      }
    );

    // Loader animations
    preloaderTimeline
      .to(
        '.top_wrap .loader_col_01',
        {
          scaleY: 0,
          transformOrigin: 'bottom center',
          stagger: { amount: 0.2, from: 'center' },
          duration: 0.5,
          ease: 'power3.out',
        },
        '<'
      )
      .to(
        '.bottom_wrap .loader_col_01',
        {
          scaleY: 0,
          transformOrigin: 'top center',
          stagger: { amount: 0.2, from: 'center' },
          duration: 0.5,
          ease: 'power3.out',
        },
        '<'
      )
      .to(
        ['#counter', '.loading_text', '.blokkplay_logo', '.lottie_logo'],
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
        '+=0.5'
      )
      .to(
        '#line-left',
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '<'
      )
      .to(
        '#line-right',
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '<'
      )
      .to(
        ['#counter', '.loading_text', '.blokkplay_logo', '.lottie_logo', '#line-left', '#line-right'],
        { opacity: 0, duration: 0.5, ease: 'power4.out' },
        '+=0.1'
      )
      .to(
        '.top_wrap .loader_col_02',
        {
          y: '-100%',
          transformOrigin: 'bottom center',
          stagger: { amount: 0.2, from: 'center' },
          duration: 0.6,
          ease: 'power3.out',
        },
        '<'
      )
      .to(
        '.bottom_wrap .loader_col_02',
        {
          y: '100%',
          transformOrigin: 'top center',
          stagger: { amount: 0.2, from: 'center' },
          duration: 0.6,
          ease: 'power3.out',
          onComplete: function () {
            // Safeguard: Hide preloader if timeline finishes
            gsap.set('.pre_loader_wrap', { display: 'none' });
          },
        },
        '<'
      );

    // Content entrance animations (only run if elements exist)
    if (splitText) {
      preloaderTimeline.to(
        splitText.words,
        {
          opacity: 1,
          duration: 1.2,
          ease: 'power1.out',
          stagger: { amount: 0.5, from: 'random' },
        },
        '<'
      );
    }

    preloaderTimeline
      .to(
        '.block_support',
        { opacity: 1, y: 0, duration: 0.8, ease: 'power1.out', stagger: 0.3 },
        '<'
      )
      .from(
        '.spline_triangle',
        { opacity: 0, y: 200, duration: 2, ease: 'power4.inOut' },
        '<'
      )
      .from(
        '#shiny-cta',
        { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power2.out' },
        '<'
      )
      .from(
        '.nav',
        { y: -50, opacity: 0, duration: 0.75, ease: 'power4.out' },
        '+=0.01'
      )
      .from(
        '.arrow_container',
        { opacity: 0, duration: 1.2, ease: 'power4.out' },
        '+=0.2'
      );

    // Safeguard: Force hide the preloader if stuck
    setTimeout(() => {
      if (document.querySelector('.pre_loader_wrap').style.display !== 'none') {
        gsap.set('.pre_loader_wrap', { display: 'none' });
      }
    }, 10000); // Force hide after 10 seconds
  } catch (error) {
    console.error('Error in preloader script:', error);

    // Safeguard: Ensure the preloader is hidden even if errors occur
    gsap.set('.pre_loader_wrap', { display: 'none' });
  }
});
