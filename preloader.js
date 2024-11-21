document.addEventListener('DOMContentLoaded', function () {
  try {
    console.log('Preloader script started');

    // Check if required elements exist
    const preloaderWrap = document.querySelector('.pre_loader_wrap');
    const splitTextContainer = document.querySelector('.h-h1');
    const counter = document.querySelector('#counter');

    if (!preloaderWrap) {
      console.error('Missing .pre_loader_wrap');
      return;
    }

    // Initialize SplitType if element exists
    const splitText = splitTextContainer
      ? new SplitType('.h-h1', { types: 'words' })
      : null;

    if (splitText) {
      gsap.set(splitText.words, { opacity: 0 });
    }

    gsap.set('.block_support', { opacity: 0, y: 20 });

    // GSAP timeline
    const preloaderTimeline = gsap.timeline();

    // Counter animation
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
      .to('.top_wrap .loader_col_01', {
        scaleY: 0,
        transformOrigin: 'bottom center',
        stagger: { amount: 0.2, from: 'center' },
        duration: 0.5,
        ease: 'power3.out',
      })
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
      .to('#line-left', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '<')
      .to('#line-right', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '<')
      .to(
        ['#counter', '.loading_text', '.blokkplay_logo', '.lottie_logo', '#line-left', '#line-right'],
        { opacity: 0, duration: 0.5, ease: 'power4.out' },
        '+=0.1'
      )
      .to('.top_wrap .loader_col_02', {
        y: '-100%',
        transformOrigin: 'bottom center',
        stagger: { amount: 0.2, from: 'center' },
        duration: 0.6,
        ease: 'power3.out',
      })
      .to(
        '.bottom_wrap .loader_col_02',
        {
          y: '100%',
          transformOrigin: 'top center',
          stagger: { amount: 0.2, from: 'center' },
          duration: 0.6,
          ease: 'power3.out',
          onComplete: function () {
            console.log('Preloader animation completed');
            gsap.set('.pre_loader_wrap', { display: 'none' });
          },
        },
        '<'
      );

    // Safeguard: Force hide if stuck
    setTimeout(() => {
      if (preloaderWrap.style.display !== 'none') {
        console.warn('Preloader forced to hide after timeout');
        gsap.set(preloaderWrap, { display: 'none' });
      }
    }, 10000); // Adjust timeout as needed
  } catch (error) {
    console.error('Preloader script error:', error);

    // Force hide the preloader if an error occurs
    const preloaderWrap = document.querySelector('.pre_loader_wrap');
    if (preloaderWrap) {
      gsap.set(preloaderWrap, { display: 'none' });
    }
  }
});
