import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return !!isMobile;
}

/** Detects mobile device AND orientation */
export function useMobileDevice() {
  const [state, setState] = React.useState({ isMobile: false, isLandscape: false });

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // "mobile" = narrower than 768 OR touch device
      const isMobile = w < MOBILE_BREAKPOINT || ('ontouchstart' in window && w < 1024);
      const isLandscape = w > h;
      setState({ isMobile, isLandscape });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return state;
}
