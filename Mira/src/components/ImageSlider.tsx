import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);


  const slides = [
    {
      id: 1,
      image: "/download (3).jpeg",
      title: "Campus Life",
      description: "FUNAAB & mesmerizing campus life"
    },
    {
      id: 2,
      image: "/african-american-team-comparing-class-notes-doing-research-library (1).jpg",
      title: "Digital Money",
      description: "3MTT & Stablecoin"
    },
    {
      id: 3,
      image: "/black-student-reading-books-handwritten-class-notes-right-before-exam (1).jpg",
      title: "Motivation",
      description: "The A vs C students"
    },
    {
    id: 4,
      image: "/portrait-african-young-businessman-businesswoman-holding-clipboard-digital-tablet-looking-camera (1).jpg",
      title: "Campus podcast",
      description: "Experience the vibrant campus community"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-40 md:h-80 rounded-lg overflow-hidden shadow-lg bg-card">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#5f67ac]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#180b28]/70 via-[#5f67ac]/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
              <p className="text-sm opacity-90">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
