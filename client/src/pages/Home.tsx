import React, { useEffect } from "react";
import { Link } from "wouter";
import LazyImage from "@/components/common/LazyImage";
import GradientText from "@/components/common/GradientText";

const Home: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="absolute inset-0 z-10">
          <LazyImage 
            src="https://i.imgur.com/miBt3Vd.jpg?q=80&w=2000&auto=format&fit=crop"
            alt="Medical professional with prosthetic limb"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to LIMBS Orthopaedic</h1>
            <p className="text-xl md:text-2xl font-light mb-6">Improving Mobility & Quality of Life in Nairobi</p>
            <p className="mb-8 text-lg">
              At LIMBS Orthopaedic, we specialize in advanced prosthetics and orthotics designed to help you regain independence and enhance your mobility. Based in Kasarani, Nairobi, our dedicated team combines cutting-edge technology with compassionate care to deliver custom solutions that truly make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/appointment"
                className="px-6 py-3 bg-[#34bdf2] text-white rounded-md hover:bg-[#2193c9] transition text-center"
              >
                Book an Appointment
              </Link>
              <Link 
                to="/services"
                className="px-6 py-3 bg-white text-[#34bdf2] rounded-md hover:bg-gray-100 transition text-center"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <GradientText>About LIMBS Orthopaedic</GradientText>
            </h2>
            <p className="text-xl text-gray-600 mt-2">Our Mission, Vision, and Journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <LazyImage 
                src="https://images.unsplash.com/photo-1631815587646-b84fb6e45b33?q=80&w=1200&auto=format&fit=crop" 
                alt="LIMBS Orthopaedic team at work" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                LIMBS Orthopaedic is a pioneering medical facility in Nairobi, Kenya, dedicated to serving individuals with limb differences. Our mission is to improve mobility and quality of life through custom-designed prosthetics and orthotics.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Founded with a passion for innovation and care, we have grown to become a trusted name in the region, continually refining our techniques and services to meet the evolving needs of our community.
              </p>
              
              <Link 
                to="/about"
                className="px-6 py-3 bg-[#34bdf2] text-white rounded-md hover:bg-[#2193c9] transition inline-block"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <GradientText>Our Services</GradientText>
            </h2>
            <p className="text-xl text-gray-600 mt-2">Comprehensive Solutions for Every Need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
              <div className="h-52 overflow-hidden">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=800&auto=format&fit=crop" 
                  alt="Prosthetic Limbs" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Prosthetic Limbs</h3>
                <p className="text-gray-600">
                  Our custom-made artificial legs and hands are designed to restore functionality and independence.
                </p>
                <Link 
                  to="/services" 
                  className="mt-4 inline-block text-[#34bdf2] font-medium hover:text-[#2193c9]"
                >
                  Learn More <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </Link>
              </div>
            </div>
            
            {/* Service Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
              <div className="h-52 overflow-hidden">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1514672013381-c6d0df1c8b18?q=80&w=800&auto=format&fit=crop" 
                  alt="Orthotic Insoles for Flat Feet" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Orthotic Insoles</h3>
                <p className="text-gray-600">
                  Specialized insoles that provide support and correct flat foot conditions.
                </p>
                <Link 
                  to="/services" 
                  className="mt-4 inline-block text-[#34bdf2] font-medium hover:text-[#2193c9]"
                >
                  Learn More <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </Link>
              </div>
            </div>
            
            {/* Service Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
              <div className="h-52 overflow-hidden">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop" 
                  alt="Orthopedic Footwear" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Orthopedic Footwear</h3>
                <p className="text-gray-600">
                  Customized shoes designed to address various foot-related issues.
                </p>
                <Link 
                  to="/services" 
                  className="mt-4 inline-block text-[#34bdf2] font-medium hover:text-[#2193c9]"
                >
                  Learn More <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/services" 
              className="px-6 py-3 bg-[#34bdf2] text-white rounded-md hover:bg-[#2193c9] transition inline-block"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Enhance Your Mobility?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our specialists to discuss your needs and explore personalized solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/appointment" 
              className="px-8 py-4 bg-white text-[#34bdf2] font-bold rounded-md hover:bg-gray-100 transition text-center"
            >
              Book an Appointment
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-[#34bdf2] transition text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
