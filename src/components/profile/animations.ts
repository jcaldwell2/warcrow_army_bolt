
import { Variants } from 'framer-motion';

export const profileFadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const cardHover: Variants = {
  initial: { 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: { duration: 0.2 }
  },
  hover: { 
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: { duration: 0.2 }
  }
};

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const tabVariants: Variants = {
  inactive: { 
    borderBottom: '2px solid rgba(255, 215, 0, 0)',
    color: 'rgba(225, 225, 230, 0.6)',
    transition: { duration: 0.2 }
  },
  active: { 
    borderBottom: '2px solid rgba(255, 215, 0, 1)',
    color: 'rgba(255, 215, 0, 1)',
    transition: { duration: 0.2 }
  }
};
