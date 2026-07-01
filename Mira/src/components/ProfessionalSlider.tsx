import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "/student-with-phone.jpg";
import slide2 from "/secetary.jpg";
import slide3 from "/five-students.jpg";
import slide4 from "/black-female-student.jpg";

const SLIDES = [
  {
    image: slide1,
    title: "Built for African Students",
    caption: "Pay tuition, hostel, and departmental dues in seconds — right from your phone.",
  },
  {
    image: slide2,
    title: "Confidence for Bursars & Admins",
    caption: "Real-time dashboards replace ledgers, paper receipts, and 2 a.m. reconciliations.",
  },
  {
    image: slide3,
    title: "Communities, Not Spreadsheets",
    caption: "Departments, associations, and faculties collect dues with full transparency.",
  },
  {
    image: slide4,
    title: "Verified. Secure. Instant.",
    caption: "Every payment is timestamped, traceable, and confirmed in real time.",
  },
];

const ProfessionalSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % SLIDES.length);
  const prev = () => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[420px] md:h-[560px] rounded-3xl overflow-hidden shadow-2xl group">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            loading="lazy"
            width={1280}
            height={800}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <h3
              className="text-2xl md:text-4xl font-extrabold mb-2 tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {s.title}
            </h3>
            <p className="text-sm md:text-base text-white/85 max-w-xl">{s.caption}</p>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/80 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfessionalSlider;
