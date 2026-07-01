import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
type Slide = {
  id: number;
  image: string;
  category: string;
  title: string;
  description: string;
};
const slides: Slide[] = [
  {
    id: 1,
    image: "/handsome_black.jpg",
    category: "Campus Life",
    title: "The new face of campus life",
    description: "Inside the daily rhythm of a smarter, more connected campus.",
  },
  {
    id: 2,
    image: "/tourist_lady.jpg",
    category: "Travel & Tourism",
    title: "Stablecoins meet real-world travel",
    description: "How 3MTT and stablecoin rails are redefining how students move and spend.",
  },
  {
    id: 3,
    image: "/cartoonStd.jpg",
    category: "Motivation",
    title: "A‑students vs C‑students: the real gap",
    description: "It is rarely intelligence. It is almost always systems and habits.",
  },
  {
    id: 4,
    image: "/WhatsApp Image 2026-04-12 at 20.11.36.jpeg",
    category: "Builders",
    title: "Campus businesses worth watching",
    description: "Meet the student founders shaping the next wave of campus commerce.",
  },
];
const BlogSlider = () => {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
 
  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, []);
  return (
    
    <div className="relative w-full h-48 sm:h-80 md:h-[26rem] overflow-hidden bg-emerald-950">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
              index === current ? "scale-110" : "scale-100"
            }`}
  
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
            <span className="inline-flex items-center rounded-full bg-[#5cad1a]/90 px-3 py-0 text-11px] font-semibold uppercase ">
              {slide.category}
            </span>
            <h3 className="mt-3 text-sm sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight max-w-[90%]">
              {slide.title}
            </h3>
            <p className="mt-2 text-xs sm:text-base text-white/85 max-w-[92%] leading-relaxed line-clamp-2">
              {slide.description}
            </p>
          </div>
       
        </div>
      ))}
      {/* Arrows */}
      {/* <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button> */}
      {/* <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button> */}
      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-[#5cad1a]" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
export default BlogSlider;
