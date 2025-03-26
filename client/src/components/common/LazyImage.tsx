import React, { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <img
      ref={imgRef}
      src={isInView ? src : ''}
      alt={alt}
      className={`${className} ${isLoaded ? 'lazy-loaded' : 'lazy-load'}`}
      onLoad={handleLoad}
    />
  );
};

export default LazyImage;
