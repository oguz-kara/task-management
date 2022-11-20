import { useSpring, animated } from 'react-spring';

function Fade({ children, delayIndex = 1, ms = 0, active = true }) {
  const props = useSpring({
    to: {
      opacity: 1,
      transform: 'translateX(0)',
      transform: 'scale(1)'
    },
    from: {
      opacity: 0,
      transform: 'translateX(-50px)',
      transform: 'scale(0.5)'
    },
    delay: ms * delayIndex
  });
  return active ? <animated.div style={props}>{children}</animated.div> : { children };
}

export default Fade;
