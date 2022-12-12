import { motion } from 'framer-motion';

export function Item({ children, index, condition }) {
  const variants = {
    hidden: (i) => ({
      opacity: 0,
      y: -50 + i
    }),
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05
      }
    }),
    removed: {
      opacity: 0
    }
  };
  return (
    <motion.div
      variants={variants}
      initial={condition ? '' : 'hidden'}
      animate={condition ? '' : 'visible'}
      custom={index}
      exit="removed">
      {children}
    </motion.div>
  );
}
