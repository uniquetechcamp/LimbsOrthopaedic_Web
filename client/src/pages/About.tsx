import React, { useEffect } from "react";
import { Link } from "wouter";
import GradientText from "@/components/common/GradientText";
import LazyImage from "@/components/common/LazyImage";

const About: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">
            <GradientText>About LIMBS Orthopaedic</GradientText>
          </h1>
          <p className="text-xl text-gray-600 mt-2">Our Mission, Vision, and Journey</p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <LazyImage 
                src="https://i.imgur.com/a05zym5.png?q=80&w=1200&auto=format&fit=crop" 
                alt="LIMBS Orthopaedic team at work" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                LIMBS Orthopaedic is a pioneering medical facility in Nairobi, Kenya, dedicated to serving individuals with limb differences. Our mission is to improve mobility and quality of life through custom-designed prosthetics and orthotics. We believe that every patient deserves personalized care that not only addresses physical challenges but also empowers them to live life to the fullest.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Founded with a passion for innovation and care, we have grown to become a trusted name in the region, continually refining our techniques and services to meet the evolving needs of our community.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-[#34bdf2] text-4xl font-bold mb-2">8+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-[#34bdf2] text-4xl font-bold mb-2">500+</div>
                  <div className="text-gray-600">Happy Patients</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-[#34bdf2] text-4xl font-bold mb-2">12</div>
                  <div className="text-gray-600">Specialists</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-[#34bdf2] text-4xl font-bold mb-2">20+</div>
                  <div className="text-gray-600">Services</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <GradientText>Our Vision & Mission</GradientText>
            </h2>
            <p className="text-xl text-gray-600 mt-2">What Drives Us Every Day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-700 mb-4">
                To be the leading provider of prosthetic and orthotic solutions in East Africa, setting the standard for quality care and innovative solutions that restore mobility and independence.
              </p>
              <p className="text-gray-700">
                We envision a world where physical limitations are overcome through accessible, high-quality orthopaedic solutions, allowing everyone to live their lives to the fullest potential.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-4">
                To improve the quality of life of individuals with limb differences through personalized prosthetic and orthotic solutions, delivered with compassion, expertise, and the highest standards of care.
              </p>
              <p className="text-gray-700">
                We are committed to making a meaningful difference in the lives of our patients by enhancing their mobility, independence, and overall well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <GradientText>Our Team</GradientText>
            </h2>
            <p className="text-xl text-gray-600 mt-2">Meet The Experts Behind LIMBS Orthopaedic</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <LazyImage 
                  src="https://i.imgur.com/uhiLUMm.jpg?q=80&w=800&auto=format&fit=crop" 
                  alt="Dr. Wicklife Okoth" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">Dr. Wicklife Okoth</h3>
                <p className="text-[#34bdf2] font-medium mb-3">Director & Orthopaedic Specialist</p>
                <p className="text-gray-600 mb-4">
                  With over 15 years of experience, Dr. Mwangi specializes in advanced prosthetic solutions for lower limbs.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop" 
                  alt="Dr. Maureen Otuoma" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">Dr. Maureen Otuoma</h3>
                <p className="text-[#34bdf2] font-medium mb-3">Prosthetics Expert</p>
                <p className="text-gray-600 mb-4">
                  Dr. Maureen leads our prosthetics department and has been instrumental in introducing cutting-edge technologies.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop" 
                  alt="Dr. James Kamau" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">Dr. James Kamau</h3>
                <p className="text-[#34bdf2] font-medium mb-3">Orthotic Specialist</p>
                <p className="text-gray-600 mb-4">
                  Specializing in pediatric orthotics, Dr. Kamau has helped hundreds of children improve their mobility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Our Care?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our specialists to discuss your needs and explore personalized solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <a className="px-8 py-4 bg-white text-[#34bdf2] font-bold rounded-md hover:bg-gray-100 transition text-center">
                Book an Appointment
              </a>
            </Link>
            <Link href="/contact">
              <a className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-[#34bdf2] transition text-center">
                Contact Us
              </a>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
