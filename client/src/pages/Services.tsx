
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Artificial Limbs (Lower & Upper Limbs)",
    description: "We provide custom prosthetic solutions for individuals with limb differences, focusing on functionality, comfort, and an improved quality of life. Our prostheses are designed using advanced materials to ensure durability and ease of use.",
    id: "artificial-limbs",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Rickets",
    description: "Our specialists diagnose and manage rickets, a condition often caused by vitamin D deficiency. We offer corrective procedures, nutritional guidance, and orthotic solutions to support proper bone growth.",
    id: "rickets",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b3e?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Prosthetic Limbs",
    description: "Our custom-made artificial legs and hands are designed to restore functionality and independence. We tailor each prosthetic to match the unique requirements of our patients.",
    id: "prosthetic-limbs",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Orthotic Insoles for Flat Feet",
    description: "Specialized insoles that provide support and correct flat foot conditions, ensuring comfort and proper alignment throughout your day.",
    id: "orthotics-flat-feet",
    image: "https://images.unsplash.com/photo-1514672013381-c6d0df1c8b18?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Orthopedic Footwear",
    description: "Customized shoes designed to address various foot-related issues, delivering optimal support and lasting comfort.",
    id: "orthopedic-footwear",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Corrective Shoes",
    description: "Tailored footwear solutions that help correct specific foot deformities or conditions, enhancing mobility and reducing pain.",
    id: "corrective-shoes",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Diabetic Footwear",
    description: "Specialized shoes crafted to protect diabetic patients' feet, minimizing the risk of ulcers and other complications.",
    id: "diabetic-footwear",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Custom Braces",
    description: "Supportive braces designed for specific joint conditions, helping to stabilize areas of weakness and promote proper healing.",
    id: "custom-braces",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Services() {
  const [, navigate] = useLocation();

  const handleBooking = () => {
    navigate("/appointment");
  };

  const handleWhatsApp = (service: string) => {
    const message = encodeURIComponent(`Hello *LIMBS Orthopaedic*, I want ${service} ${window.location.href}`);
    window.open(`https://wa.me/254719628276?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden flex flex-col">
            <div className="h-48 sm:h-56 md:h-64 relative overflow-hidden">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="mb-4 text-sm md:text-base flex-1">{service.description}</p>
              <div className="flex flex-col gap-2 mt-auto">
                <Button onClick={handleBooking} className="w-full">
                  Book a Consultation <i className="fas fa-arrow-right ml-2"></i>
                </Button>
                <Button 
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white" 
                  onClick={() => handleWhatsApp(service.title)}
                >
                  <i className="fab fa-whatsapp mr-2"></i>
                  Consult on WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Home-Based Care Services</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm md:text-base">Our team extends its expertise to the comfort of your home. We provide professional care services—such as physical therapy, orthotic fittings, and follow-up consultations—right at your doorstep, ensuring convenience and personalized attention.</p>
            <Button className="mt-4 w-full sm:w-auto" asChild>
              <a href="tel:+254719628276">Call Us +254719628276</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Process</h2>
            <p className="text-xl text-gray-600 mt-2">How We Deliver Custom Solutions</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#34bdf2] opacity-30"></div>
              
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
      <section className="py-16 bg-gradient-to-r from-[#34bdf2] to-[#2193c9]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Book a consultation with our specialists to discuss your specific needs and explore the options available to you.
          </p>
          <Button onClick={() => navigate("/appointment")} variant="secondary" size="lg" className="bg-white text-[#34bdf2] hover:bg-gray-100">
            Book an Appointment
          </Button>
        </div>
      </section>
    </div>
  );
}
