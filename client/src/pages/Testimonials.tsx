import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import GradientText from "@/components/common/GradientText";

const testimonials = [
  {
    id: 1,
    name: "John Otieno",
    location: "Nairobi, Kenya",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: 5,
    content: "I regained my independence with my new prosthetic leg. LIMBS Orthopaedic gave me my life back!"
  },
  {
    id: 2,
    name: "Mary Gathoni",
    location: "Kasarani, Kenya",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    stars: 5,
    content: "The custom orthotic insoles have made a remarkable difference in my day-to-day comfort. I'm forever grateful!"
  },
  {
    id: 3,
    name: "Peter Mwangi",
    location: "Westlands, Kenya",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    stars: 5,
    content: "After my accident, I thought I'd never walk properly again. Thanks to LIMBS Orthopaedic, my corrective shoes have improved my mobility!"
  },
  {
    id: 4,
    name: "Jane Wambui",
    location: "Kiambu, Kenya",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    stars: 4,
    content: "The team at LIMBS Orthopaedic is incredible! They took the time to understand my needs and created a custom solution that works perfectly for me."
  },
  {
    id: 5,
    name: "David Omondi",
    location: "Mombasa, Kenya",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    stars: 5,
    content: "From the first consultation to the final fitting, the care and attention to detail was exceptional. My prosthetic arm has changed my life."
  },
  {
    id: 6,
    name: "Grace Kimani",
    location: "Nakuru, Kenya",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    stars: 5,
    content: "My son has been using his orthotic brace for 6 months now, and the improvement in his mobility and confidence is incredible. Thank you!"
  }
];

const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = { mobile: 1, desktop: 3 };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Determine if mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalPages = Math.ceil(testimonials.length / (isMobile ? itemsPerPage.mobile : itemsPerPage.desktop));
  
  const handlePrev = () => {
    setCurrentSlide(prevSlide => (prevSlide > 0 ? prevSlide - 1 : totalPages - 1));
  };
  
  const handleNext = () => {
    setCurrentSlide(prevSlide => (prevSlide < totalPages - 1 ? prevSlide + 1 : 0));
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">
            <GradientText>Patient Stories & Testimonials</GradientText>
          </h1>
          <p className="text-xl text-gray-600 mt-2">Real Experiences, Real Transformations</p>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-700 max-w-3xl mx-auto text-lg">
            Read firsthand accounts from our patients who have experienced life-changing improvements. Our success stories speak to our commitment to delivering personalized, high-quality care.
          </p>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                  width: `${totalPages * 100}%`
                }}
              >
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <div 
                    key={pageIndex} 
                    className="min-w-full flex flex-wrap gap-6 justify-center"
                    style={{ width: `${100 / totalPages}%` }}
                  >
                    {testimonials
                      .slice(
                        pageIndex * (isMobile ? itemsPerPage.mobile : itemsPerPage.desktop), 
                        (pageIndex + 1) * (isMobile ? itemsPerPage.mobile : itemsPerPage.desktop)
                      )
                      .map(testimonial => (
                        <div 
                          key={testimonial.id} 
                          className="bg-white rounded-lg p-6 shadow-md w-full md:w-[calc(33.333%-1rem)] flex flex-col"
                        >
                          <div className="flex items-center mb-4">
                            <img 
                              src={testimonial.image}
                              alt={testimonial.name} 
                              className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h4 className="font-bold text-lg">{testimonial.name}</h4>
                              <p className="text-gray-600">{testimonial.location}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4 text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i >= testimonial.stars ? 'text-gray-300' : ''}`}
                              ></i>
                            ))}
                          </div>
                          
                          <p className="text-gray-700 italic flex-grow">
                            "{testimonial.content}"
                          </p>
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white text-[#34bdf2] w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 hover:bg-[#34bdf2] hover:text-white transition md:left-4"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <button 
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white text-[#34bdf2] w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 hover:bg-[#34bdf2] hover:text-white transition md:right-4"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-[#34bdf2]' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to testimonial page ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <GradientText>Patient Success Stories</GradientText>
            </h2>
            <p className="text-xl text-gray-600 mt-2">Hear Directly from Our Patients</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <i className="fas fa-video text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-600">Patient Success Story: John's Journey</p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">John's Story: Walking Again After 5 Years</h3>
                <p className="text-gray-600 mt-2">
                  After losing his leg in an accident, John thought he'd never walk again. See how our custom prosthetic solution changed his life.
                </p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <i className="fas fa-video text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-600">Patient Success Story: Mary's Journey</p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">Mary's Story: Dancing Again with Custom Orthotics</h3>
                <p className="text-gray-600 mt-2">
                  Mary, a professional dancer, thought her career was over due to severe foot pain. Our custom orthotic solution got her back on stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join the hundreds of satisfied patients who have regained mobility and independence with our help.
          </p>
          <Link href="/appointment">
            <a className="px-8 py-4 bg-white text-[#34bdf2] font-bold rounded-md hover:bg-gray-100 transition inline-block">
              Book Your Consultation Today
            </a>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
