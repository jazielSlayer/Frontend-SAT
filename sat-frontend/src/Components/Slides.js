import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    title: 'Gestión de Talleres',
    description: 'Interfaz intuitiva para la administración de talleres',
    image: '/project-image-1.jpg'
  },
  {
    id: 2,
    title: 'Seguimiento de Progreso',
    description: 'Monitoreo detallado del avance de estudiantes',
    image: '/project-image-2.jpg'
  },
  {
    id: 3,
    title: 'Evaluación y Reportes',
    description: 'Sistema completo de evaluación y generación de informes',
    image: '/project-image-3.jpg'
  }
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering, nextSlide]);

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <motion.div 
      className="slideshow-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1250px',
        margin: '3rem auto',
        height: '500px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            width: '96%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ 
            color: 'white', 
            marginBottom: '1.5rem',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            textAlign: 'center',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {SLIDES[currentSlide].title}
          </h2>
          
          <img
            src={SLIDES[currentSlide].image}
            alt={SLIDES[currentSlide].title}
            style={{
              width: '100%',
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '15px',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />
          
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            lineHeight: '1.7',
            maxWidth: '80%',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            {SLIDES[currentSlide].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <motion.button
        animate={{ opacity: isHovering ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          zIndex: 10,
          fontSize: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
        whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.25)' }}
        whileTap={{ scale: 0.95 }}
      >
        ←
      </motion.button>
      
      <motion.button
        animate={{ opacity: isHovering ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          zIndex: 10,
          fontSize: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
        whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.25)' }}
        whileTap={{ scale: 0.95 }}
      >
        →
      </motion.button>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 10,
        background: 'rgba(0,0,0,0.3)',
        padding: '8px 16px',
        borderRadius: '30px',
        backdropFilter: 'blur(10px)'
      }}>
        {SLIDES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            animate={{
              scale: currentSlide === index ? 1.2 : 1,
              opacity: currentSlide === index ? 1 : 0.6
            }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: currentSlide === index 
                ? 'white' 
                : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: currentSlide === index ? '0 2px 8px rgba(255,255,255,0.5)' : 'none'
            }}
            whileHover={{ scale: 1.4 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Slideshow;