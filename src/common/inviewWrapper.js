// SectionWrapper.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import './inviewWrapper.css'

const SectionWrapper = ({ children, threshold = 0.2 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
  });

  return (
    <div
      ref={ref}
      className={`section-wrapper ${inView ? 'animate-fade-in' : ''}`}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
