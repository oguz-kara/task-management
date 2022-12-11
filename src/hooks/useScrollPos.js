import { useEffect, useState, useRef, useCallback } from 'react';
function useScrollPos({ ref = null }) {
  const [scrollPos, setScrollPos] = useState(0);
  const elRef = useRef(ref);

  const setElement = useCallback(
    (ref) => {
      elRef.current = ref.current;
    },
    [elRef]
  );

  useEffect(() => {
    const scrollEvent = (e) => {
      console.log('scrolled');
    };

    document.body.addEventListener('scroll', scrollEvent);

    return () => document.body.clearEventListener('scroll', scrollEvent);
  }, []);

  return { scrollPos, setElement };
}

export default useScrollPos;
