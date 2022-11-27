import { useSpring, animated } from 'react-spring';

function Grow({ children, delayIndex = 1, ms = 0, active = true, grow = true, ...props }) {
  const propsGrow = useSpring({
    from: {
      opacity: 0,
      width: 0,
      overflow: 'hidden'
    },
    to: {
      opacity: 1,
      width: 350,
      overflow: 'initial'
    },
    delay: ms * delayIndex
  });

  const propsShrink = useSpring({
    from: {
      opacity: 1,
      width: 350,
      overflow: 'initial'
    },
    to: {
      opacity: 0,
      width: 0,
      overflow: 'hidden'
    },
    delay: ms * delayIndex
  });

  return active ? (
    <animated.div {...props} style={grow ? propsGrow : propsShrink}>
      {children}
    </animated.div>
  ) : (
    <>{children}</>
  );
}

export default Grow;
