import React, { useEffect } from "react";
import { Link } from "wouter";
import GradientText from "@/components/common/GradientText";
import LazyImage from "@/components/common/LazyImage";

const services = [
  {
    id: 1,
    title: "Prosthetic Limbs",
    description: "Our custom-made artificial legs and hands are designed to restore functionality and independence. We tailor each prosthetic to match the unique requirements of our patients.",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Orthotic Insoles for Flat Feet",
    description: "Specialized insoles that provide support and correct flat foot conditions, ensuring comfort and proper alignment throughout your day.",
    image: "https://images.unsplash.com/photo-1514672013381-c6d0df1c8b18?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Orthopedic Footwear",
    description: "Customized shoes designed to address various foot-related issues, delivering optimal support and lasting comfort.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Corrective Shoes",
    description: "Tailored footwear solutions that help correct specific foot deformities or conditions, enhancing mobility and reducing pain.",
    image: "https://images.unsplash.com/photo-1531750390233-1321261181a8?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Diabetic Footwear",
    description: "Specialized shoes crafted to protect diabetic patients' feet, minimizing the risk of ulcers and other complications.",
    image: "https://images.unsplash.com/photo-1551789298-b1e42c94f55d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Custom Braces",
    description: "Supportive braces designed for specific joint conditions, helping to stabilize areas of weakness and promote proper healing.",
    image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop"
  }
];

const Services: React.FC = () => {
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
            <GradientText>Our Services</GradientText>
          </h1>
          <p className="text-xl text-gray-600 mt-2">Comprehensive Solutions for Every Need</p>
        </div>
      </div>

      {/* Services List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-gray-700 text-lg max-w-4xl mx-auto text-center mb-12">
            At LIMBS Orthopaedic, we offer a comprehensive range of prosthetic and orthotic solutions tailored to meet the unique needs of each patient. Our services are designed to enhance mobility, improve comfort, and restore independence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
                <div className="h-52 overflow-hidden">
                  <LazyImage 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                  <Link href="/appointment">
                    <a className="mt-4 inline-block text-[#34bdf2] font-medium hover:text-[#2193c9]">
                      Book a Consultation <i className="fas fa-chevron-right ml-1 text-xs"></i>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <GradientText>Our Process</GradientText>
            </h2>
            <p className="text-xl text-gray-600 mt-2">How We Deliver Custom Solutions</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Process Timeline */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#34bdf2] opacity-30"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 mb-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">1. Initial Consultation</h3>
                      <p className="text-gray-600">
                        Our specialists will meet with you to understand your specific needs, medical history, and goals for your prosthetic or orthotic device.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/2 md:pl-8 justify-start">
                    <div className="w-12 h-12 rounded-full bg-[#34bdf2] flex items-center justify-center text-white text-xl font-bold">1</div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 mb-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pl-8 order-1 md:order-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">2. Assessment & Measurement</h3>
                      <p className="text-gray-600">
                        We take precise measurements and, if necessary, create molds or 3D scans to ensure your device fits perfectly and functions as needed.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/2 md:pr-8 justify-end order-2 md:order-1">
                    <div className="w-12 h-12 rounded-full bg-[#34bdf2] flex items-center justify-center text-white text-xl font-bold">2</div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 mb-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">3. Custom Design & Fabrication</h3>
                      <p className="text-gray-600">
                        Our team designs and fabricates your custom device, paying careful attention to every detail to ensure comfort, functionality, and aesthetic appeal.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/2 md:pl-8 justify-start">
                    <div className="w-12 h-12 rounded-full bg-[#34bdf2] flex items-center justify-center text-white text-xl font-bold">3</div>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pl-8 order-1 md:order-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">4. Fitting & Follow-up Care</h3>
                      <p className="text-gray-600">
                        We ensure your device fits properly and provide ongoing support, adjustments, and maintenance to help you achieve the best possible outcome.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/2 md:pr-8 justify-end order-2 md:order-1">
                    <div className="w-12 h-12 rounded-full bg-[#34bdf2] flex items-center justify-center text-white text-xl font-bold">4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Book a consultation with our specialists to discuss your specific needs and explore the options available to you.
          </p>
          <Link href="/appointment">
            <a className="px-8 py-4 bg-white text-[#34bdf2] font-bold rounded-md hover:bg-gray-100 transition inline-block">
              Book an Appointment
            </a>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Services;
