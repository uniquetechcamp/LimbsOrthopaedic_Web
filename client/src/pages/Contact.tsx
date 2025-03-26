import React, { useEffect, useState } from "react";
import GradientText from "@/components/common/GradientText";
import NeumorphicButton from "@/components/common/NeumorphicButton";

const Contact: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleFormLoad = () => {
    setFormLoaded(true);
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">
            <GradientText>Contact Us</GradientText>
          </h1>
          <p className="text-xl text-gray-600 mt-2">We're Here to Help</p>
        </div>
      </div>

      {/* Contact Information and Form */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#34bdf2] bg-opacity-10 p-3 rounded-full mr-4">
                      <i className="fas fa-map-marker-alt text-[#34bdf2]"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Location</h4>
                      <p className="text-gray-600">Kasarani, Nairobi, Kenya</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#34bdf2] bg-opacity-10 p-3 rounded-full mr-4">
                      <i className="fas fa-phone text-[#34bdf2]"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Phone</h4>
                      <p className="text-gray-600">+254719628276</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#34bdf2] bg-opacity-10 p-3 rounded-full mr-4">
                      <i className="fas fa-envelope text-[#34bdf2]"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Email</h4>
                      <p className="text-gray-600">info@limbsorthopaedic.com</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Connect With Us</h4>
                    <div className="flex space-x-4">
                      <NeumorphicButton
                        icon="fab fa-facebook-f"
                        href="https://facebook.com/LimbsOrthopaedic"
                        ariaLabel="Facebook"
                      />
                      <NeumorphicButton
                        icon="fab fa-twitter"
                        href="https://twitter.com/LimbsOrthopaedic"
                        ariaLabel="Twitter"
                      />
                      <NeumorphicButton
                        icon="fab fa-instagram"
                        href="https://instagram.com/LimbsOrthopaedic"
                        ariaLabel="Instagram"
                      />
                      <NeumorphicButton
                        icon="fab fa-linkedin-in"
                        href="https://linkedin.com/company/LimbsOrthopaedic"
                        ariaLabel="LinkedIn"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-[600px] relative">
                  {!formLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLSe1dmxWhSkZA7gCjXBdjflmxh0nPro3nyERR385CZMZx3mrDw/viewform?embedded=true" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className={formLoaded ? 'opacity-100' : 'opacity-0'}
                    onLoad={handleFormLoad}
                    title="Contact Form"
                  >
                    Loading…
                  </iframe>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 className="text-xl font-bold text-gray-800 p-6 border-b">Find Us</h3>
              <div className="h-[400px] relative">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="loading-spinner"></div>
                  </div>
                )}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7812593240784!2d36.8882!3d-1.2306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTMnNTAuMiJTIDM2wrA1MycxNy41IkU!5e0!3m2!1sen!2sus!4v1655501234567!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className={mapLoaded ? 'opacity-100' : 'opacity-0'}
                  onLoad={handleMapLoad}
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">
              <GradientText>Business Hours</GradientText>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Regular Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium">9:00 AM - 2:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 md:pt-0 md:pl-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Holiday Hours</h3>
                  <p className="text-gray-600 mb-3">
                    Hours may vary during holidays. Please call ahead to confirm our schedule on public holidays.
                  </p>
                  <div className="flex items-center">
                    <div className="bg-[#34bdf2] bg-opacity-10 p-2 rounded-full mr-3">
                      <i className="fas fa-phone text-[#34bdf2] text-sm"></i>
                    </div>
                    <span className="font-medium">+254719628276</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
