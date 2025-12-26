import { useEffect } from 'react';

/**
 * Hook to add slide-left-on-scroll animation to elements
 * @param {string} selector - CSS selector of elements to animate (default: '.slide-left-on-scroll')
 * @param {number} offset - Trigger offset from bottom of viewport (default: 100)
 */
const useSlideOnScroll = (selector = '.slide-left-on-scroll', offset = 100) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    const checkSlide = () => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - offset) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible'); // optional: remove if scrolling back up
        }
      });
    };

    window.addEventListener('scroll', checkSlide);
    window.addEventListener('load', checkSlide);

    checkSlide(); // Run immediately on mount

    return () => {
      window.removeEventListener('scroll', checkSlide);
      window.removeEventListener('load', checkSlide);
    };
  }, [selector, offset]);
};

export default useSlideOnScroll;
