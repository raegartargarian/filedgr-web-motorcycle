import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Car360CarouselProps {
  images: string[];
}

const Car360Carousel = ({ images }: Car360CarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 800);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="block md:hidden w-screen h-full relative overflow-hidden">
      <div className="w-full h-60 relative overflow-hidden">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          className="w-full h-full object-cover object-center"
          alt={`Dealership 360 view ${currentImage + 1}`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
      
      {/* 360 indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[3] flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentImage
                ? "bg-white"
                : "bg-white/30"
            }`}
          />
        ))}
      </div>
      
      {/* 360 label */}
      <div className="absolute top-4 right-4 z-[3] bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
        360° View
      </div>
    </div>
  );
};

export default Car360Carousel;